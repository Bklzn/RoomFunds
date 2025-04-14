import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = document.cookie;
    console.log(token);
    // setUser({token})
  }, [user, document.cookie]);
  return (
    <>
      <h1>You're logged!</h1>
      <pre style={{ textAlign: "start" }}>{user}</pre>
    </>
  );
}

export default App;
