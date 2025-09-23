import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { HashRouter } from "react-router-dom";
import { AuthGroupsProvider } from "./context/AuthGroupsContext.tsx";

const queryClient = new QueryClient();
const darkTheme = createTheme({ palette: { mode: "dark" } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <HashRouter>
          <AuthGroupsProvider>
            <App />
          </AuthGroupsProvider>
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
