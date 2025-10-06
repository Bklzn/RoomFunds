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
import DeleteModal from "../components/DeleteModal";
import { useState } from "react";
import { useApiGroupDestroy } from "../api/api/api";
import { AxiosError } from "axios";
import { useHandleLocalGroupDeletation } from "../hooks/hooks";

const GroupInfo: React.FC = () => {
  const { groups, selectedGroup } = useGroup();
  const group = groups.filter((g) => g.slug === selectedGroup)[0];
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Tooltip title="In development" arrow>
            <Box>
              <Button
                variant="contained"
                startIcon={<Edit />}
                fullWidth
                disabled
              >
                Edit
              </Button>
            </Box>
          </Tooltip>
          <DeleteGroupModal />
        </Box>
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
  const group = groups.filter((g) => g.slug === selectedGroup)[0];
  const totalAmount = Number(group.total_amount);

  return users.map((user, idx) => {
    const userAmount = Number(user.total_group_expenses);
    const sharePerUser = totalAmount / userCount;
    const userBalance = userAmount - sharePerUser;
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

const DeleteGroupModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedGroup, groups } = useGroup();
  const groupName = groups.filter((g) => g.slug === selectedGroup)[0].name;
  const groupDestroy = useApiGroupDestroy();
  const { handleMutation } = useHandleLocalGroupDeletation();
  const deleteGroup = async () => {
    setLoading(true);
    setError("");
    await groupDestroy
      .mutateAsync({
        slug: selectedGroup,
      })
      .then(async () => {
        await handleMutation();
        setLoading(false);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof AxiosError) {
          if (err.response) setError(err.response.statusText);
          else setError(err.message);
        } else {
          setError(err.response.data.message);
        }
        setLoading(false);
      });
  };
  return (
    <Box>
      <Button
        variant="outlined"
        color="error"
        startIcon={<Delete />}
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <DeleteModal
        open={open}
        loading={loading}
        error={error}
        setOpen={setOpen}
        onDisagree={() => setOpen(false)}
        onAgree={deleteGroup}
        title="Delete group"
        description={
          <Box color={"text.secondary"}>
            <Typography sx={{ display: "inline" }}>
              You are about to delete{" "}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                display: "inline",
              }}
            >
              {groupName}
            </Typography>
            <Typography sx={{ display: "inline" }}>
              {" "}
              group. This process cannot be undone. All data associated with
              this group will be also deleted (expenses)
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};

export default GroupInfo;
