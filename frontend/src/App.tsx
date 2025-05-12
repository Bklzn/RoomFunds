import { useWhoamiRetrieve } from "./api/whoami/whoami";
import "./App.css";

function App() {
  const { data, status, error } = useWhoamiRetrieve();

  if (status === "pending") {
    return <div>Loading</div>;
  }
  if (status === "error") {
    return <div>An error has occurred: {error.message}</div>;
  }
  if (status === "success")
    return (
      <>
        {console.log(data)}
        <h1>You're logged!</h1>
        {/* <pre style={{ textAlign: "start" }}>{data}</pre> */}
      </>
    );
}

export default App;
