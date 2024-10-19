const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let direction = '';
let score = 0;

// Load sound effects
const eatSound = new Audio('sounds/eat.mp3');
const deadSound = new Audio('sounds/dead.mp3');

// Draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = i === 0 ? 'green' : 'white';
        context.fillRect(snake[i].x, snake[i].y, box, box);

        context.strokeStyle = 'red';
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

// Draw the food
function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, box, box);
}

// Move the snake
function moveSnake() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === 'LEFT') headX -= box;
    if (direction === 'UP') headY -= box;
    if (direction === 'RIGHT') headX += box;
    if (direction === 'DOWN') headY += box;

    // Snake eats food
    if (headX === food.x && headY === food.y) {
        eatSound.play();
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Remove the tail
    }

    // Add new head
    let newHead = { x: headX, y: headY };

    // Game over conditions
    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        deadSound.play();
        alert('Game Over!');
    }

    snake.unshift(newHead);
}

// Detect collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Control the snake
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
});

// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();

    // Display score
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, box, box * 1.5);
}

let game = setInterval(gameLoop, 150);
