import React from 'react';
import Game from './components/Game';
import './styles/main.scss';

const ws = new WebSocket("ws://localhost:4000/ws/")

ws.onopen = (e) => { 
  console.log('WebSocket connection established');
}

ws.onmessage = (m) => {
  console.log(m.data)
}

ws.onclose = (r) => {
  console.log('WebSocket connection closed', r.code, r.reason);
}


function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
