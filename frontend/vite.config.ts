import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    base: "/RoomFunds",
    define: {
      BASE_URL: JSON.stringify(env.baseUrl),
    },
    preview: {
      allowedHosts: ["localhost", `${env.allowedHost}`],
    },
    server: {
      allowedHosts: ["localhost", `${env.allowedHost}`],
    },
  };
});
