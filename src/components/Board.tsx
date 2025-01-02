import React, { useEffect } from 'react';
import Square from './Square';
import { calculateWinner } from '../utils/gameUtils';
import { WS } from '../utils/websocket';
let ws:any;

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
  setStatus: (status: string) => void;
}

function Board({ xIsNext, squares, onPlay, setStatus }: BoardProps) {
  const handleMessage = (m:any) => {
    console.log(m)
    let [protocol, event] = m["e"].split(":");
    if(protocol || event) {
      if(protocol == "wss"){
        if(m["t"] == "game"){
          if(event=="pressed") {
            let s = m["p"]["s"]
            if (calculateWinner(squares) || squares[s]) {
              return;
            }
            const nextSquares = squares.slice();
            nextSquares[s] = xIsNext ? 'X' : 'O';
            onPlay(nextSquares);
        }
      }
    }
  }
}
  useEffect(()=>{
    WS.on("message", handleMessage)
    ws = WS.getWebSocket();
    return () => {
      WS.off("message", handleMessage);
    };
  }, [])
  function handleClick(i: number) {
 
    let payload = {
      u:"358",
      s: i
    }
   //@ts-ignore
      ws.send(JSON.stringify({e:"game:pressed", "m":payload}))
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  if (winner) {
    setStatus(`${winner.winner} has won`);
  } else if (squares.every(square => square !== null)) {
    setStatus('BOTH TIED');
  } else {
    setStatus('Next player: ' + (xIsNext ? 'X' : 'O'));
  }

  return (
    <div>
      <div className="board">
        {Array(9).fill(null).map((_, i) => {
          const highlight:any = winner && winner.line.includes(i);
          return (
            <Square 
              key={i} 
              value={squares[i]} 
              onSquareClick={() => handleClick(i)} 
              highlight={highlight}
              winner={winner}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;
