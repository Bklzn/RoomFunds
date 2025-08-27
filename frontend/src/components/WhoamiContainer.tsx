import { BoxProps, Skeleton, Stack } from "@mui/material";
import { useWhoamiRetrieve } from "../api/whoami/whoami";
import User from "./User";

interface Props extends BoxProps {
  variant?: "avatar" | "hover" | "all";
}

const WhoamiContainer: React.FC<Props> = ({ variant = "all", ...boxProps }) => {
  const user = useWhoamiRetrieve();
  if (user.isLoading) {
    return (
      <Stack direction="row" spacing={3} sx={{ m: 2 }}>
        <Skeleton variant="circular" width={56} height={56} />
        <Stack direction="column">
          <Skeleton variant="text" width={110} height={24} />
          <Skeleton variant="text" width={150} height={20} />
        </Stack>
      </Stack>
    );
  }
  return (
    <User
      variant={variant}
      userId={user.data?.id ? String(user.data?.id) : "no-id"}
      {...boxProps}
    />
  );
};

export default WhoamiContainer;
