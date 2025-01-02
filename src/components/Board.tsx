import React from 'react';
import Square from './Square';
import { calculateWinner } from '../utils/gameUtils';

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
  setStatus: (status: string) => void;
}

function Board({ xIsNext, squares, onPlay, setStatus }: BoardProps) {
  function handleClick(i: number) {
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
          const highlight = winner && winner.line.includes(i);
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
