import { getRandomArbitrary } from "./utils";

const gameBoarde = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const liveDisplay = document.getElementById("lives");
const startGameBtn = document.getElementById("start-btn");
const endGameBtn = document.getElementById("end-btn");
const timerDisplay = document.getElementById("timer");

let minutes = 0;
let seconds = 0;
let timerInterval;
let shapeInterval;
let shapeIntervalTime = 1000;
let speedGame = 30;

const boarderHeight = gameBoarde.scrollHeight;

const shapes = [];

let score = 0;
let lives = 3;
liveDisplay.innerText = lives;

function startGame() {
  startTimer();
  startGameBtn.disabled = true;
  createShape();
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    speedGame--;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    timerDisplay.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function endGame() {
  gameBoarde.insertAdjacentHTML(
    "afterbegin",
    `<div id="modal">
          <div id="close">&times;</div>
          <!-- Modal content -->
          <div class="modal-content">
            <div id='timer'>${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}</div>
            <p class='score-modal'>score is: ${score}</p>
            <p class='lives-modal'> ${lives} <i class="fa-solid fa-heart heart-icon"></i> lives</p>
          </div>
      </div>`
  );
  // close modal
  const modal = document.getElementById("modal");
  document.getElementById("close").addEventListener("click", () => {
    modal.style.display = "none";
    startGameBtn.disabled = false;
    score = 0;
    lives = 3;
    liveDisplay.innerText = lives;
    scoreDisplay.innerText = score;
    shapeIntervalTime = 1000;
    speedGame = 30;
    minutes = 0;
    seconds = 0;
    timerDisplay.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  });
}

function createShape() {
  const shapesType = ["circle", "square", "trapezius", "triangle"];
  shapeInterval = setInterval(() => {
    const boardWidth = gameBoarde.clientWidth - 100;
    const x = getRandomArbitrary(100, boardWidth);
    const y = -20;
    const randomShape =
      shapesType[Math.floor(Math.random() * shapesType.length)];

    const shape = document.createElement("div");
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;
    shape.classList.add("shape", randomShape);
    gameBoarde.appendChild(shape);

    shapes.push(shape);
    moveShape(shape);

    shape.addEventListener("click", () => {
      removeShape(shape);
      score++;
      scoreDisplay.innerText = score;
    });
    // clearInterval(shapeInterval)
  }, shapeIntervalTime);
}

function moveShape(shape) {
  let top = +shape.style.top.split("px").at(0);
  const moveInterval = setInterval(() => {
    if (lives === 0) {
      clearInterval(shapeInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
      shapes.length = 0;
      gameBoarde.innerHTML = "";
      endGame();
    }
    ++top;
    shape.style.top = `${top}px`;
    decreaseLifeIfOutOfBounds(); // کم کردن یک جان اگر شکل خارج از صفحه است
  }, speedGame);
}

function decreaseLifeIfOutOfBounds() {
  shapes.map((shape) => {
    const top = +parseFloat(shape.style.top).toFixed(0);
    if (top >= boarderHeight) {
      removeShape(shape);
      if (lives > 0) {
        --lives;
        liveDisplay.innerText = lives;
      }
    }
  });
}

// Remove Shape from screen and shapes array
function removeShape(shape) {
  shape.remove();
  shape.style.display = "none";
  const index = shapes.indexOf(shape);
  if (index !== -1) {
    shapes.splice(index, 1);
  }
}

startGameBtn.addEventListener("click", startGame);
// endGameBtn.addEventListener("click", endGame);
