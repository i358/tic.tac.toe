import React, { useState, useEffect } from 'react';
import Board from './Board';
import ScoreTable from './ScoreTable';
import { calculateWinner, resetGame } from '../utils/gameUtils';

function Game() {
  const [status, setStatus] = useState('');
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [prevXScore, setPrevXScore] = useState(0);
  const [prevOScore, setPrevOScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
   
    const winner = calculateWinner(nextSquares);
    if (winner) {
      setModalOpen(true);
      if (winner.winner === 'X') {
        setPrevXScore(xScore);
        setXScore(xScore + 1);
      } else {
        setPrevOScore(oScore);
        setOScore(oScore + 1);
      }
      setGameEnded(true);
    } else if (nextSquares.every(square => square !== null)) {
      resetGame(setHistory, setCurrentMove, setModalOpen, setGameEnded);
    }
  }

  useEffect(() => {
    if (calculateWinner(currentSquares)) {
      const timer = setTimeout(() => {
        resetGame(setHistory, setCurrentMove, setModalOpen, setGameEnded);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentSquares]);

  return (
    <div className="game">
      <div className="status">{status}</div>
      <ScoreTable xScore={xScore} setPrevXScore={setPrevXScore} setPrevOScore={setPrevOScore} oScore={oScore} prevXScore={prevXScore} prevOScore={prevOScore} gameEnded={gameEnded} />
      <div className="game-board">
        <Board setStatus={setStatus} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <button className="reset-button" onClick={() => resetGame(setHistory, setCurrentMove, setModalOpen, setGameEnded)}>New Game</button>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>{calculateWinner(currentSquares) ? 'Game Over!' : 'Draw!'}</h2>
            <p>{calculateWinner(currentSquares) ? `${calculateWinner(currentSquares).winner} has won` : 'No winner this time.'}</p>
            <button 
              onClick={() => resetGame(setHistory, setCurrentMove, setModalOpen, setGameEnded)}
              style={{
                '--slist': '#ffda5f, #f9376b',
                background: 'linear-gradient(to right, #ffda5f, #f9376b)',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
