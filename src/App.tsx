import React, { useEffect, useState } from 'react';
import './styles/main.scss';
import { WS } from './utils/websocket';
import { asyncTimeout } from './utils/gameUtils';
import { useCookies } from 'react-cookie';
import Auth from './components/auth/Auth';

function App() {
  const [cookies] = useCookies()
  const [ws_connected, setWSConnected] = useState<boolean>(false);
  const [connectionTimeout, setConnectionTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showConnectionProblemLink, setShowConnectionProblemLink] = useState<boolean>(false);

  const particles = Array.from({ length: 50 }, (_, i) => (
    <div key={`particle-${i}`} className="particle" />
  ));


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

  
const token = cookies["_auth_token"];

  return (
    <div className="app">
      {particles}
      {!ws_connected ? (
        <div className="loading-screen">
          <div className="loading-animation">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="loading-text">Connecting to Gateway</p>
          </div>
          {showConnectionProblemLink && (
            <a href="https://support.tictactox.online" className="connection-problem-link">
              Connection Problems? Contact Us
            </a>
          )}
        </div>
      ) : !token ? (<Auth />) : (<>hi</>) }
    </div>
  );
}


export default App;
