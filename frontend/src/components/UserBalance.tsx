import { CircularProgress, Paper, Typography } from "@mui/material";
import { useApiExpensesList, useApiGroupUsersList } from "../api/api/api";
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
  const { group } = useGroup();
  const expenses = useApiExpensesList({ groupName: group });
  const users = useApiGroupUsersList(group);
  const user = useWhoamiRetrieve();

  if (!expenses.data || !users.data || !user.data) return <BalanceLoading />;

  return (
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
      {expenses.isError || user.isError || users.isError ? (
        <Typography variant="body1" sx={{ color: "error.light" }}>
          {JSON.stringify(expenses.error?.response?.data) ||
            JSON.stringify(user.error?.response?.data) ||
            JSON.stringify(users.error?.response?.data)}
        </Typography>
      ) : (
        (() => {
          const userCount = users.data!.length;
          const totalAmount = expenses.data!.reduce(
            (acc, cur) => acc + Number(cur.amount),
            0
          );
          const userAmount = expenses
            .data!.filter((e) => e.user == String(user.data!.id))
            .reduce((acc, cur) => acc + Number(cur.amount), 0);
          const sharePerUser = totalAmount / userCount;
          const balance = sharePerUser - userAmount;
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
  );
};

export default UserBalance;
