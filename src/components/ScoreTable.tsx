import React, { useState, useEffect } from 'react';

interface ScoreTableProps {
  xScore: number;
  oScore: number;
  prevXScore: number;
  prevOScore: number;
  gameEnded: boolean;
}

function ScoreTable({ xScore, oScore, prevXScore, prevOScore, gameEnded }: ScoreTableProps) {
  const [xAnimating, setXAnimating] = useState(false);
  const [oAnimating, setOAnimating] = useState(false);

  useEffect(() => {
    if (xScore !== prevXScore) {
      setXAnimating(true);
      const timer = setTimeout(() => {
        setXAnimating(false);
        setPrevXScore(xScore);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [xScore, prevXScore]);

  useEffect(() => {
    if (oScore !== prevOScore) {
      setOAnimating(true);
      const timer = setTimeout(() => {
        setOAnimating(false);
        setPrevOScore(oScore);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [oScore, prevOScore]);

  return (
    <table className="score-table">
      <thead>
        <tr>
          <th>Player X</th>
          <th>Player O</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-score={xScore} data-prev-score={prevXScore} className={`score-cell ${xAnimating ? 'slide' : ''}`}>{xScore}</td>
          <td data-score={oScore} data-prev-score={prevOScore} className={`score-cell ${oAnimating ? 'slide' : ''}`}>{oScore}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default ScoreTable;
