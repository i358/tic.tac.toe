export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export function resetGame(setHistory, setCurrentMove, setModalOpen, setGameEnded) {
  document.querySelector('.game').classList.add('reset-animation');
  setTimeout(() => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setModalOpen(false);
    setGameEnded(false);
    document.querySelector('.game').classList.remove('reset-animation');
  }, 1000);
}
