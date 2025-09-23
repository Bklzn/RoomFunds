import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTokenExchangeRetrieve } from "../api/token/token";
import { CircularProgress } from "@mui/material";

const AuthCodeExchange: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams();

  // due the incepretor configuration, this particular request cannot be used with configured headers
  // exepction has been handled in ../api/client.ts:34
  const api = useTokenExchangeRetrieve(code ?? "");

  useEffect(() => {
    if (!code) {
      navigate("/logout");
      return;
    }
    if (api.isSuccess) {
      localStorage.setItem("access_token", api.data.access_token!);
      localStorage.setItem("refresh_token", api.data.refresh_token!);
      navigate("/");
    }
    if (api.isError) {
      navigate("/logout");
    }
  }, [code, navigate, api]);

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

export default AuthCodeExchange;
