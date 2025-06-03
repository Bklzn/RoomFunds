import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useApiExpensesList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";

const ExpensesList: React.FC = () => {
  const { group } = useGroup();
  const expenses = useApiExpensesList(
    { groupName: group },
    {
      query: {
        queryKey: ["expenses"],
      },
    }
  );
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.isLoading ? (
            <LoadingList />
          ) : expenses.isError ? (
            <TableCell colSpan={4}>{expenses.error.message}</TableCell>
          ) : (
            expenses.data!.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {new Date(row.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.category_display}</TableCell>
                <TableCell align="right">{row.user}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const LoadingList: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton animation="wave" sx={{ width: "100%" }} />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" sx={{ width: "100%" }} />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" sx={{ width: "100%" }} />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" sx={{ width: "100%" }} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
export default ExpensesList;
