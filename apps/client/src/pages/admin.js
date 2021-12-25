import React from "react";
import { Link } from "gatsby";
import socketIOClient from "socket.io-client";

function reducer(state, action) {
  switch (action.type) {
    case "BUILDING":
      return { ...state, building: true };
    case "BUILT":
      return { ...state, building: false, built: action.payload.timestamp };
    case "FAILED":
      return { ...state, building: false, error: action.payload.error };
    default:
      return state;
  }
}

const initialState = {
  building: false,
  built: null,
  error: null,
};

function Admin() {
  const [{ building, built, error }, dispatch] = React.useReducer(
    reducer,
    initialState
  );
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    socketRef.current = socketIOClient("http://localhost:4001");
    socketRef.current.on("building", (data) => {
      console.log(data);
      dispatch({ type: "BUILDING" });
    });
    socketRef.current.on("built", (data) => {
      console.log(data);
      dispatch({ type: "BUILT", payload: { timestamp: data.timestamp } });
    });
    socketRef.current.on("failed", (data) => {
      console.log(data);
      dispatch({ type: "FAILED", payload: { error: data.error } });
    });
  }, []);
  const handleBuild = () => {
    if (socketRef.current && !building) {
      socketRef.current.emit("build");
      dispatch({ type: "BUILDING" });
    }
  };
  const getLastBuiltDateValue = () => {
    if (built) {
      try {
        const output = new Date(built).toISOString();
        return output
        // Handle invalid date value error
      } catch (e) {
        return "";
      }
    }
  };

  const lastBuilt = getLastBuiltDateValue();
  return (
    <div className="App">
      <Link to="/">Go home</Link>
      <button disabled={building} onClick={handleBuild}>
        Build
      </button>
      {lastBuilt && <div>{lastBuilt}</div>}
      {error && <div>Something went wrong</div>}
    </div>
  );
}

export default Admin;

