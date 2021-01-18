// select canvas element
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

const ballSpeed = 15;

// Ball object
const ball = {
    x : canvas.width/2, // right side of canvas
    y : canvas.height/2,
    radius : 10,
    velocityX : ballSpeed*Math.cos(Math.PI/4),
    velocityY : ballSpeed*Math.sin(Math.PI/4),
    speed : ballSpeed,
    color : "WHITE",
    speedUpLevel: 0
}

// User Paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, 
    width : 20,
    height : 100,
    score : 0,
    color : "WHITE"
}

// computerputer Paddle
const computer = {
    x : canvas.width - 20, 
    y : (canvas.height - 100)/2, 
    width : 20,
    height : 100,
    score : 0,
    color : "WHITE",
}

// Net/line in the middle
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 30,
    width : 4,
    color : "WHITE"
}

// draw rectangle
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// reset the ball 
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = ballSpeed;
}

// draw net/line in middle
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=45){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "20px fantasy";
    ctx.fillText(text, x, y);
}

// is there collison between ball and paddle?
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update the game by executing all the logic
function update(){
    
    // update scores
    if( ball.x - ball.radius < 0 ){
        computer.score++;
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    randMargin = Math.random()+5;
    // computer plays
    computer.y += ball.y - (computer.y + computer.height/(5+randMargin));
    // user(computer 2) plays
    user.y += ball.y - (user.y + user.height/(5+randMargin));
    
    // when the ball collides with bottom and top walls, inverse the y velocity
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // check if the paddle hit the user or the computer paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : computer;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, get numbers between -1 and 1
        collidePoint = collidePoint / (player.height/2);
        // Math.PI/4 = 45degrees, use it for the ball re-direction
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime it hits paddle
        ball.speed += ball.speedUpLevel;
    }
}

// render function, draws everything
function render(){

    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // // draw the user score
    // drawText(user.score,canvas.width/2-20,canvas.height/5);
    
    // // draw the computer score
    // drawText(computer.score,canvas.width/2+10,canvas.height/5);
    
    // draw the net in the middle
    drawNet();
    
    // draw the user paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the computer paddle
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}

let isRunning = false;
let loop;
// toggle, start/stop everything
function togglePong() {
    if (isRunning) {
        clearInterval(loop);
        // clear the canvas
        drawRect(0, 0, canvas.width, canvas.height, "#000");
        isRunning = false;
    }
    else {
        let framePerSecond = 60;
        //call the game function 50 times every 1 Sec
        loop = setInterval(game,1000/framePerSecond);
        isRunning = true;
    } 
}

