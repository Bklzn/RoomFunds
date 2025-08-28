import {
  Avatar,
  Box,
  BoxProps,
  Paper,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { useGroup } from "../context/GroupContext";
import { User as UserApi } from "../api/model";

interface Props extends BoxProps {
  userId: string;
  variant?: "avatar" | "hover" | "all";
}

const User: React.FC<Props> = ({ userId, variant = "all", ...boxProps }) => {
  const { users } = useGroup();

  const user = users.find((user) => String(user.id) == userId);

  if (variant === "avatar") {
    return user ? (
      <UserAvatar src={user.avatar} alt={user?.display || "no-user"} />
    ) : (
      <Tooltip
        title={<NoUserError />}
        slots={{
          transition: Zoom,
        }}
      >
        <Box {...boxProps}>
          <UserAvatar src={user!.avatar} alt={"no-user"} />
        </Box>
      </Tooltip>
    );
  }

  if (variant === "hover")
    return user ? (
      <UserHover user={user} boxProps={boxProps} />
    ) : (
      <NoUserError />
    );

  if (variant === "all")
    return user ? <UserAllInfo user={user} /> : <NoUserError />;
};

export const UserHover: React.FC<{ user: UserApi; boxProps: BoxProps }> = ({
  user,
  boxProps,
}) => (
  <Tooltip
    title={user ? <UserAllInfo user={user} /> : <NoUserError />}
    slots={{
      transition: Zoom,
    }}
    placement="left"
    slotProps={{
      tooltip: {
        style: {
          background: "none",
          margin: 0,
        },
      },
    }}
  >
    <Box {...boxProps}>
      <UserAvatar
        src={user?.avatar || "no-user.png"}
        alt={user?.display || "No-user"}
      />
    </Box>
  </Tooltip>
);

export const UserAvatar: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => (
  <Avatar
    src={src}
    alt={alt}
    sx={{
      width: "100%",
      height: "100%",
      minWidth: "30px",
      aspectRatio: "1/1",
      position: "relative",
      bgcolor: "error.light",
      color: "error.dark",
      fontSize: "1.5rem",
    }}
    slotProps={{
      img: {
        referrerPolicy: "no-referrer",
      },
    }}
  />
);

export const UserAllInfo: React.FC<{ user: UserApi }> = ({ user }) => (
  <Box
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
      maxWidth: 400,
    }}
  >
    <Box sx={{ aspectRatio: "1/1", width: 60 }}>
      <UserAvatar src={user.avatar} alt={user.display} />
    </Box>
    <Box>
      <Typography variant="h6">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {user.email}
      </Typography>
    </Box>
  </Box>
);

export const NoUserError: React.FC = () => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
      maxWidth: 400,
      border: "1px solid",
      borderColor: "error.light",
    }}
  >
    <Box sx={{ padding: "0 10px" }}>
      <Typography variant="h6" color="error.light">
        Error
      </Typography>
      <Typography variant="body2" color="error.light">
        User not found
      </Typography>
    </Box>
  </Paper>
);

export default User;
