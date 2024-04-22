import { getRandomValue } from "./utils";

// گرفتن المان صفحه بازی و محدوده ان
const gameBoarde = document.getElementById("game-board");

// گرفتن المان مربوط با امتیازات بازی
const scoreDisplay = document.getElementById("score");

// گرفتن المان مربوط به جان ها بازی
const liveDisplay = document.getElementById("lives");

// گرفتن المان مربوط به کلید شروع بازی
const startGameBtn = document.getElementById("start-btn");

// گرفتن المان مربوط به کلید پایان بازی
const endGameBtn = document.getElementById("end-btn");

// گرفتن المان مربوط به تایمر بازی
const timerDisplay = document.getElementById("timer");

 
let minutes = 0;
let seconds = 0;
let timerInterval;
let shapeInterval;
let shapeIntervalTimeOut = 1000;
let speedGame = 10;

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
  gameBoarde.innerHTML = "";
  clearInterval(shapeInterval);
  clearInterval(timerInterval);
  shapes.length = 0;
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
      </div>
      <span class="endLine"></span>`
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
    shapeIntervalTimeOut = 1000;
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
    // گرفتن سایز برد مختص به بازی
    const boardWidth = gameBoarde.clientWidth - 100;

    // ایجاد مختصات رندوم
    const x = getRandomValue(100, boardWidth);
    const y = -100;

    // انتخاب رندوم شیپ
    const randomShape =
      shapesType[Math.floor(Math.random() * shapesType.length)];

    // ایجاد سایز رندوم برا هر شیپ
    const randomSize = getRandomValue(40, 100);

    // ایجاد شیپ و دادن مختصت رندوم به ان
    const shape = document.createElement("div");
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;
    shape.style.width = `${randomSize}px`;
    shape.style.height = `${randomSize}px`;
    shape.classList.add("shape", randomShape);

    shapes.push(shape);

    // چک کردن فاصله اشیا از هم
    const curShapeLeftPx = shape.style.left;
    shapes.map((item) => {
      const shapeLeftPx = item.style.left;
      const shapeWidht = item.style.width;
      console.log(shapeWidht);
      if (
        curShapeLeftPx >= shapeLeftPx &&
        curShapeLeftPx <= shapeLeftPx + shapeWidht
      ) {
        console.log(curShapeLeftPx);
        gameBoarde.appendChild(shape);
        moveShape(shape);
      }
    });

    // به محض کلیک شدن رو شیپ مورد نظر حذف میشود
    shape.addEventListener("click", () => {
      removeShape(shape);
      score++;
      scoreDisplay.innerText = score;
    });
  }, shapeIntervalTimeOut);
}

function moveShape(shape) {
  //  گرفتن فاصله مختصات شیپ از بالا با فرمت عددی
  let top = +shape.style.top.split("px").at(0);

  // حرکت دادن شیپ
  const moveInterval = setInterval(() => {
    // در صورت تمام شدن تمام جان ها بازی به اتمام میرسد
    if (lives === 0) {
      clearInterval(moveInterval);
      endGame();
    }

    // گرفته شدن از شیپ یکی اضافه میشود top  در غیر اینصورت
    ++top;

    // اضافه شده به شیپ اختصاص داده میشود top
    shape.style.top = `${top}px`;

    // کم کردن یک جان اگر شکل خارج از صفحه است
    decreaseLifeIfOutOfBounds();
  }, speedGame);
}

function decreaseLifeIfOutOfBounds() {
  // حلقه روی شیپ های ساخته شده برا کنترل خروج ان از بازی
  shapes.map((shape) => {
    //  گرفتن فاصله مختصات شیپ از بالا با فرمت عددی
    const top = +parseFloat(shape.style.top).toFixed(0);

    // هر شیپ بصورت خودکار حذف شده top در صورت بیشتر شدن
    if (top >= boarderHeight) {
      removeShape(shape);

      // با حذف هر شیپ بعد از خارج شدن از کادر یک جان کم میشود
      if (lives > 0) {
        --lives;
        liveDisplay.innerText = lives;
      }
    }
  });
}

// Remove Shape from screen and shapes array
function removeShape(shape) {
  // صفحه DOM حذف شیپ مورد نظر از
  shape.remove();

  // گرفتن شماره ایندکس شیپ و حذف ان از ارایه شیپ ها
  const index = shapes.indexOf(shape);
  if (index !== -1) {
    shapes.splice(index, 1);
  }
}

startGameBtn.addEventListener("click", startGame);
endGameBtn.addEventListener("click", endGame);
