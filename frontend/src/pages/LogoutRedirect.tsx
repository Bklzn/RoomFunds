import { useEffect } from "react";

const LogoutRedirect: React.FC = () => {
  useEffect(() => {
    window.location.href = BASE_URL;
  });
  return <></>;
};

export default LogoutRedirect;
