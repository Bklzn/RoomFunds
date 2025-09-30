import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useApiExpensesList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";
import Category from "./Category";
import User from "./User";
import { useEffect, useState } from "react";
import ExpenseAddForm from "./ExpenseAddForm";

const ExpensesList: React.FC = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h5" sx={{ m: 1, mt: 2 }}>
        Expenses
      </Typography>
      <Paper elevation={0}>
        <Stack direction="row" justifyContent={"space-between"}>
          <ExpenseAddForm sx={{ display: "inline-flex", pl: 1 }} />
          <TablePagination
            sx={{ display: "inline" }}
            rowsPerPageOptions={[5, 10, 25]}
            component={Paper}
            elevation={0}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, page) => setPage(page)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Stack>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "70vh", overflow: "auto" }}
        >
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <FetchedData
                onFetch={setCount}
                page={page}
                rowsPerPage={rowsPerPage}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component={Paper}
          elevation={0}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, page) => setPage(page)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};

const FetchedData: React.FC<{
  onFetch: (count: number) => void;
  page: number;
  rowsPerPage: number;
}> = ({ onFetch, page, rowsPerPage }) => {
  const { selectedGroup } = useGroup();
  const expenses = useApiExpensesList(
    { slug: selectedGroup },
    {
      query: {
        queryKey: ["expenses", selectedGroup],
      },
    }
  );
  useEffect(() => {
    if (expenses.isSuccess) {
      onFetch(expenses.data!.length);
    }
    if (expenses.isError) {
      onFetch(0);
    }
  }, [expenses.data, expenses.isError, expenses.isSuccess, onFetch]);

  if (expenses.isLoading) {
    return <LoadingList rowsPerPage={rowsPerPage} />;
  }

  if (expenses.isError) {
    return <TableCell colSpan={4}>{expenses.error.message}</TableCell>;
  }

  if (expenses.isSuccess) {
    return (
      <>
        {expenses
          .data!.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, idx) => (
            <TableRow key={idx}>
              <TableCell component="th" scope="row">
                {new Date(row.date).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">
                <Category categoryId={row.category} />
              </TableCell>
              <TableCell>
                <User
                  variant="hover"
                  userId={row.user}
                  sx={{ width: 30, marginLeft: "auto" }}
                />
              </TableCell>
            </TableRow>
          ))}
      </>
    );
  }
};
const LoadingList: React.FC<{ rowsPerPage: number }> = ({ rowsPerPage }) => {
  return (
    <>
      {Array.from({ length: rowsPerPage }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton animation="wave" sx={{ width: "100%", height: 25 }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
export default ExpensesList;
