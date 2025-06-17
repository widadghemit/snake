const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, gameOver;
let speed = 300; // vitesse initiale en ms (lente)
let gameInterval;
let lastLength = 1;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: 5, y: 5 };
  gameOver = false;
  speed = 300;
  lastLength = 1;
  restartBtn.style.display = "none";

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
  draw();

  if (!gameOver) {
    if (snake.length > lastLength) {
      lastLength = snake.length;

      // Accélération tous les 3 blocs mangés
      if ((snake.length - 1) % 3 === 0 && speed > 100) {
        speed -= 2; // accélération plus douce
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
      }
    }
  }
}

function draw() {
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 90, 200);
    restartBtn.style.display = "block";
    return;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = "lime";
  for (let part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.slice(1).some(part => part.x === head.x && part.y === head.y)
  ) {
    gameOver = true;
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

restartBtn.addEventListener("click", () => {
  initGame();
});

initGame();
