const board = document.querySelector(".board");
const blockheight = 30;
const blockwidth = 30;
const blocks = [];
let snake = [{
    x:0 , y:0
},];
let interval ;
let ispaused = false;
let food;
let direction = "ArrowRight"
const startbtn = document.querySelector(".startbtn")
const restartbtn = document.querySelector(".restartbtn")
const modal = document.querySelector(".modal")
const startgame = document.querySelector(".start")
const gameover = document.querySelector(".gameover")   
const highscoreelem = document.querySelector("#highscore")
const scoreelem = document.querySelector("#score")
const timeelem = document.querySelector("#time")
let score = 0;
let time = `00:00`; 
let timerintervalid = null;
let highscore = localStorage.getItem("highscore") || 0;
highscoreelem.textContent = highscore;

const rows = Math.floor(board.clientHeight/blockheight);    // number of rows
const cols = Math.floor(board.clientWidth/blockwidth);     // number of columns


for(let row = 0 ; row < rows ; row++)     // full board size
{
    for(let col = 0 ; col < cols ; col++)
    {
        let block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row},${col}`] = block;
    }
}

function generateFood() {
    let newFood;
    let isOnSnake;

    do {
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

        // check food snake ke upar to nahi
        isOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );

    } while (isOnSnake);

    food = newFood;
}
function render() {

    /* =========================
       1️⃣ FOOD DRAW
    ========================== */
    blocks[`${food.x},${food.y}`].classList.add("food");

    /* =========================
       2️⃣ NEW HEAD CALCULATION
    ========================== */
    let head;

    if (direction === "ArrowLeft") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } 
    else if (direction === "ArrowRight") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } 
    else if (direction === "ArrowUp") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } 
    else if (direction === "ArrowDown") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    /* =========================
       3️⃣ WALL COLLISION
    ========================== */
    if (
        head.x < 0 || head.x >= rows ||
        head.y < 0 || head.y >= cols
    ) {
        updateHighScore();
        clearInterval(interval);
        clearInterval(timerintervalid);
        modal.style.display = "flex";
        startgame.style.display = "none";
        gameover.style.display = "flex";
        return;
    }

    /* =========================
       4️⃣ SELF COLLISION
    ========================== */
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            updateHighScore();
            clearInterval(interval);
            clearInterval(timerintervalid);
            modal.style.display = "flex";
            startgame.style.display = "none";
            gameover.style.display = "flex";
            return;
        }
    }

    /* =========================
       5️⃣ MOVE SNAKE
    ========================== */
    // new head add
    snake.unshift(head);

    // food check
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x},${food.y}`].classList.remove("food");
        generateFood();
        scoreelem.textContent = ++score;
    } else {
        // food nahi mila → tail hatao
        snake.pop();
    }

    /* =========================
       6️⃣ CLEAR OLD SNAKE (IMPORTANT)
    ========================== */
    for (let key in blocks) {
        blocks[key].classList.remove("fill");
    }

    /* =========================
       7️⃣ DRAW UPDATED SNAKE
    ========================== */
    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.add("fill");
    });
}

function updateHighScore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreelem.textContent = highscore;
    }
}

startbtn.addEventListener("click" , ()=>{
    modal.style.display = "none";
    timemanage();
    generateFood();
    interval = setInterval(() => {
        render();
    }, 150);
})

restartbtn.addEventListener("click" , restart)

function restart(){
    time = "00:00";
    timemanage();
    blocks[`${food.x},${food.y}`].classList.remove("food")
    score = 0;
    timeelem.textContent = `00:00`;
    scoreelem.innerHTML = 0;
    snake.forEach(function (segment){
        blocks[`${segment.x},${segment.y}`].classList.remove("fill")
    })

    modal.style.display = "none";  
    direction = "ArrowRight";
    snake = [{x:0 , y:0},];
    food = {x:Math.floor(Math.random()*rows) , y:Math.floor(Math.random()*cols)}

    interval = setInterval(() => {
        render();
    }, 150);

    render();
}

addEventListener("keydown", (e) => {

    if (
        (e.key === "ArrowLeft"  && direction !== "ArrowRight") ||
        (e.key === "ArrowRight" && direction !== "ArrowLeft")  ||
        (e.key === "ArrowUp"    && direction !== "ArrowDown")  ||
        (e.key === "ArrowDown"  && direction !== "ArrowUp")
    ) {
        direction = e.key;
    }
        if (e.key === " ") {
        if (!ispaused) {
            // PAUSE
            clearInterval(interval);
            ispaused = true;
            console.log("Game Paused");
        } else {
            // RESUME
            interval = setInterval(render, 150);
            ispaused = false;
            console.log("Game Resumed");
        }
        return; 
    }      
});

function timemanage() {

    // pehle purana timer band karo
    if (timerintervalid) {
        clearInterval(timerintervalid);
    }

    timerintervalid = setInterval(function () {
        let [min, sec] = time.split(":").map(Number);

        if (sec === 59) {
            min++;
            sec = 0;
        } else {
            sec++;
        }

        time = `${min}:${sec < 10 ? "0" + sec : sec}`;
        timeelem.textContent = time;

    }, 1000);
}





