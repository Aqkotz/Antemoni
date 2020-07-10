import React from 'react';
import { createEditor } from "./rete"
import logo from './Antemonilogo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*
        <h1>
          Antemoni Editor:
        </h1>
        */}
      </header>
      <body>
        <div style={{ width: "100vw", height: "100vh" }} ref={ref => ref && createEditor(ref)}>

        </div>
      </body>
    </div>
  );
}

export default App;
