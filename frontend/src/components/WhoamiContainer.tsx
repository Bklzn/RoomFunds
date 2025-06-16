import { Box, Paper, Skeleton } from "@mui/material";
import { useWhoamiRetrieve } from "../api/whoami/whoami";
import User from "./User";

const WhoamiContainer: React.FC = () => {
  const user = useWhoamiRetrieve();
  if (user.isLoading) {
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
        <Skeleton variant="circular" width={56} height={56} />
        <Box>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={180} height={20} />
        </Box>
      </Paper>
    );
  }
  return <User userId={user.data?.id ? String(user.data?.id) : "no-id"} />;
};

export default WhoamiContainer;
