import React from 'react';
import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin, { Node, Socket, Control } from 'rete-react-render-plugin';
import createEditor from "./rete"
import logo from './Antemonilogo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Welcome to Antemoni, Hello!
        </h1>
      </header>
      <body>
        <div ref={ref => ref && createEditor(ref)}>

        </div>
      </body>
    </div>
  );
}

export default App;
