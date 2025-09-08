const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.6;
  resetGame();
}

// Ball object
let ball = {
  x: 0,
  y: 0,
  radius: 10,
  dx: 3,
  dy: -3,
  speed: 3
};

// Paddle object
let paddle = {
  height: 12,
  width: 100,
  x: 0
};

// Game state
let rightPressed = false;
let leftPressed = false;
let gameRunning = false;
let gamePaused = false;
let score = 0;

// Key handlers
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "cyan";
  ctx.fill();
  ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - paddle.height - 5, paddle.width, paddle.height);
  ctx.fillStyle = "lime";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "lime";
  ctx.fill();
  ctx.closePath();
}

// Collision Detection
function collisionDetection() {
  // Paddle collision
  if (
    ball.y + ball.radius >= canvas.height - paddle.height - 5 &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    let hitPoint = ball.x - (paddle.x + paddle.width / 2);
    hitPoint = hitPoint / (paddle.width / 2);

    let angle = hitPoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);

    ball.speed += 0.2;
    score++;
    document.getElementById("score").textContent = score;
  }

  // Walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
  if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

  // Game Over
  if (ball.y + ball.radius > canvas.height) {
    alert("Game Over! Final Score: " + score);
    resetGame();
  }
}

// Main Game Loop
function draw() {
  if (!gameRunning || gamePaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  collisionDetection();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 6;
  if (leftPressed && paddle.x > 0) paddle.x -= 6;

  requestAnimationFrame(draw);
}

// Reset Game
function resetGame() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 3;
  ball.dy = -3;
  ball.speed = 3;
  paddle.x = (canvas.width - paddle.width) / 2;
  score = 0;
  document.getElementById("score").textContent = score;
  gameRunning = false;
}

// Buttons
document.getElementById("startBtn").addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    gamePaused = false;
    draw();
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  gamePaused = !gamePaused;
  if (!gamePaused) draw();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
  gameRunning = true;
  gamePaused = false;
  draw();
});
