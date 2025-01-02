import React, { useEffect, useState } from 'react';
import Game from './components/Game';
import './styles/main.scss';
import { WS } from './utils/websocket';
import { asyncTimeout } from './utils/gameUtils';

function App() {
  const [ws_connected, setWSConnected] = useState<boolean>(false);
  const [connectionTimeout, setConnectionTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showConnectionProblemLink, setShowConnectionProblemLink] = useState<boolean>(false);

  useEffect(() => {
    WS.on("connect", async() => {
      await asyncTimeout(1500);
      setWSConnected(true);
      clearTimeout(connectionTimeout!);
      setShowConnectionProblemLink(false);
    });

    WS.on("disconnect", ()=>{
      setWSConnected(false)
      clearTimeout(connectionTimeout!);
      setConnectionTimeout(setTimeout(() => {
        setShowConnectionProblemLink(true);
      }, 10000));
    })

    setConnectionTimeout(setTimeout(() => {
      setShowConnectionProblemLink(true);
    }, 10000));

    return () => {
      clearTimeout(connectionTimeout!);
    };
  }, []);

  return (
    <div className="App">
      {!ws_connected ? (
        <div className="loading-screen">
          <div className="loading-animation">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="loading-text">Connecting to WebSocket...</p>
          </div>
          {showConnectionProblemLink && (
            <a href="https://discord.gg/Nr2zG7rUB7" className="connection-problem-link">
              Connection Problems? Contact Us
            </a>
          )}
        </div>
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App;
