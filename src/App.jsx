import React from 'react';
import Game from './components/Game';
import './styles/main.scss';

let ws;
let ping;
let try_reconnect = setInterval(()=>{}, 10000)

const Socket = () => {
ws = new WebSocket("ws://localhost:4000/ws/")
clearInterval(try_reconnect)
ws.onopen = (e) => { 
  console.log('WebSocket connection established');
  ping = setInterval(()=>{
    ws.send(JSON.stringify({e: "ping"}))
    console.log("sent ping")
  }, 14405)
}

ws.onmessage = (m) => {
  console.log(m.data)
}

ws.onclose = (r) => {
  clearInterval(ping)
  console.log('WebSocket connection closed', r.code, r.reason);
  try_reconnect = setInterval(Socket(), 5800)
}

}

Socket()

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
