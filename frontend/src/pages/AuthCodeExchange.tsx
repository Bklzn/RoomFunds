import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTokenExchangeRetrieve } from "../api/token/token";

const AuthCodeExchange: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams();

  // due the incepretor configuration, this particular request cannot be used with configured headers
  // exepction has been handled in ../api/client.ts:34
  const api = useTokenExchangeRetrieve(code ?? "");

  useEffect(() => {
    if (!code) {
      navigate("/login");
      return;
    }
    if (api.isSuccess) {
      localStorage.setItem("access_token", api.data.access_token!);
      localStorage.setItem("refresh_token", api.data.refresh_token!);
      navigate("/");
    }
    if (api.isError) {
      navigate("/login");
    }
  }, [code, navigate, api]);

  return <p>Logging in...</p>;
};

export default AuthCodeExchange;
