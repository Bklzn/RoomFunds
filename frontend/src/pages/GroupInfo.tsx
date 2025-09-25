import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useGroup } from "../context/GroupContext";
import User from "../components/User";

const GroupInfo: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h5" sx={{ m: 1, mt: 2 }}>
        Group
      </Typography>
      <Typography variant="body1" sx={{ m: 1, mt: 2 }}>
        Info
      </Typography>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography variant="body1">Name:</Typography>
            <Typography variant="body1">&lt;name&gt;</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography variant="body1">Descritpion:</Typography>
            <Typography variant="body1">&lt;Descritpion&gt;</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography variant="body1">Created at:</Typography>
            <Typography variant="body1">&lt;date&gt;</Typography>
          </Box>
        </Box>
      </Paper>
      <Typography variant="body1" sx={{ m: 1, mt: 2 }}>
        Users
      </Typography>
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Total Spent</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <FetchedData />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const FetchedData: React.FC = () => {
  const { users, groups, selectedGroup } = useGroup();
  const group = groups.find((group) => group.name === selectedGroup);
  return users.map((user, idx) => (
    <TableRow key={idx}>
      <TableCell component="th" scope="row" sx={{ p: 0 }}>
        <User variant="all" userId={`${user.id}`} />
      </TableCell>
      <TableCell align="right">0</TableCell>
      <TableCell align="right">0</TableCell>
      <TableCell align="right">
        {group?.owner === String(user.id)
          ? "Owner"
          : group?.moderators.includes(String(user.id))
          ? "Moderator"
          : "Member"}
      </TableCell>
      <TableCell align="right">&lt;options&gt;</TableCell>
    </TableRow>
  ));
};

export default GroupInfo;
