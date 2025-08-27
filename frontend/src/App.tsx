import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import GroupSelect from "./components/GroupSelect";
import ExpensesList from "./components/ExpensesList";
import UserBalance from "./components/UserBalance";
import { Route, Routes } from "react-router-dom";
import AuthCodeExchange from "./pages/AuthCodeExchange";
import { GroupProvider } from "./context/GroupContext";
import CreateGroup from "./pages/CreateGroup";
import LogoutRedirect from "./pages/LogoutRedirect";
import { Box, Paper } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <GroupProvider>
            <Box sx={{ display: "flex", height: "100vh" }}>
              <Sidebar />
              <Paper
                sx={{
                  flexGrow: 1,
                  py: 1,
                  px: 3,
                }}
                component={"main"}
                elevation={3}
              >
                <Box sx={{ display: "flex", pb: 2, gap: 1 }}>
                  <GroupSelect />
                  <UserBalance />
                </Box>
                <div className="w-full">
                  <ExpensesList />
                </div>
              </Paper>
            </Box>
          </GroupProvider>
        }
      />
      <Route path="/auth/:code" element={<AuthCodeExchange />} />
      <Route path="/creategroup" element={<CreateGroup />} />
      <Route path="/logout" element={<LogoutRedirect />} />
    </Routes>
  );
}
export default App;
