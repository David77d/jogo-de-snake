const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const restartButton = document.getElementById('restart');
const pauseButton = document.getElementById('pause');

// Configurações do jogo
const box = 20;
let snake = [{x: 200, y: 200}];
let snakeDirection = 'RIGHT';
let letterPosition = randomPosition();
let score = 0;
let isPaused = false;
let game;

// Sistema de palavras
const targetWord = "david"; // Palavra que o jogador precisa montar
let currentWord = "";
let letter = targetWord[0]; // Começa com a primeira letra da palavra

// Elementos de UI
document.getElementById('targetWord').innerText = `Palavra: ${currentWord}`;
document.getElementById('score').innerText = `Score: ${score}`;

// Funções principais
function randomPosition() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

function drawLetter() {
    context.fillStyle = 'red';
    context.font = '20px Arial';
    context.fillText(letter, letterPosition.x + 5, letterPosition.y + 15);
}

function drawSnake() {
    snake.forEach(segment => {
        context.fillStyle = 'green';
        context.fillRect(segment.x, segment.y, box, box);
    });
}

function moveSnake() {
    if (isPaused) return;

    const head = {...snake[0]};

    // Movimentação
    if (snakeDirection === 'RIGHT') head.x += box;
    if (snakeDirection === 'LEFT') head.x -= box;
    if (snakeDirection === 'UP') head.y -= box;
    if (snakeDirection === 'DOWN') head.y += box;

    snake.unshift(head);

    // Verifica se coletou a letra correta
    if (head.x === letterPosition.x && head.y === letterPosition.y) {
        currentWord += letter;
        document.getElementById('targetWord').innerText = `Palavra: ${currentWord}`;
        
        if (currentWord === targetWord) {
            alert(`Parabéns! Você completou a palavra: ${targetWord}`);
            resetGame();
        } else {
            // Próxima letra da palavra
            letter = targetWord[currentWord.length];
            letterPosition = randomPosition();
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    } else {
        snake.pop();
    }

    // Verifica colisões
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('Game Over!');
        resetGame();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawLetter();
    moveSnake();
}

// Controles do jogo
function resetGame() {
    snake = [{x: 200, y: 200}];
    snakeDirection = 'RIGHT';
    letterPosition = randomPosition();
    score = 0;
    currentWord = "";
    letter = targetWord[0];
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('targetWord').innerText = 'Palavra: ';
    
    if (isPaused) {
        togglePause(); // Se estiver pausado, despausa ao reiniciar
    }
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(game);
        pauseButton.textContent = "Continue";
        
        // Overlay de pause
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.textAlign = 'center';
        context.fillText('PAUSADO', canvas.width/2, canvas.height/2);
    } else {
        game = setInterval(draw, 100);
        pauseButton.textContent = "Pause";
    }
}

// Event listeners
document.addEventListener('keydown', event => {
    if (isPaused) return;
    
    if (event.key === 'ArrowUp' && snakeDirection !== 'DOWN') snakeDirection = 'UP';
    if (event.key === 'ArrowDown' && snakeDirection !== 'UP') snakeDirection = 'DOWN';
    if (event.key === 'ArrowLeft' && snakeDirection !== 'RIGHT') snakeDirection = 'LEFT';
    if (event.key === 'ArrowRight' && snakeDirection !== 'LEFT') snakeDirection = 'RIGHT';
});

restartButton.addEventListener('click', resetGame);
pauseButton.addEventListener('click', togglePause);

// Inicia o jogo
game = setInterval(draw, 100);