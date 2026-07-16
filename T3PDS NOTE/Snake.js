class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        
        // Game constants
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameLoop = null;
        
        // Color palettes
        this.snakeColors = [
            '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#ff6b6b'
        ];
        this.foodColors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'
        ];
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateHighScoreDisplay();
    }

    initializeGame() {
        // Initialize snake in the center
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        // Generate first food
        this.generateFood();
        
        // Reset score and direction
        this.score = 0;
        this.dx = 1;
        this.dy = 0;
        
        this.updateScoreDisplay();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy === 0) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                    if (this.dy === 0) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (this.dx === 0) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (this.dx === 0) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
                case ' ':
                    this.togglePause();
                    break;
            }
        });

        // Button controls
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());

        // Mobile controls
        document.getElementById('up').addEventListener('click', () => {
            if (this.dy === 0 && this.gameRunning && !this.gamePaused) {
                this.dx = 0;
                this.dy = -1;
            }
        });
        document.getElementById('down').addEventListener('click', () => {
            if (this.dy === 0 && this.gameRunning && !this.gamePaused) {
                this.dx = 0;
                this.dy = 1;
            }
        });
        document.getElementById('left').addEventListener('click', () => {
            if (this.dx === 0 && this.gameRunning && !this.gamePaused) {
                this.dx = -1;
                this.dy = 0;
            }
        });
        document.getElementById('right').addEventListener('click', () => {
            if (this.dx === 0 && this.gameRunning && !this.gamePaused) {
                this.dx = 1;
                this.dy = 0;
            }
        });
    }

    startGame() {
        if (!this.gameRunning) {
            this.initializeGame();
            this.gameRunning = true;
            this.gamePaused = false;
            this.startBtn.textContent = 'Restart';
            this.runGame();
        } else {
            this.initializeGame();
            this.gamePaused = false;
        }
    }

    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        this.pauseBtn.textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        if (this.gamePaused) {
            this.showPauseScreen();
        } else {
            this.hidePauseScreen();
            this.runGame();
        }
    }

    runGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            if (!this.gamePaused) {
                this.update();
                this.draw();
            }
        }, 150);
    }

    update() {
        // Move snake
        let head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Implement through-walls functionality
        if (head.x < 0) {
            head.x = this.tileCount - 1;
            this.showTeleportEffect();
        } else if (head.x >= this.tileCount) {
            head.x = 0;
            this.showTeleportEffect();
        }
        
        if (head.y < 0) {
            head.y = this.tileCount - 1;
            this.showTeleportEffect();
        } else if (head.y >= this.tileCount) {
            head.y = 0;
            this.showTeleportEffect();
        }
        
        // Check self collision (game over condition remains)
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScoreDisplay();
            this.generateFood();
            
            // Add visual feedback for eating food
            this.showEatEffect();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas with dark background
        this.ctx.fillStyle = 'rgba(13, 17, 23, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw snake with gradient colors
        this.snake.forEach((segment, index) => {
            const colorIndex = index % this.snakeColors.length;
            this.ctx.fillStyle = this.snakeColors[colorIndex];
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
            
            // Add glow effect for head
            if (index === 0) {
                this.ctx.shadowColor = this.snakeColors[colorIndex];
                this.ctx.shadowBlur = 10;
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
                this.ctx.shadowBlur = 0;
            }
        });
        
        // Draw food with animation
        this.drawFood();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.tileCount; i++) {
            for (let j = 0; j < this.tileCount; j++) {
                this.ctx.strokeRect(i * this.gridSize, j * this.gridSize, this.gridSize, this.gridSize);
            }
        }
    }

    drawFood() {
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        const size = this.gridSize * pulse - 2;
        const offset = (this.gridSize - size) / 2;
        
        this.ctx.fillStyle = this.food.color;
        this.ctx.shadowColor = this.food.color;
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            size / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    generateFood() {
        let newFood;
        let onSnake;
        
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            onSnake = this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
        } while (onSnake);
        
        this.food = newFood;
        this.food.color = this.foodColors[Math.floor(Math.random() * this.foodColors.length)];
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
    }

    updateHighScoreDisplay() {
        this.highScoreElement.textContent = this.highScore;
    }

    showTeleportEffect() {
        const effect = document.createElement('div');
        effect.className = 'teleport-effect';
        document.querySelector('.game-area').appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 300);
    }

    showEatEffect() {
        // Add a quick flash effect when eating food
        const canvas = this.canvas;
        const originalStyle = canvas.style.boxShadow;
        canvas.style.boxShadow = '0 0 30px #4ecdc4';
        
        setTimeout(() => {
            canvas.style.boxShadow = originalStyle;
        }, 200);
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateHighScoreDisplay();
        }
        
        this.showGameOver();
    }

    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>Game Over!</h2>
            <p>Final Score: ${this.score}</p>
            <p>High Score: ${this.highScore}</p>
            <button onclick="this.parentElement.remove(); snakeGame.startGame();" class="action-btn">
                Play Again
            </button>
        `;
        document.querySelector('.game-area').appendChild(gameOverDiv);
    }

    showPauseScreen() {
        const pauseDiv = document.createElement('div');
        pauseDiv.className = 'paused';
        pauseDiv.innerHTML = `
            <h2>Game Paused</h2>
            <p>Score: ${this.score}</p>
            <button onclick="this.parentElement.remove(); snakeGame.togglePause();" class="action-btn">
                Resume
            </button>
        `;
        document.querySelector('.game-area').appendChild(pauseDiv);
    }

    hidePauseScreen() {
        const pauseDiv = document.querySelector('.paused');
        if (pauseDiv) {
            pauseDiv.remove();
        }
    }
}

// Initialize the game when the page loads
const snakeGame = new SnakeGame();

// Draw initial state
snakeGame.draw();