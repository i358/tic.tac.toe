import React, { useState, useEffect } from 'react';

function ScoreTable({ xScore, oScore }) {
  const [prevXScore, setPrevXScore] = useState(xScore);
  const [prevOScore, setPrevOScore] = useState(oScore);
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
          <td className={`score-cell ${xAnimating ? 'slide-out' : ''}`}>{xScore}</td>
          <td className={`score-cell ${oAnimating ? 'slide-out' : ''}`}>{oScore}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default ScoreTable;