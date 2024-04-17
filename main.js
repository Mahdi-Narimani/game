import "./style.css";

document.querySelector("#app").innerHTML = `
    <div class="container">
        <div id="game-board"></div>
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

document.addEventListener("DOMContentLoaded", () =>
{
  const gameBoarde = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  const liveDisplay = document.getElementById("lives");
  const startGameBtn = document.getElementById("start-btn");
  const endGameBtn = document.getElementById("end-btn");
  const timerDisplay = document.getElementById("timer");
  const closeModalBtn = document.getElementById("close");
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector(".modal-content");


  let minutes = 0;
  let seconds = 0;
  let timerInterval;

  const shapes = [];

  let score = 0;
  let lives = 3;
  liveDisplay.innerText = lives;

  const startTimer = () =>
  {
    timerInterval = setInterval(() =>
    {
      seconds++;
      if (seconds === 60)
      {
        seconds = 0;
        minutes++;
      }
      timerDisplay.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  };

  // Start Game
  const startGame = () =>
  {
    startTimer();
    startGameBtn.style.display = "none";
    const numShapes = Math.floor(Math.random() * 3) + 1; // تعداد تصادفی اشیاء
    createRandomShapes(numShapes); // ایجاد اشیاء تصادفی
  };

  // End Game
  const endGame = () =>
  {
    clearInterval(timerInterval)
    gameBoarde.insertAdjacentHTML(
      "afterbegin",
      `<div id="modal">
          <div id="close">&times;</div>
          <!-- Modal content -->
          <div class="modal-content">
            <p class='score-modal'>score is: ${score}</p>
            <p class='lives-modal'> ${lives} <i class="fa-solid fa-heart heart-icon"></i> lives</p>
          </div>
      </div>`
    );
  };
  if (closeModalBtn)
  {
    closeModalBtn.addEventListener("click", () =>
    {
      console.log('closed');
      modal.style.display = "none";
    });
  }
  if (modal)
  {
    modal.addEventListener("click", (event) =>
    {
      if (!modalContent.contains(event.target))
      {
        modal.style.display = "none";
      }
    });
  }

  // create random shapes
  const createRandomShapes = (numShapes) =>
  {
    for (let i = 0; i < numShapes; i++)
    {
      const randomX = Math.random() * 900; // مختصات افقی تصادفی
      const randomY = Math.random() * -100; // مختصات عمودی تصادفی
      createRandomShape(randomX, randomY); // ایجاد شکل با مختصات تصادفی
    }
  };

  const createRandomShape = (x, y) =>
  {
    const shapes = ["circle", "square", "trapezius", "triangle"];
    const randomIndex = Math.floor(Math.random() * shapes.length); // نوع شکل تصادفی
    const randomShape = shapes[randomIndex];
    createShape(randomShape, x, y); // ایجاد شکل با نوع و مختصات تصادفی
  };

  // Create Shape with type shape
  const createShape = (type, x, y) =>
  {
    let shape = document.createElement("div");
    shape.classList.add("shape", type);
    shape.style.left = `${Math.random() * x}px`;
    shape.style.top = `${Math.random() * y}px`;

    gameBoarde.appendChild(shape);
    shapes.push(shape);
    moveShape(shape);

    shape.addEventListener("click", () =>
    {
      removeShape(shape);
      score++;
      scoreDisplay.innerText = score;
    });
  };

  //  Move Shape on Screen
  const moveShape = (shape) =>
  {
    let top = +shape.style.top.split("px").at(0);

    const interval = setInterval(() =>
    {
      top++;
      shape.style.top = `${top}px`;
      decreaseLifeIfOutOfBounds(shape, interval); // کم کردن یک جان اگر شکل خارج از صفحه است
    }, 10);
  };

  const decreaseLifeIfOutOfBounds = (shape, interval) =>
  {
    const top = parseFloat(shape.style.top).toFixed(0);
    const boarderHeight = gameBoarde.scrollHeight;

    console.log(top >= (boarderHeight - 100))
    if (top >= boarderHeight - 100 && lives > 0)
    {
      removeShape(shape);
      lives -= 1;
      liveDisplay.innerText = lives;
    }
    else if (lives === 0)
    {
      endGame();
      clearInterval(interval);
    }
  };

  // Remove Shape from screen and shapes array
  const removeShape = (shape) =>
  {
    shape.remove();
    const index = shapes.indexOf(shape);
    if (index !== -1)
    {
      shapes.splice(index, 1);
    }
  };

  startGameBtn.addEventListener("click", startGame);
  endGameBtn.addEventListener("click", endGame);
});
