import React from 'react';

function Square({ value, onSquareClick, highlight, winner }) {
  return (
    <button className={`square ${highlight ? 'highlight rainbow grow-shrink' : (winner ? 'fade-out' : '')}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square;
