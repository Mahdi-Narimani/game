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
                <p class="heart-size" id="lives">3</p>
                <i class="fa-solid fa-heart heart-icon"></i>
            </div>
          </div>
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
  const modal = document.getElementsByClassName("modal");
  const closeModal = document.getElementsByClassName("close")[0];
  
  if (closeModal) {
    closeModal.onclick = () => {
      modal.style.display = "none";
      console.log("closed");
    };
  }

  let score = 0;
  let lives = 3;
  const shapes = [];
  window.shapes = shapes;

  // Start Game
  const startGame = () => {
    startGameBtn.style.display = "none";
    for (let i = 0; i < 5; i++) {
      createShape("circle");
      createShape("square");
      createShape("trapezius");
      createShape("triangle");
    }
  };

  // End Game
  const endGame = () => {
    gameBoarde.insertAdjacentHTML(
      "afterbegin",
      `<div id="myModal" class="modal">
          <span class="close">&times;</span>
          <!-- Modal content -->
          <div class="modal-content">
            <p class='score-modal'>score is: ${score}</p>
            <p class='lives-modal'> ${lives} <i class="fa-solid fa-heart heart-icon"></i> lives</p>
          </div>
       </div>`
    );
    
    score = 0;
    lives = 3;
  };

  // Create Shape with type shape
  const createShape = (type) => {
    let shape = document.createElement("div");
    shape.classList.add("shape", type);
    shape.style.left = `${Math.random() * 900}px`;
    shape.style.top = "-50px";

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
    if (lives === 0) {
      endGame();
    }
    let top = +shape.style.top.split("px").at(0);

    const interval = setInterval(() => {
      const boarderHeight = gameBoarde.scrollHeight;
      top++;

      if (top === boarderHeight - 100) {
        if (lives > 0) {
          removeShape(shape);
          --lives;
          liveDisplay.innerText = lives;
        } else if (lives === 0) {
          endGame();
          clearInterval(interval);
        }
      }
      shape.style.top = `${top}px`;
    }, 20);
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
