const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('score');
const playButton = document.querySelector('.play-btn');
const menu = document.getElementById('menu');
let food = null;

const slider = document.getElementById("myRange");
const sliderValue = document.getElementById("value");

let snakeSpeed = 3; // moves how many times a second

let gridHeight = 21;
let gridWidth = 21;

let isMovingUp = false;
let isMovingDown = false;
let isMovingLeft = false;
let isMovingRight = false;

let isSnakeHead = true;

let foodX = 0;
let foodY = 0;

let score = 0;
let bestScore = 0;

let death = 0;
let move = 0;
let eaten = 0;

let segmentArray = [];

var startingX , startingY , movingX , movingY ;
let xDown = null;
let yDown = null;
let xUp = null;
let yUp = null;


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
            appendage.style.backgroundColor = 'darkRed';

        gameBoard.appendChild(appendage);
        isSnakeHead = false;
        segmentArray.push(this);
    }
}
const onSnake = (x,y) =>{
    for(const item of segmentArray){
        if(item.x === x && item.y === y)
            return true;
    }
    return false;
}

function foodGenerator(){
    if(food === null){
        food = document.createElement('div');
        food.classList.add('food');
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

function update(x,y){
    if(x === 0 && y === 0)return;
    else{
        for(let i = segmentArray.length; i>=2;i--){
            let segment = segmentArray[i-1].segment;
            segmentArray[i-1].x = segmentArray[i-2].x;
            segmentArray[i-1].y = segmentArray[i-2].y;
    
           // console.log(segment);
            segment.style.gridRowStart = segmentArray[i-1].y;
            segment.style.gridColumnStart = segmentArray[i-1].x;
        }
        segment = segmentArray[0].segment;
        
        segmentArray[0].x += x;
        segmentArray[0].y += y;
        segment.style.gridRowStart = segmentArray[0].y;
        segment.style.gridColumnStart = segmentArray[0].x;
    
       // console.log(segmentArray[0]);
    }
}

function moveSnake(){
    if(isMovingRight){
        update(1,0);
    }
    else if(isMovingLeft){
        update(-1,0);
    }
    else if(isMovingUp){
        update(0,-1);
    }
    else if(isMovingDown){
        update(0,1);
    }
}

function foodEaten(){
    for(let item of segmentArray){
        if(item.x === foodX && item.y === foodY){
            addAppendage();
            foodGenerator();
            score++;
            keepScore();
            break;
        }
    }
}
const biteSelf = (ele) =>{
    if(ele !== segmentArray[0]){
        if(ele.x === segmentArray[0].x && ele.y === segmentArray[0].y)
            return true;
    }
    return false;
}
const hitBorder = (ele) =>{
    return (ele.x < 1 || ele.x > gridWidth ||
        ele.y < 1 || ele.y > gridHeight);
}


function checkDeath(){
    if(segmentArray.some(biteSelf) || hitBorder(segmentArray[0])){
        clearInterval(move);
        clearInterval(death);
        clearInterval(eaten);

        for(let item of segmentArray){
            item.segment.remove();
        }
        segmentArray.splice(0,segmentArray.length);

        menu.style.zIndex = "1";
        gameBoard.style.zIndex = "-1";
    }
}
function keepScore(){
    if(score > bestScore){
        bestScore = score;
        menu.childNodes[3].innerHTML = `<h3>Best</h3>${bestScore}`;
    }
    scoreBoard.innerHTML = `<span>Score: ${score}</span>`;
    menu.childNodes[1].innerHTML = `<h3>Score</h3>${score}`;
}
slider.oninput = function() {
    sliderValue.innerHTML = `<span>Speed : ${this.value}</span>`
    snakeSpeed = this.value;
} 

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
playButton.addEventListener('click',(e)=>{
    e.stopPropagation();
    score = 0;
    keepScore();

    menu.style.zIndex = "-1";
    gameBoard.style.zIndex = "1";
    isSnakeHead = true;
    let obj = new snake(10,10);
    foodGenerator();

    death = setInterval(checkDeath,100);
    move = setInterval(moveSnake,(1/snakeSpeed) * 1000);
    eaten = setInterval(foodEaten,100);
})
document.addEventListener('keydown',function(e){
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
    update(x,y);
    e.preventDefault();
});

// Touch Events for mobile
gameBoard.addEventListener('touchstart',function touchStart(evt){
    evt.preventDefault();
	xDown = evt.touches[0].clientX ;
    yDown = evt.touches[0].clientY ;
});

gameBoard.addEventListener('touchmove', function touchMove(evt){
    evt.preventDefault();
    if(!xDown || !yDown)
        return;

    xUp = evt.touches[0].clientX ;
    yUp = evt.touches[0].clientY ;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    let x = 0; let y = 0;

    if(Math.abs(xDiff) > Math.abs(yDiff)){
        if(xDiff > 0){
            if(!isMovingRight){
                x = -1; y = 0;
                isMovingLeft = true;
                isMovingUp = false;
                isMovingDown = false;
            }   
        }
        else{
            if(!isMovingLeft){
                x = 1; y = 0;
                isMovingRight = true;
                isMovingUp = false;
                isMovingDown = false;
            }
        }
    }
    else{
        if(yDiff > 0){
            if(!isMovingDown){
                x = 0; y = -1;
                isMovingUp = true;
                isMovingLeft = false;
                isMovingRight = false;
                }
        }
        else{
            if(!isMovingUp){
                x = 0; y = 1;
                isMovingDown = true;
                isMovingLeft = false;
                isMovingRight = false;
                }
        }
    }
    update(x,y);
    xDown = null; yDown = null;
    xUp = null; yUp = null;
});
