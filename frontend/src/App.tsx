import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ExpensesList from "./components/ExpensesList";
import { Route, Routes } from "react-router-dom";
import { GroupProvider } from "./context/GroupContext";
import { Box, Paper } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Paper
        sx={{
          flexGrow: 1,
          py: 1,
          px: 3,
          position: "relative",
        }}
        component={"main"}
        elevation={3}
      >
        <Routes>
          <Route
            path="*"
            element={
              <GroupProvider>
                <div className="w-full">
                  <ExpensesList />
                </div>
              </GroupProvider>
            }
          />
        </Routes>
      </Paper>
    </Box>
  );
}
export default App;
