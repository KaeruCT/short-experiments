// Initialize the game variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ROWS = 8;
const COLS = 8;
const TILE_SIZE = 24;
const VACUUM_COLOR = '#38d';
const VACUUM_RADIUS = 12;
const VACUUM_INNER_COLOR = '#6af';
const DUST_COLORS = ['#fff', '#ccc', '#aaa', '#888'];
const DUST_VALUES = [0, 1, 2, 3];
let floor = [];
let vacuumRow = Math.floor(Math.random() * ROWS);
let vacuumCol = Math.floor(Math.random() * COLS);
let timeLeft = 60;
let gameIsOver = false;
canvas.height = ROWS * TILE_SIZE;
canvas.width = COLS * TILE_SIZE;

// Generate the floor
for (let row = 0; row < ROWS; row++) {
    floor[row] = [];
    for (let col = 0; col < COLS; col++) {
        let dustValue = Math.floor(Math.random() * DUST_VALUES.length);
        floor[row][col] = dustValue;
    }
}

// Render the floor
function renderFloor() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            // Determine the tile color based on the dust value
            let dustValue = floor[row][col];
            let color = `rgb(${255 - dustValue * 50}, ${255 - dustValue * 50}, ${255 - dustValue * 50})`;
            ctx.fillStyle = color;
            // Render the tile as random pixels
            for (let i = 0; i < TILE_SIZE; i++) {
                for (let j = 0; j < TILE_SIZE; j++) {
                    if (Math.random() < 0.5) {
                        ctx.fillRect(col * TILE_SIZE + i, row * TILE_SIZE + j, 1, 1);
                    }
                }
            }
        }
    }
}

// Render the vacuum
function renderVacuum() {
    ctx.beginPath();
    ctx.fillStyle = VACUUM_COLOR;
    ctx.arc((vacuumCol + 0.5) * TILE_SIZE, (vacuumRow + 0.5) * TILE_SIZE, VACUUM_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = VACUUM_INNER_COLOR;
    ctx.arc((vacuumCol + 0.5) * TILE_SIZE, (vacuumRow + 0.5) * TILE_SIZE, VACUUM_RADIUS / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Check if the game is over
function checkGameOver() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (floor[row][col] !== 0) {
                return false;
            }
        }
    }
    return true;
}

// Update the game state
let lastMoveTime = 0;

function updateVacuum() {

}

// Update the game state
function update() {
    if (gameIsOver) {
        return;
    }
    // Move the vacuum
    let now = Date.now();
    if (now - lastMoveTime >= 100) {
        if ((keys.ArrowUp || keys.KeyW) && vacuumRow > 0) {
            vacuumRow--;
        }
        if ((keys.ArrowDown || keys.KeyS) && vacuumRow < ROWS - 1) {
            vacuumRow++;
        }
        if ((keys.ArrowLeft || keys.KeyA) && vacuumCol > 0) {
            vacuumCol--;
        }
        if ((keys.ArrowRight || keys.KeyD) && vacuumCol < COLS - 1) {
            vacuumCol++;
        }
        // Clean the tile
        let dustValue = floor[vacuumRow][vacuumCol];
        if (dustValue > 0) {
            floor[vacuumRow][vacuumCol] = dustValue - 1;
        }
        lastMoveTime = now;
    }
    // Update the timer
    timeLeft -= 1 / 60;
    if (timeLeft <= 0) {
        timeLeft = 0;
        gameIsOver = true;
    }
    // Check if the game is over
    if (checkGameOver()) {
        gameIsOver = true;
    }
}

function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderFloor();
    renderVacuum();
    document.getElementById('timer').innerHTML = `Time left: ${timeLeft.toFixed(1)}s`;
    // Render the game over screen
    if (gameIsOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '32px Arial';
        ctx.fillText('Game over!', canvas.width / 2 - 80, canvas.height / 2 - 20);
        ctx.font = '16px Arial';
        document.getElementById('restart').style.display = 'block';
    }
}

// Game loop
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    lastMoveTime = 0;
});
function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}
loop();

// Restart the game
document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});