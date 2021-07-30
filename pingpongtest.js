const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

const hitSound = new Audio( 'hitSound.wav');
const scoreSound = new Audio('scoreSound.wav');
const wallHitSound = new Audio('wallHitSound.wav');
const helloWord = new Audio(' intro.mp3')

let check=false

const net = {
    x:canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "White"
};

const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "White",
    score: 0
};

const bot = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "White",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "White"
}

function drawNet() {
    ctx.fillStyle = net.color;
    ctx.fillRect(net.x,net.y,net.width,net.height);
}

function drawScore(x,y,score) {
    ctx.fillStyle = "White";
    ctx.font ='50px serif';
    ctx.fillText(score,x,y);
}

function drawPaddle(x,y,width,height,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
}

function drawBall(x,y,radius,color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2,true);
    ctx.fill();
}

window.addEventListener('keydown', control);
function control(event) {
    switch (event.keyCode) {
        case 38:
            if (user.y > 0)
                user.y -= 8;
            break;
        case 40:
            if (user.y < canvas.height - 100)
                user.y += 8;
            break;
    }
    if (check===true) {
        control1(event);
    }
}

function control1(event) {
    switch (event.keyCode) {
        case 87:
            if (bot.y > 0)
                bot.y -= 8;
            break;
        case 83:
            if (bot.y < canvas.height - 100)
                bot.y += 8;
            break;
    }
}
window.requestAnimationFrame(control);

function reset() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

function collisionDetect (player,ball) {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right &&
        ball.top < player.bottom &&
        ball.right > player.left &&
        ball.bottom > player.top;
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let count = 0;
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        wallHitSound.play();
        ball.velocityY = - ball.velocityY;
    }
    if (ball.x + ball.radius >= canvas.width) {
        scoreSound.play();
        user.score +=1;
        if (user.score%10===1) {
            count++
        }
        reset();
    }
    if (ball.x - ball.radius <= 0 ) {
        scoreSound.play();
        bot.score +=1;
        if (bot.score%10===1) {
            count++
        }
        reset();
    }

    if (check===false) {
        bot.y += ((ball.y - (bot.y + bot.height/2))) * 0.09
    }

    let player = (ball.x < canvas.width / 2) ? user : bot;
    if (collisionDetect(player,ball)) {
        hitSound.play();
        let angle = 0
        if ( ball.y < (player.y + player.height/2)) {
            angle = -1 * Math.PI / 4;
        } else if (ball.y > (player.y + player.height /2) ) {
            angle = Math.PI / 4;
        }
        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
    }
    ball.speed += ((ball.speed*count)/25);
}

function render() {
    ctx.fillStyle = "Navy";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawNet();
    drawScore(canvas.width/4,canvas.height/6,user.score);
    drawScore(3*canvas.width/4,canvas.height/6,bot.score);
    drawPaddle(user.x,user.y,user.width,user.height,user.color);
    drawPaddle(bot.x,bot.y,bot.width,bot.height,bot.color);
    drawBall(ball.x,ball.y,ball.radius,ball.color);
}

function isBot() {
    return check=false;
}

function isPlayer() {
    return check=true;
}

function gameLoop() {
    helloWord.play();
    update();
    render();
    requestAnimationFrame(gameLoop);
}

