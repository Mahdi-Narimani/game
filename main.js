document.addEventListener("DOMContentLoaded", () => {
  const gameBoarde = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  const liveDisplay = document.getElementById("lives");
  const startGameBtn = document.getElementById("start-btn");
  const endGameBtn = document.getElementById("end-btn");
  const timerDisplay = document.getElementById("timer");

  let minutes = 0;
  let seconds = 0;
  let timerInterval;
  let speedGame = 10;
  const boarderHeight = gameBoarde.scrollHeight;
 

  const shapes = [];

  let score = 0;
  let lives = 3;
  liveDisplay.innerText = lives;

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

  // Start Game
  function startGame() {
    startTimer();
    startGameBtn.style.display = "none";
    const numShapes = 2;
    // Math.floor(Math.random() * 20) + 1; // تعداد تصادفی اشیاء
    createRandomShapes(numShapes); // ایجاد اشیاء تصادفی
  }

  // End Game
  function endGame(Interval) {
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

    // close modal
    const modal = document.getElementById("modal");
    document.getElementById("close").addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // create random shapes
  function createRandomShapes(numShapes) {
    for (let i = 0; i < numShapes; i++) {
      const randomX = Math.random() * 900; // مختصات افقی تصادفی
      const randomY = Math.random() * -100; // مختصات عمودی تصادفی
      createRandomShape(randomX, randomY); // ایجاد شکل با مختصات تصادفی
    }
  }

  function createRandomShape(x, y) {
    const shapes = ["circle", "square", "trapezius", "triangle"];
    const randomIndex = Math.floor(Math.random() * shapes.length); // نوع شکل تصادفی
    const randomShape = shapes[randomIndex];
    createShape(randomShape, x, y); // ایجاد شکل با نوع و مختصات تصادفی
  }

  // Create Shape with type shape
  function createShape(type, x, y) {
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
  }

  //  Move Shape on Screen
  function moveShape(shape) {
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
  }

  function decreaseLifeIfOutOfBounds(shape) {
    if (shapes.length === 0) clearInterval(timerInterval);

    const top = parseFloat(shape.style.top).toFixed(0);

    if (top >= boarderHeight) {
      removeShape(shape);
      if (lives > 0) {
        --lives;
        liveDisplay.innerText = lives;
      }
      if (lives === 0 && shapes.length === 0) {
        return;
      }
    }
  }

  // Remove Shape from screen and shapes array
  function removeShape(shape) {
    shape.remove();
    const index = shapes.indexOf(shape);
    if (index !== -1) {
      shapes.splice(index, 1);
    }
  }

  startGameBtn.addEventListener("click", startGame);
  endGameBtn.addEventListener("click", endGame);
});
