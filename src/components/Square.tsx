import React from 'react';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  highlight: boolean;
  winner: { winner: string; line: number[] } | null;
}

function Square({ value, onSquareClick, highlight, winner }: SquareProps) {
  return (
    <button className={`square ${highlight ? 'highlight rainbow grow-shrink' : (winner ? 'fade-out' : '')}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square;
