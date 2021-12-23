import React from 'react'
import './App.css';

function App() {
  const [response, setResponse] = React.useState(null)
  const handleBuild = () => {
    fetch('/api/build', {method: "GET"}).then(res => res.json()).then(setResponse)
  }
  return (
    <div className="App">
    <button onClick={handleBuild}>Build</button>
    <pre>{JSON.stringify(response, undefined, 2)}</pre>
    </div>
  );
}

export default App;
