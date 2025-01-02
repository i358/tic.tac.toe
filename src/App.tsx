import React, { useEffect } from 'react';
import Game from './components/Game';
import './styles/main.scss';
import { WS } from './utils/websocket';

function App() {
WS.on("connect", ()=>{
const ws = WS.getWebSocket();
ws?.send(JSON.stringify({e: "heartbeat"}))
})
return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
