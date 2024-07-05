import { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 3;
const PLAYER_COLORS = ["orange", "blue"];
const TOKEN_SIZES = [1, 2, 3];

function App() {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerTokens, setPlayerTokens] = useState([
    { 1: 3, 2: 3, 3: 3 },
    { 1: 3, 2: 3, 3: 3 },
  ]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    checkWinner();
    console.log(board);
  }, [board]);

  const placeToken = (row, col, size) => {
    if (winner) return;

    const currentToken = board[row][col];
    if (currentToken && currentToken.size >= size) return;

    if (playerTokens[currentPlayer][size] === 0) return;

    const newBoard = [...board];
    newBoard[row][col] = { player: currentPlayer, size };
    setBoard(newBoard);

    const newPlayerTokens = [...playerTokens];
    newPlayerTokens[currentPlayer][size]--;
    setPlayerTokens(newPlayerTokens);

    setCurrentPlayer(1 - currentPlayer);
  };

  const checkWinner = () => {
    // Check rows, columns, and diagonals
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (
        checkLine(board[i][0], board[i][1], board[i][2]) ||
        checkLine(board[0][i], board[1][i], board[2][i])
      ) {
        return;
      }
    }
    if (
      checkLine(board[0][0], board[1][1], board[2][2]) ||
      checkLine(board[0][2], board[1][1], board[2][0])
    ) {
      return;
    }

    // Check for a draw
    if (board.every((row) => row.every((cell) => cell !== null))) {
      setWinner("draw");
    }
  };

  const checkLine = (a, b, c) => {
    if (a && b && c && a.player === b.player && b.player === c.player) {
      setWinner(a.player);
      return true;
    }
    return false;
  };

  const renderCell = (row, col) => {
    const token = board[row][col];
    return (
      <div className="cell">
        {TOKEN_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => placeToken(row, col, size)}
            disabled={
              winner ||
              (token && token.size >= size) ||
              playerTokens[currentPlayer][size] === 0
            }
            className={`token size-${size}`}
            style={{
              backgroundColor: token
                ? PLAYER_COLORS[token.player]
                : "transparent",
            }}
          >
            {size}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>3D Tic-Tac-Toe</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      <div className="info">
        {winner === "draw" ? (
          <h3>It's a draw!</h3>
        ) : winner !== null ? (
          <h3>
            Player {winner + 1} ({PLAYER_COLORS[winner]}) wins!
          </h3>
        ) : (
          <h3>
            Current player: Player {currentPlayer + 1} (
            {PLAYER_COLORS[currentPlayer]})
          </h3>
        )}
      </div>
      <div className="token-counts">
        {playerTokens.map((tokens, player) => (
          <div key={player} className="player-tokens">
            <p>
              Player {player + 1} tokens: {PLAYER_COLORS[player]}
            </p>
            {Object.entries(tokens).map(([size, count]) => (
              <div className="token-left">
                <span key={size}>Size {size}: </span>
                <span key={count}>{" __ "}{count} left</span>

                {Array(count)
                  .fill()
                  .map((_, i) => (
                    <p
                      key={i}
                      style={{
                        color: PLAYER_COLORS[player],
                      }}
                    >
                      O
                    </p>
                  ))}

              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
