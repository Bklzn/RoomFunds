import {
  Box,
  CircularProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGroup } from "../context/GroupContext";
import { useWhoamiRetrieve } from "../api/whoami/whoami";

const UserBalance: React.FC = () => {
  const { state } = useGroup();

  if (state === "loading") return <BalanceLoading />;

  if (state === "error" || state === "empty") return <BalanceError />;

  return <BalanceSuccess />;
};

const BalanceLoading: React.FC = () => (
  <Paper
    elevation={3}
    sx={{
      px: 1,
      py: 1,
      pr: 3,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      Your balance:
    </Typography>
    <CircularProgress size={25} color="inherit" />
  </Paper>
);

const BalanceError: React.FC = () => (
  <Paper
    elevation={3}
    sx={{
      px: 1,
      py: 1,
      pr: 3,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      Your balance:
    </Typography>
    <Typography variant="h5">---</Typography>
  </Paper>
);

const BalanceSuccess: React.FC = () => {
  const { selectedGroup, groups, users } = useGroup();
  const group = groups.filter((g) => g.slug === selectedGroup)[0];
  const whoami = useWhoamiRetrieve();

  const totalAmount = Number(group.total_amount);
  const sharePerUser = totalAmount / users.length;
  if (!whoami.data || !users.length) return <BalanceLoading />;

  const userAmount = Number(
    users.filter((u) => u.id === whoami.data!.id)[0].total_group_expenses
  );
  const balance = userAmount - sharePerUser;

  return (
    <Tooltip
      placement="right-start"
      title={<TooltipBox totalAmount={totalAmount} userAmount={userAmount} />}
      slotProps={{
        tooltip: {
          style: {
            background: "none",
            margin: 0,
            paddingTop: 0,
          },
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          px: 1,
          py: 1,
          pr: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Your balance:
        </Typography>
        {whoami.isError ? (
          <Typography variant="body1" sx={{ color: "error.light" }}>
            {JSON.stringify(whoami.error?.response?.data)}
          </Typography>
        ) : (
          (() => {
            return (
              <Typography
                variant="h5"
                sx={{
                  color:
                    balance > 0
                      ? "success.light"
                      : balance < 0
                      ? "error.light"
                      : "white",
                }}
              >
                {balance.toFixed(2)}
              </Typography>
            );
          })()
        )}
      </Paper>
    </Tooltip>
  );
};

export const TooltipBox: React.FC<{
  totalAmount: number;
  userAmount: number;
}> = ({ totalAmount, userAmount }) => {
  return (
    <Paper
      sx={{ display: "flex", flexDirection: "row", gap: 1, p: 1 }}
      elevation={5}
    >
      <Box>
        <Typography variant="caption" color="text.secondary">
          Total amount:
        </Typography>
        <Typography variant="body1">{totalAmount.toFixed(2)}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Your amount:
        </Typography>
        <Typography variant="body1">{userAmount.toFixed(2)}</Typography>
      </Box>
    </Paper>
  );
};

export default UserBalance;
