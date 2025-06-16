import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import WhoamiContainer from "./components/WhoamiContainer";
import GroupSelect from "./components/GroupSelect";
import ExpensesList from "./components/ExpensesList";
import ExpenseAddForm from "./components/ExpenseAddForm";

function App() {
  return (
    <>
      <div className="py-5 flex flex-row justify-between w-full">
        <GroupSelect />
        <WhoamiContainer />
      </div>
      <div className="w-full h-full">
        <ExpensesList />
        <ExpenseAddForm />
      </div>
    </>
  );
}
export default App;
