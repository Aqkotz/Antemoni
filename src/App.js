import React from 'react';
import { createEditor } from "./rete"
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <body>
        <div id="workspace">
          <div id ="nodes_workspace">
            <div class="hcontainer">
              <div class="overlay" id="toolbar">
              </div>
            </div>
            <div class="table">
              <div class="hcontainer">
                <div class="overlay" id="content-browser"></div>
                <div id="editor" ref={ref => ref && createEditor(ref)}></div>
              </div>
            </div>
          </div>
          <div id="text_render">
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
