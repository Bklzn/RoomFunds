import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UserContainer from "./components/UserContainer";

function App() {
  return (
    <>
      <div className="py-5 flex flex-col justify-beetween">
        <UserContainer />
      </div>
      <div className="w-full h-full"></div>
    </>
  );
}
export default App;
