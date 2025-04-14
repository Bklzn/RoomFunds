import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log(env);
  return {
    plugins: [react()],
    define: {
      OAUTH_CLIENTID: new String(env.OAuth_ClientID),
    },
  };
});
