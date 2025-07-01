const board = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const winLine = document.getElementById('win-line');
const popup = document.getElementById('winner-popup');
const winnerMessage = document.getElementById('winner-message');
const playAgainBtn = document.getElementById('play-again-btn');

let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill("");

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner() {
  for (let [a, b, c] of winningCombos) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameActive = false;
      drawWinLine(a, c);
      showWinnerPopup(`Player ${boardState[a]}`);
      return;
    }
  }

  if (!boardState.includes("")) {
    gameActive = false;
    showWinnerPopup("It's a draw");
  }
}

function drawWinLine(startIdx, endIdx) {
  const start = document.querySelector(`.cell[data-index="${startIdx}"]`);
  const end = document.querySelector(`.cell[data-index="${endIdx}"]`);
  const boardRect = board.getBoundingClientRect();
  const startRect = start.getBoundingClientRect();
  const endRect = end.getBoundingClientRect();

  const x1 = startRect.left + startRect.width / 2 - boardRect.left;
  const y1 = startRect.top + startRect.height / 2 - boardRect.top;
  const x2 = endRect.left + endRect.width / 2 - boardRect.left;
  const y2 = endRect.top + endRect.height / 2 - boardRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  winLine.style.width = `${length}px`;
  winLine.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;
  winLine.style.display = 'block';
}

function showWinnerPopup(winner) {
  winnerMessage.textContent = `🎉 ${winner} wins! 🎉`;
  popup.classList.remove('hidden');
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (boardState[index] || !gameActive) return;

  boardState[index] = currentPlayer;
  e.target.innerHTML = `<span>${currentPlayer}</span>`;
  checkWinner();

  if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function createBoard() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
  winLine.style.display = "none";
  winLine.style.width = "0";
  popup.classList.add('hidden');

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", createBoard);
playAgainBtn.addEventListener("click", createBoard);

createBoard();
