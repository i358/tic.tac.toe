import React from 'react';
import Game from './components/Game';
import './styles/main.scss';

let ws: WebSocket;
let ping: ReturnType<typeof setInterval>;
let timeout: number = 0;
let try_reconnect = setInterval(() => {}, 10000);

const Socket = () => {
  ws = new WebSocket("ws://localhost:4000/ws/");
  clearInterval(try_reconnect);
  ws.onopen = (e) => { 
    if(timeout>0){
      ping = setInterval(() => {
        ws.send(JSON.stringify({e: "heartbeat"}));
        console.log("sent ping");
      }, timeout);
    }
  };

  ws.onmessage = (m) => {
    let data = JSON.parse(m.data);
    if(data["e"]=="server_hello") {
    console.log('WebSocket connection established');
      timeout = data["heartbeat_interval"]
    }
    console.log(data)
  };

  ws.onclose = (r) => {
    clearInterval(ping);
    console.log('WebSocket connection closed', r.code, r.reason);
    try_reconnect = setInterval(Socket, 5800);
  };
};

Socket();

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
