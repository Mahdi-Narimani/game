



import "./style.css";

document.querySelector("#app").innerHTML = `
    <div class="container">
        <div id="game-board">
        <span class="endLine"></span>
        </div>
        <div id="sidebar">
        <div>
        <div class='score-box'>
        <p class='score-paragraph'>Score: <span id="score">0</span></p>
        </div>
        <div class='heart-box'>
        <p class="heart-size" id="lives"></p>
        <i class="fa-solid fa-heart heart-icon"></i>
        </div>
        </div>

        <div id="timer">00:00</div>

          <div class="btn-box">
            <button id="start-btn">Start Game</button>
            <button id="end-btn">End Game</button>
          </div>
        </div>
    </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  const gameBoarde = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  const liveDisplay = document.getElementById("lives");
  const startGameBtn = document.getElementById("start-btn");
  const endGameBtn = document.getElementById("end-btn");
  const timerDisplay = document.getElementById("timer");

  const modalContent = document.querySelector(".modal-content");

  let minutes = 0;
  let seconds = 0;
  let timerInterval;
  let speedGame = 10;
  let closeModalBtn;
  let modal;

  const shapes = [];

  let score = 0;
  let lives = 3;
  liveDisplay.innerText = lives;

  const startTimer = () => {
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
  };

  // Start Game
  const startGame = () => {
    startTimer();
    startGameBtn.style.display = "none";
    const numShapes = 2;
    // Math.floor(Math.random() * 20) + 1; // تعداد تصادفی اشیاء
    createRandomShapes(numShapes); // ایجاد اشیاء تصادفی
  };

  // End Game
  const endGame = (Interval) => {
    clearInterval(Interval);
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

    modal = document.getElementById("modal");
    closeModalBtn = document
      .getElementById("close")
      .addEventListener("click", () => {
        console.log("closed");
        modal.style.display = "none";
      });
  };

  // create random shapes
  const createRandomShapes = (numShapes) => {
    for (let i = 0; i < numShapes; i++) {
      const randomX = Math.random() * 900; // مختصات افقی تصادفی
      const randomY = Math.random() * -100; // مختصات عمودی تصادفی
      createRandomShape(randomX, randomY); // ایجاد شکل با مختصات تصادفی
    }
  };

  const createRandomShape = (x, y) => {
    const shapes = ["circle", "square", "trapezius", "triangle"];
    const randomIndex = Math.floor(Math.random() * shapes.length); // نوع شکل تصادفی
    const randomShape = shapes[randomIndex];
    createShape(randomShape, x, y); // ایجاد شکل با نوع و مختصات تصادفی
  };

  // Create Shape with type shape
  const createShape = (type, x, y) => {
    let shape = document.createElement("div");
    shape.classList.add("shape", type);
    shape.style.left = `${(Math.random() * x).toFixed(0)}px`;
    shape.style.top = `${(Math.random() * y).toFixed(0)}px`;

    gameBoarde.appendChild(shape);
    shapes.push(shape);
    moveShape(shape);

    shape.addEventListener("click", () => {
      removeShape(shape);
      score++;
      scoreDisplay.innerText = score;
    });
  };

  //  Move Shape on Screen
  const moveShape = (shape) => {
    let top = +shape.style.top.split("px").at(0);

    const moveInterval = setInterval(() => {
      if (lives === 0) {
        removeShape(shape);
        endGame(moveInterval);
      }
      top++;
      shape.style.top = `${top}px`;
      decreaseLifeIfOutOfBounds(shape); // کم کردن یک جان اگر شکل خارج از صفحه است
    }, speedGame);
  };

  const decreaseLifeIfOutOfBounds = (shape) => {
    if (shapes.length === 0) clearInterval(timerInterval);

    const top = parseFloat(shape.style.top).toFixed(0);
    const boarderHeight = gameBoarde.scrollHeight - 10;

    if (top >= 490) {
      removeShape(shape);
      if (lives > 0) {
        --lives;
        liveDisplay.innerText = lives;
      }
      if (lives === 0 && shapes.length === 0) {
        return;
      }
    }
  };

  // Remove Shape from screen and shapes array
  const removeShape = (shape) => {
    shape.remove();
    const index = shapes.indexOf(shape);
    if (index !== -1) {
      shapes.splice(index, 1);
    }
  };

  startGameBtn.addEventListener("click", startGame);
  endGameBtn.addEventListener("click", endGame);
});
