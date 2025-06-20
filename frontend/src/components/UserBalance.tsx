import { Paper, Skeleton, Typography } from "@mui/material";
import { useApiExpensesList, useApiGroupUsersList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";
import { useWhoamiRetrieve } from "../api/whoami/whoami";

const UserBalance: React.FC = () => {
  const { group } = useGroup();
  const expenses = useApiExpensesList({ groupName: group });
  const users = useApiGroupUsersList(group);
  const user = useWhoamiRetrieve();

  return (
    <Paper elevation={3} sx={{ px: 4, py: 2, textAlign: "center" }}>
      <Typography variant="h5">Your Balance</Typography>
      {expenses.isLoading || user.isLoading || users.isLoading ? (
        <Skeleton variant="rectangular" width={100} height={20} />
      ) : expenses.isError || user.isError || users.isError ? (
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
              variant="h4"
              sx={{
                color:
                  balance > 0
                    ? "success.light"
                    : balance < 0
                    ? "error.light"
                    : "white",
              }}
            >
              {balance}
            </Typography>
          );
        })()
      )}
    </Paper>
  );
};

export default UserBalance;
