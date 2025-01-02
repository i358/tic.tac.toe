import React, { useEffect, useState } from 'react';
import Game from './components/Game';
import './styles/main.scss';
import { WS } from './utils/websocket';

function App() {
  const [ws_connected, setWSConnected] = useState<boolean>(false);
WS.on("connect", () => {
  setWSConnected(true);
})

return (
    <div className="App">
     { ws_connected ?  <Game /> : <>Waiting for WebSocket connection...</> }
    </div>
  );
}

export default App;
