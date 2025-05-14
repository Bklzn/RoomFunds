import { Avatar, Box, Paper, Skeleton, Typography } from "@mui/material";
import { useWhoamiRetrieve } from "../api/whoami/whoami";

const UserContainer: React.FC = () => {
  const user = useWhoamiRetrieve();
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        maxWidth: 400,
      }}
    >
      {user.status === "pending" ? (
        <>
          <Skeleton variant="circular" width={56} height={56} />
          <Box>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={180} height={20} />
          </Box>
        </>
      ) : (
        <>
          <Avatar
            src={user.data!.avatar}
            alt={user.data!.display}
            sx={{ width: 56, height: 56 }}
            slotProps={{
              img: {
                referrerPolicy: "no-referrer",
              },
            }}
          />
          <Box>
            <Typography variant="h6">
              {user.data!.first_name} {user.data!.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.data!.email}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default UserContainer;
