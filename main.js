const CANVAS = document.getElementById('tetris');
const CTX = CANVAS.getContext('2d');

//level button
const LEVELUP_BTN = document.getElementById("increment");
const LEVELDOWN_BTN = document.getElementById("decrement");
//buttons
const LEFT_BTN = document.querySelector("#leftarrow");
const RIGHT_BTN = document.querySelector("#rightarrow");
const DOWN_BTN = document.querySelector("#downarrow");
//help button

const LEFTMOVEKEY_CODE = 37;
const RIGHTMOVEKEY_CODE = 39;
const DOWNMOVEKEY_CODE = 40;
const LEVELUP_MOVEKEY = 187;
const LEVELDOWN_MOVEKEY = 189;
const HELPKEY_CODE = 191;
const INCREASE = 10;
const HELP_BTN = document.querySelector("#help");
//Variable for game
const ROW = 12;    // let ROW= 12
const COL = 3; //let COLumn=3
const BALL_SIZE = 46;  //ball Size
const SPACE = "WHITE"; //Vacant SPACE which shows grid SPACE
const RADIUS = 23;  //Ball RADIUS
const COLORS = ["Purple", "green", "yellow", "Blue","red"]//Random Ball COLORS 
let game_level = 1;   //set game_level=1
let game_score = 0;   //set game_score=0
let down_start = Date.now();// Getting date Variable     

//Draw Ball Code using X,Y cordinate and COLORS

function drawBall(x, y, COLORS) {
  CTX.fillStyle = COLORS;
  CTX.beginPath();
  CTX.arc((x + 0.5) * BALL_SIZE, (y + 0.5) * BALL_SIZE, RADIUS, 0, Math.PI * 2);
  CTX.fill();
  CTX.strokeStyle = "White";
  CTX.stroke();
}
// init();


//Score Updater function
function scoreUpdater() {
  let score = document.querySelector("#score");
  let scorevalue = Number(score.value);
  console.log(scorevalue)
  score.value = scorevalue + INCREASE;
  game_score = scorevalue + INCREASE;
}

//grid Pattern Making
let grid = [];
for (r = 0; r < ROW; r++) {
  grid[r] = [];
  for (c = 0; c < COL; c++) {
    grid[r][c] = SPACE;
  }
}

function gridPattern() { //Function for grid
  for (r = 0; r < ROW; r++) {
    for (c = 0; c < COL; c++) {
      drawBall(c, r, grid[r][c]);
    }
  }
}
//Random ball COLORS Function
function randomCOLORS() {
  let r = Math.floor(Math.random() * COLORS.length)
  return COLORS[r]
}

//level down function
function levelDown() {
  let level = document.querySelector("#level");
  console.log(level);
  let level_value = Number(level.value)
  if (level_value === 1) {
    alert("Level should be at least 1");
  } else {
    level.value = level_value - 1;
    game_level = level_value - 1;
  }
  down();
}


// Level up Function
function levelUp() {
  let level = document.querySelector("#level");
  let level_value = Number(level.value);
  if (level_value === 4) {
    alert("Level 4 is max");
  } else {
    level.value = level_value + 1;
    game_level = level_value + 1;
  }
  down();
}
// Define Ball object 
let ball = new generateBall();
// Ball Function Definiation
function Ball() {
  this.x = 1;
  this.y = -1;
  this.COLORS = randomCOLORS();
}
//Ball function Draw
Ball.prototype.draw = function () {
  drawBall(this.x, this.y, this.COLORS);
}
ball.draw();

// Button Moves  function
Ball.prototype.moveDown = function () {
  if (!this.COLliod(0, 1)) {
    drawBall(this.x, this.y, SPACE);
    this.y++
    drawBall(this.x, this.y, this.COLORS);
  }
  else {
    ball.jam();
    ball = generateBall();
  }
}
Ball.prototype.moveRight = function () {
  if (!this.COLliod(1, 0)) {
    drawBall(this.x, this.y, SPACE);
    this.x++
    drawBall(this.x, this.y, this.COLORS)
  }
}
Ball.prototype.moveLeft = function () {
  if (!this.COLliod(-1, 0)) {
    drawBall(this.x, this.y, SPACE);
    this.x--
    drawBall(this.x, this.y, this.COLORS)
  }
}
// COLliod function for New Ball
Ball.prototype.COLliod = function (x, y) {
  let xcore = this.x + x;
  let ycore = this.y + y;


  //Condition for Left Right and Last Location
  if (xcore < 0 || xcore >= COL || ycore >= ROW || (ycore < 0)||(grid[ycore][xcore] != SPACE)) {
    return true;
  }

  return false;
}
// ball COLlapse and lock function
//Jam function for Match Making vertical and Horizonatal and game over alert
Ball.prototype.jam = function () {
  if (this.y < 0) {
    gameover = true
    alert(`Game Over Your Score is  ${game_score}`);
    location.reload();
  }
  else {
    // Define the grid to the Implement COLORS on the X and Y
    // If any COLORS found than stop on another
    grid[this.y][this.x] = this.COLORS
    // If grid is vacant then score not Update
    if (grid[this.y][this.x] != SPACE) {
      if (this.y < 10) {
        if (grid[this.y][this.x] == grid[this.y + 1][this.x] && grid[this.y + 1][this.x] == grid[this.y + 2][this.x]) {
          grid[this.y][this.x] = grid[this.y + 1][this.x] = grid[this.y + 2][this.x] = SPACE;
          drawBall(this.x, this.y, SPACE);
          drawBall(this.x, this.y + 1, SPACE);
          drawBall(this.x, this.y + 2, SPACE);

          scoreUpdater();
        }
      }
    }
    //If grid is not vacant is true then score will update 
    if (grid[this.y][this.x] != SPACE) {
      if (grid[this.y][0] == grid[this.y][1] && grid[this.y][1] == grid[this.y][2]) {
        grid[this.y][0] = grid[this.y][1] = grid[this.y][2] = SPACE;

        // this loop for update the grid and shift the ball to the down  
        for (i = this.y; i > 0; i--) {
          for (r = 0; r < COL; r++) {
            grid[i][r] = grid[i - 1][r];
            drawBall(r, i, grid[i][r]);
          }
        } scoreUpdater();
      }
    }
    // end of function
  } //end of else 
} //end of jam function

let gameover = false;
// Drop and Sliding function
function down() {
  let now = Date.now();
  let delay = now - down_start;

  if (delay > 1000 + 50 - game_level * 280) {
    ball.moveDown();
    down_start = Date.now();
  }
  if (gameover == false) {
    requestAnimationFrame(down);
  }
}
// Generate new ball Randomly
function generateBall() {
  let random = Math.floor(Math.random() * COLORS.length)
  return new Ball(Math.floor(Math.random() * 5), 0, COLORS[random])
}
down();

//  key button controller
document.addEventListener("keydown", controller);
document.addEventListener("click", init);
function controller() {
  if (event.keyCode == LEFTMOVEKEY_CODE) {
    ball.moveLeft();
    down_start = Date.now();
    LEFT_BTN.focus();
  } else if (event.keyCode == RIGHTMOVEKEY_CODE) {
    ball.moveRight();
    down_start = Date.now();
    RIGHT_BTN.focus();
  } else if (event.keyCode == DOWNMOVEKEY_CODE) {
    ball.moveDown();
    down_start = Date.now();
    DOWN_BTN.focus();
  }
  else if (event.keyCode == LEVELUP_MOVEKEY) {
    levelUp();
    LEVELUP_BTN.focus();
  } else if (event.keyCode == LEVELDOWN_MOVEKEY) {
    levelDown();
    LEVELDOWN_BTN.focus();
  }
  else if (event.keyCode == HELPKEY_CODE) {
    help()
    HELP_BTN.focus();
  }
}
function help() { //help function
  alert(`Help\n
  - : to level Down\n
  + : to level Up\n
  > : to move right\n
  V : to move Down\n
  < : to move left\n`);
}

//level controller init
function init() {
  LEVELDOWN_BTN.addEventListener("click", levelDown);
  LEVELUP_BTN.addEventListener("click", levelUp);
  HELP_BTN.addEventListener("click", help);

  //Control button Function
  LEFT_BTN.addEventListener("click", function () {
    ball.moveLeft()
    down_start = Date.now();
    LEFT_BTN.focus();
  })
  RIGHT_BTN.addEventListener("click", function () {
    ball.moveRight();
    down_start = Date.now();
    RIGHT_BTN.focus();
  });
  DOWN_BTN.addEventListener("click", function () {
    ball.moveDown();
    down_start = Date.now();
    DOWN_BTN.focus();
  });
}

