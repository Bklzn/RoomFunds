import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import WhoamiContainer from "./components/WhoamiContainer";
import GroupSelect from "./components/GroupSelect";
import ExpensesList from "./components/ExpensesList";
import ExpenseAddForm from "./components/ExpenseAddForm";
import UserBalance from "./components/UserBalance";
import { Route, Routes } from "react-router-dom";
import AuthCodeExchange from "./pages/AuthCodeExchange";
import { GroupProvider } from "./context/GroupContext";
import CreateGroup from "./pages/CreateGroup";

function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <GroupProvider>
            <div className="py-5 flex flex-row justify-between w-full">
              <GroupSelect />
              <UserBalance />
              <WhoamiContainer />
            </div>
            <div className="w-full h-full">
              <ExpensesList />
              <ExpenseAddForm />
            </div>
          </GroupProvider>
        }
      />
      <Route path="/auth/:code" element={<AuthCodeExchange />} />
      <Route path="/creategroup" element={<CreateGroup />} />
    </Routes>
  );
}
export default App;
