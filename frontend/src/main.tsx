import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthGroupsProvider } from "./context/AuthGroupsContext.tsx";
import AuthCodeExchange from "./pages/AuthCodeExchange.tsx";
import LogoutRedirect from "./pages/LogoutRedirect.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
const darkTheme = createTheme({ palette: { mode: "dark" } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <HashRouter>
          <Routes>
            <Route
              path="*"
              element={
                <AuthGroupsProvider>
                  <App />
                </AuthGroupsProvider>
              }
            />
            <Route path="/auth/:code" element={<AuthCodeExchange />} />
            <Route path="/logout" element={<LogoutRedirect />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
