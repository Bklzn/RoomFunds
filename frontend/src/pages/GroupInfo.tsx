import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGroup } from "../context/GroupContext";
import User from "../components/User";
import { Group } from "../api/model";
import { AddModerator, Delete, Edit } from "@mui/icons-material";
import DateFormat from "../components/DateFormat";

const GroupInfo: React.FC = () => {
  const { groups, selectedGroup } = useGroup();
  const group = groups.filter((g) => g.name === selectedGroup)[0];
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
      {/* <Typography variant="body1" sx={{ m: 2, mt: 2, mb: 0.5 }}>
        General info
      </Typography> */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          gap: 2,
          direction: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Typography variant="body1">Name:</Typography>
            <Typography variant="body1">{group.name}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Typography variant="body1">Descritpion:</Typography>
            {group.description ? (
              <Typography variant="body1">{group.description}</Typography>
            ) : (
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ fontStyle: "italic", mt: "0.2em" }}
              >
                No description
              </Typography>
            )}
          </Box>
        </Box>
        <Tooltip title="In development" arrow>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="contained" startIcon={<Edit />} disabled>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              disabled
            >
              Delete
            </Button>
          </Box>
        </Tooltip>
      </Paper>
      <Typography variant="body1" sx={{ m: 2, mt: 3, mb: 0.5 }}>
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
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Joined At</TableCell>
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
  const userCount = users.length;
  const group = groups.filter((g) => g.name === selectedGroup)[0];

  return users.map((user, idx) => {
    const userAmount = Number(user.total_group_expenses);
    const sharePerUser = userAmount / userCount;
    const userBalance = sharePerUser - userAmount;
    return (
      <TableRow key={idx}>
        <TableCell component="th" scope="row" sx={{ p: 0 }}>
          <User variant="all" userId={`${user.id}`} />
        </TableCell>
        <TableCell
          align="right"
          sx={{
            color:
              userBalance > 0
                ? "success.light"
                : userBalance < 0
                ? "error.light"
                : "white",
          }}
        >
          {userBalance.toFixed(2)}
        </TableCell>
        <TableCell align="right">{userAmount.toFixed(2)}</TableCell>
        <TableCell align="center">
          <RoleBadge group={group} userId={String(user.id)} />
        </TableCell>
        <TableCell align="center">
          <DateFormat dateStr={user.joined_at} />
        </TableCell>
        <TableCell align="right">
          <UserOptions />
        </TableCell>
      </TableRow>
    );
  });
};

const RoleBadge: React.FC<{ group: Group; userId: string }> = ({
  group,
  userId,
}) => {
  if (group.owner === userId)
    return <Chip label="Owner" color="secondary" variant="outlined" />;
  if (group.moderators.includes(userId))
    return <Chip label="Moderator" color="primary" variant="outlined" />;
  return <Chip label="Member" color="default" variant="outlined" />;
};

const UserOptions: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      <Tooltip title="Edit role (in development)" arrow>
        <Box>
          <IconButton aria-label="edit role" disabled>
            <AddModerator />
          </IconButton>
        </Box>
      </Tooltip>
      <Tooltip title="Delete user (in development)" arrow>
        <Box>
          <IconButton aria-label="delete user" color="error" disabled>
            <Delete />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default GroupInfo;
