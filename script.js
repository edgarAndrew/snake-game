// Snake Game js script
// Developed by Edgar Camelo, 2nd Year B.E Information Technology
// Date: 28-03-2022

// VARIABLES

// 1.) DOM element variables
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('score');
const playButton = document.querySelector('.play-btn');
const menu = document.getElementById('menu');
const slider = document.getElementById("myRange");
const sliderValue = document.getElementById("value");
let food = null;

// 2.) Boolean variables
let isMovingUp = false;
let isMovingDown = false;
let isMovingLeft = false;
let isMovingRight = false;
let isSnakeHead = true;

// 3.) Snake segments array
let segmentArray = [];

// 4.) Speed and grid varaibles
let snakeSpeed = 3; 
let gridHeight = 21;
let gridWidth = 21;

// 5.) Food Position variables
let foodX = 0;
let foodY = 0;

// 6.) Game score varibles
let score = 0;
let bestScore = 0;

// 7.) Variables to handle swipe events 
var startingX , startingY , movingX , movingY ;

// 8.) Set Interval variables
let deathChecker = 0;
let snakeMotion = 0;
let eatenChecker = 0;

// AUDIO FILES
const foodSound = new Audio('resources/apple-crunch.mp3');
const moveSound = new Audio('resources/move-sound.mp3');
const collisionSound = new Audio('resources/collision-sound.mp3');

// TEMPLATE CLASS

// Class to add segment to snake body 
class snake{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.segment = document.createElement('div');

        const appendage = this.segment;
        appendage.classList.add('snake');
        appendage.style.gridRowStart = this.y;
        appendage.style.gridColumnStart = this.x;

        if(isSnakeHead)
            appendage.style.backgroundColor = 'darkBlue';

        gameBoard.appendChild(appendage);
        isSnakeHead = false;
        segmentArray.push(this);
    }
}

// FUNCTIONS

// 1.) Function to generate food at random location
function foodGenerator(){
    if(food === null){
        food = document.createElement('div');
        food.classList.add('food');
        food.innerHTML = `<img src="resources/apple-img.png" alt="apple-img" class="apple-img">`;
        gameBoard.appendChild(food);
    }
    let randx = Math.floor(Math.random() * (gridWidth - 1)) + 1;
    let randy = Math.floor(Math.random() * (gridHeight - 1)) + 1;
    while(onSnake(randx,randy)){
        randx = Math.floor(Math.random() * (gridWidth - 1)) + 1;
        randy = Math.floor(Math.random() * (gridHeight - 1))+ 1;
    }
    foodX = randx;
    foodY = randy;
    food.style.gridRowStart = foodY;
    food.style.gridColumnStart = foodX;
}

// 2.) Function to check if food is eaten
function foodEaten(){
    for(let item of segmentArray){
        if(item.x === foodX && item.y === foodY){
            addAppendage();
            foodGenerator();
            score++;
            updateScore();
            foodSound.play();
            break;
        }
    }
}
// 3.) Function to add appendage to snake body
function addAppendage(){
    let lastSegment = segmentArray[segmentArray.length - 1];
    let segment = null;
    if(isMovingRight){
        segment = new snake(lastSegment.x - 1,lastSegment.y);
    }
    if(isMovingLeft){
        segment = new snake(lastSegment.x + 1,lastSegment.y);
    }
    if(isMovingUp){
        segment = new snake(lastSegment.x,lastSegment.y + 1);
    }
    if(isMovingDown){
        segment = new snake(lastSegment.x,lastSegment.y - 1);
    }
}

// 4.) Function to check if snake bit itself
const biteSelf = (ele) =>{
    if(ele !== segmentArray[0]){
        if(ele.x === segmentArray[0].x && ele.y === segmentArray[0].y)
            return true;
    }
    return false;
}

// 5.) Function to check if snake hit border
const hitBorder = (ele) =>{
    return (ele.x < 1 || ele.x > gridWidth ||
        ele.y < 1 || ele.y > gridHeight);
}

// 6.) Function to check if snake died
function checkDeath(){
    if(segmentArray.some(biteSelf) || hitBorder(segmentArray[0])){
        collisionSound.play();
        clearInterval(snakeMotion);
        clearInterval(deathChecker);
        clearInterval(eatenChecker);

        for(let item of segmentArray){
            item.segment.remove();
        }
        segmentArray.splice(0,segmentArray.length);
        updateScore();
        menu.style.zIndex = "1";
        gameBoard.style.zIndex = "-1";
    }
}
// 7.) Function to check if grid(location) on snake body
const onSnake = (x,y) =>{
    for(const item of segmentArray){
        if(item.x === x && item.y === y)
            return true;
    }
    return false;
}

// 8.) Functions to move snake segments
function moveSnake(){
    if(isMovingRight){
        moveSnakeHead(1,0);
    }
    else if(isMovingLeft){
        moveSnakeHead(-1,0);
    }
    else if(isMovingUp){
        moveSnakeHead(0,-1);
    }
    else if(isMovingDown){
        moveSnakeHead(0,1);
    }
}

function moveSnakeHead(x,y){
    if(x === 0 && y === 0)return;
    else{
        for(let i = segmentArray.length; i>=2;i--){
            let segment = segmentArray[i-1].segment;
            segmentArray[i-1].x = segmentArray[i-2].x;
            segmentArray[i-1].y = segmentArray[i-2].y;
    
            segment.style.gridRowStart = segmentArray[i-1].y;
            segment.style.gridColumnStart = segmentArray[i-1].x;
        }
        segment = segmentArray[0].segment;
        
        segmentArray[0].x += x;
        segmentArray[0].y += y;
        segment.style.gridRowStart = segmentArray[0].y;
        segment.style.gridColumnStart = segmentArray[0].x;
    }
}

// 9.) Function to update game score
function updateScore(){
    if(score > bestScore){
        bestScore = score;
        menu.childNodes[5].innerHTML = `<h4>Best</h4>${bestScore}`;
    }
    scoreBoard.innerHTML = `<span>Score: ${score}</span>`;
    menu.childNodes[3].innerHTML = `<h4>Score</h4>${score}`;
}

// 10.) Function to set snakeSpeed
slider.oninput = function() {
    sliderValue.innerHTML = `<span>Speed : ${this.value}</span>`
    snakeSpeed = this.value;
} 

// EVENT LISTENERS

// 1.) Event Listener on play button on the menu
playButton.addEventListener('click',(e)=>{
    e.stopPropagation();
    score = 0;
    updateScore();

    menu.style.zIndex = "-1";
    gameBoard.style.zIndex = "1";
    
    isSnakeHead = true;          // first segment is head
    let obj = new snake(10,10);  // starting position of snake
    foodGenerator();

    deathChecker = setInterval(checkDeath,100);
    snakeMotion = setInterval(moveSnake,(1/snakeSpeed) * 1000);
    eatenChecker = setInterval(foodEaten,100);
})

// 2.) Event Listener to handle ArrowKey movements
document.addEventListener('keydown',function(e){
    moveSound.play();
    let x = 0;
    let y = 0;
    switch(e.key){
        case "ArrowLeft":
            if(!isMovingRight){
                x = -1; y = 0;
                isMovingLeft = true;
                isMovingUp = false;
                isMovingDown = false;
            }   
            break;
        
        case "ArrowRight":
            if(!isMovingLeft){
                x = 1; y = 0;
                isMovingRight = true;
                isMovingUp = false;
                isMovingDown = false;
            }
            break;      
        
        case "ArrowUp":
            if(!isMovingDown){
            x = 0; y = -1;
            isMovingUp = true;
            isMovingLeft = false;
            isMovingRight = false;
            }
            break;
        case "ArrowDown":
            if(!isMovingUp){
            x = 0; y = 1;
            isMovingDown = true;
            isMovingLeft = false;
            isMovingRight = false;
            }
            break;
    }
    moveSnakeHead(x,y);
    e.preventDefault();
});

// 3.) Touch Events to handle swipes on Mobile devices
gameBoard.addEventListener('touchstart',function touchStart(evt){
    evt.preventDefault();
	startingX = evt.touches[0].clientX ;
    startingY = evt.touches[0].clientY ;
});
gameBoard.addEventListener('touchend',function touchEnd(evt){
    evt.preventDefault();

    let x = 0;
    let y = 0;
    
    if(startingX+100 < movingX){
        if(!isMovingLeft){
            x = 1; y = 0;
            isMovingRight = true;
            isMovingUp = false;
            isMovingDown = false;
        }
	} 
    else if(startingX-100 > movingX){
		if(!isMovingRight){
            x = -1; y = 0;
            isMovingLeft = true;
            isMovingUp = false;
            isMovingDown = false;
        }   
	}
	if(startingY+100 < movingY){
		if(!isMovingUp){
            x = 0; y = 1;
            isMovingDown = true;
            isMovingLeft = false;
            isMovingRight = false;
            }
	} 
    else if(startingY-100 > movingY){
		if(!isMovingDown){
            x = 0; y = -1;
            isMovingUp = true;
            isMovingLeft = false;
            isMovingRight = false;
            }
    }
    moveSnakeHead(x,y);
});
gameBoard.addEventListener('touchmove', function touchMove(evt){
    evt.preventDefault();
    movingX = evt.touches[0].clientX ;
    movingY = evt.touches[0].clientY ;
});
