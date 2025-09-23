import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const LogoutRedirect: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = BASE_URL;
  });
  return (
    <CircularProgress
      color="inherit"
      size={50}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default LogoutRedirect;
