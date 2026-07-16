// Sudoku Game Logic
document.addEventListener('DOMContentLoaded', function() {
    // Game state variables
    let gameBoard = [];
    let solutionBoard = [];
    let selectedCell = null;
    let gameActive = false;
    let gamePaused = false;
    let gameCompleted = false;
    let currentDifficulty = 1;
    let score = 0;
    let timeElapsed = 0;
    let timerInterval = null;
    let hintsUsed = 0;
    
    // DOM Elements
    const sudokuGrid = document.getElementById('sudokuGrid');
    const timeDisplay = document.getElementById('timeDisplay');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    const gameStatus = document.getElementById('gameStatus');
    const difficultyButtons = document.getElementById('difficultyButtons');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const hintBtn = document.getElementById('hintBtn');
    const solutionBtn = document.getElementById('solutionBtn');
    const numberButtons = document.querySelectorAll('.num-btn');
    
    // Difficulty settings
    const difficultySettings = [
        { name: "Easy", cellsToRemove: 40, scoreMultiplier: 1 },
        { name: "Medium", cellsToRemove: 45, scoreMultiplier: 1.5 },
        { name: "Hard", cellsToRemove: 50, scoreMultiplier: 2 },
        { name: "Expert", cellsToRemove: 52, scoreMultiplier: 3 },
        { name: "Master", cellsToRemove: 54, scoreMultiplier: 4 },
        { name: "Grandmaster", cellsToRemove: 56, scoreMultiplier: 5 },
        { name: "Legend", cellsToRemove: 58, scoreMultiplier: 6 },
        { name: "Impossible", cellsToRemove: 60, scoreMultiplier: 8 },
        { name: "Nightmare", cellsToRemove: 62, scoreMultiplier: 10 }
    ];
    
    // Initialize the game
    function initGame() {
        createDifficultyButtons();
        createSudokuGrid();
        loadGameState();
        updateDisplay();
        setEventListeners();
    }
    
    // Create difficulty buttons
    function createDifficultyButtons() {
        difficultySettings.forEach((setting, index) => {
            const button = document.createElement('button');
            button.className = `difficulty-btn ${index === 0 ? 'active' : ''}`;
            button.dataset.level = index + 1;
            button.textContent = `${index + 1}. ${setting.name}`;
            button.addEventListener('click', () => selectDifficulty(index + 1));
            difficultyButtons.appendChild(button);
        });
    }
    
    // Create the Sudoku grid
    function createSudokuGrid() {
        sudokuGrid.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = Math.floor(i / 9);
            cell.dataset.col = i % 9;
            cell.dataset.index = i;
            cell.addEventListener('click', () => selectCell(i));
            sudokuGrid.appendChild(cell);
        }
    }
    
    // Set up event listeners
    function setEventListeners() {
        startBtn.addEventListener('click', startGame);
        pauseBtn.addEventListener('click', togglePause);
        resetBtn.addEventListener('click', resetGame);
        hintBtn.addEventListener('click', giveHint);
        solutionBtn.addEventListener('click', showSolution);
        
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (selectedCell !== null && gameActive && !gamePaused) {
                    const value = parseInt(button.dataset.value);
                    if (value === 0) {
                        clearCell(selectedCell);
                    } else {
                        fillCell(selectedCell, value);
                    }
                }
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Select difficulty level
    function selectDifficulty(level) {
        currentDifficulty = level;
        document.querySelectorAll('.difficulty-btn').forEach((btn, index) => {
            if (index + 1 === level) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        levelDisplay.textContent = difficultySettings[level - 1].name;
        
        // If game is active, regenerate with new difficulty
        if (gameActive) {
            resetGame();
            startGame();
        }
    }
    
    // Start the game
    function startGame() {
        if (gameActive && !gamePaused) return;
        
        if (!gameActive) {
            // Generate new puzzle
            generatePuzzle();
            gameActive = true;
            gameCompleted = false;
            hintsUsed = 0;
            startTimer();
        } else if (gamePaused) {
            // Resume game
            togglePause();
        }
        
        gameStatus.innerHTML = '<p>Game in progress! Fill in the empty cells.</p>';
        startBtn.innerHTML = '<i class="fas fa-play"></i> Restart';
        updateDisplay();
        saveGameState();
    }
    
    // Generate a new Sudoku puzzle
    function generatePuzzle() {
        // Create a solved Sudoku board
        solutionBoard = generateSolvedBoard();
        
        // Create a copy for the game board with some cells removed
        gameBoard = JSON.parse(JSON.stringify(solutionBoard));
        removeCellsForPuzzle(difficultySettings[currentDifficulty - 1].cellsToRemove);
        
        // Update the grid display
        updateGridDisplay();
    }
    
    // Generate a solved Sudoku board
    function generateSolvedBoard() {
        const board = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill the diagonal 3x3 boxes (they are independent)
        for (let i = 0; i < 9; i += 3) {
            fillBox(board, i, i);
        }
        
        // Fill the rest of the board
        solveSudoku(board);
        
        return board;
    }
    
    // Fill a 3x3 box with random numbers
    function fillBox(board, row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffleArray(numbers);
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[row + i][col + j] = numbers.pop();
            }
        }
    }
    
    // Solve Sudoku using backtracking
    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffleArray(numbers);
                    
                    for (let num of numbers) {
                        if (isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (solveSudoku(board)) {
                                return true;
                            }
                            
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    // Remove cells to create the puzzle
    function removeCellsForPuzzle(cellsToRemove) {
        let removed = 0;
        
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (gameBoard[row][col] !== 0) {
                gameBoard[row][col] = 0;
                removed++;
            }
        }
    }
    
    // Update the grid display
    function updateGridDisplay() {
        const cells = document.querySelectorAll('.cell');
        
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const cell = cells[i];
            const value = gameBoard[row][col];
            
            cell.textContent = value === 0 ? '' : value;
            cell.classList.remove('prefilled', 'user-filled', 'error');
            
            if (value !== 0) {
                // Check if this was an original clue or user input
                const originalValue = solutionBoard[row][col];
                if (originalValue === value) {
                    cell.classList.add('prefilled');
                } else {
                    cell.classList.add('user-filled');
                    
                    // Check if it's correct
                    if (value !== solutionBoard[row][col]) {
                        cell.classList.add('error');
                    }
                }
            }
        }
        
        // Check if game is completed
        if (isGameComplete()) {
            completeGame();
        }
    }
    
    // Select a cell
    function selectCell(index) {
        if (!gameActive || gamePaused || gameCompleted) return;
        
        // Deselect previous cell
        if (selectedCell !== null) {
            document.querySelector(`.cell[data-index="${selectedCell}"]`).classList.remove('selected');
        }
        
        // Select new cell
        selectedCell = index;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        
        // Only allow selection of empty cells or user-filled cells
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        if (gameBoard[row][col] === 0 || !cell.classList.contains('prefilled')) {
            cell.classList.add('selected');
        } else {
            selectedCell = null;
        }
    }
    
    // Fill a cell with a value
    function fillCell(index, value) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        // Check if cell is empty or user-filled (not prefilled)
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell.classList.contains('prefilled')) return;
        
        // Check if the move is valid
        const isValid = isValidMove(gameBoard, row, col, value);
        
        // Update the game board
        gameBoard[row][col] = value;
        
        // Update display
        updateGridDisplay();
        
        // Update score
        if (isValid && value === solutionBoard[row][col]) {
            // Correct placement
            score += 10 * difficultySettings[currentDifficulty - 1].scoreMultiplier;
            gameStatus.innerHTML = '<p>Correct move! Keep going.</p>';
        } else if (!isValid || value !== solutionBoard[row][col]) {
            // Incorrect placement
            score = Math.max(0, score - 5);
            gameStatus.innerHTML = '<p>Incorrect move! Try again.</p>';
            gameStatus.classList.add('error');
            setTimeout(() => gameStatus.classList.remove('error'), 1000);
        }
        
        updateDisplay();
        saveGameState();
    }
    
    // Clear a cell
    function clearCell(index) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        // Check if cell is user-filled (not prefilled)
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell.classList.contains('prefilled')) return;
        
        // Clear the cell
        gameBoard[row][col] = 0;
        
        // Update display
        updateGridDisplay();
        saveGameState();
    }
    
    // Check if a move is valid
    function isValidMove(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num && x !== col) {
                return false;
            }
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num && x !== row) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num && 
                   (boxRow + i !== row || boxCol + j !== col)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Check if the game is complete
    function isGameComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (gameBoard[row][col] === 0 || gameBoard[row][col] !== solutionBoard[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Complete the game
    function completeGame() {
        gameActive = false;
        gameCompleted = true;
        clearInterval(timerInterval);
        
        // Calculate final score
        const timeBonus = Math.max(0, 1000 - timeElapsed) * difficultySettings[currentDifficulty - 1].scoreMultiplier;
        const hintPenalty = hintsUsed * 50;
        score += timeBonus - hintPenalty;
        
        gameStatus.innerHTML = `
            <p>Congratulations! You completed the ${difficultySettings[currentDifficulty - 1].name} puzzle!</p>
            <p>Time: ${formatTime(timeElapsed)} | Score: ${score}</p>
        `;
        gameStatus.classList.add('success');
        
        updateDisplay();
        saveGameState();
    }
    
    // Toggle pause
    function togglePause() {
        if (!gameActive || gameCompleted) return;
        
        gamePaused = !gamePaused;
        
        if (gamePaused) {
            clearInterval(timerInterval);
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            gameStatus.innerHTML = '<p>Game Paused</p>';
        } else {
            startTimer();
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            gameStatus.innerHTML = '<p>Game in progress! Fill in the empty cells.</p>';
        }
        
        updateDisplay();
    }
    
    // Reset the game
    function resetGame() {
        clearInterval(timerInterval);
        gameActive = false;
        gamePaused = false;
        gameCompleted = false;
        timeElapsed = 0;
        score = 0;
        selectedCell = null;
        
        // Clear the board
        gameBoard = Array(9).fill().map(() => Array(9).fill(0));
        updateGridDisplay();
        
        // Reset UI
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        gameStatus.innerHTML = '<p>Click "Start Game" to begin your Sudoku challenge!</p>';
        gameStatus.classList.remove('success', 'error');
        
        updateDisplay();
        saveGameState();
    }
    
    // Give a hint
    function giveHint() {
        if (!gameActive || gamePaused || gameCompleted || selectedCell === null) {
            gameStatus.innerHTML = '<p>Select an empty cell first to get a hint!</p>';
            gameStatus.classList.add('error');
            setTimeout(() => gameStatus.classList.remove('error'), 2000);
            return;
        }
        
        const row = Math.floor(selectedCell / 9);
        const col = selectedCell % 9;
        
        // Check if cell is already filled
        if (gameBoard[row][col] !== 0) {
            gameStatus.innerHTML = '<p>This cell is already filled!</p>';
            gameStatus.classList.add('error');
            setTimeout(() => gameStatus.classList.remove('error'), 2000);
            return;
        }
        
        // Fill with correct value
        const correctValue = solutionBoard[row][col];
        gameBoard[row][col] = correctValue;
        
        // Update display
        updateGridDisplay();
        
        // Update score and hints used
        hintsUsed++;
        score = Math.max(0, score - 20);
        
        gameStatus.innerHTML = `<p>Hint used! The correct value is ${correctValue}.</p>`;
        updateDisplay();
        saveGameState();
    }
    
    // Show the solution
    function showSolution() {
        if (!gameActive || gameCompleted) return;
        
        // Fill the entire board with solution
        gameBoard = JSON.parse(JSON.stringify(solutionBoard));
        updateGridDisplay();
        
        // End the game
        gameActive = false;
        gameCompleted = true;
        clearInterval(timerInterval);
        
        gameStatus.innerHTML = '<p>Solution revealed. Start a new game to play again!</p>';
        updateDisplay();
        saveGameState();
    }
    
    // Handle keyboard input
    function handleKeyPress(event) {
        if (!gameActive || gamePaused || gameCompleted || selectedCell === null) return;
        
        const key = event.key;
        
        if (key >= '1' && key <= '9') {
            fillCell(selectedCell, parseInt(key));
        } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
            clearCell(selectedCell);
        } else if (key === 'ArrowUp' && selectedCell >= 9) {
            selectCell(selectedCell - 9);
        } else if (key === 'ArrowDown' && selectedCell < 72) {
            selectCell(selectedCell + 9);
        } else if (key === 'ArrowLeft' && selectedCell % 9 !== 0) {
            selectCell(selectedCell - 1);
        } else if (key === 'ArrowRight' && selectedCell % 9 !== 8) {
            selectCell(selectedCell + 1);
        }
    }
    
    // Start the timer
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!gamePaused) {
                timeElapsed++;
                updateDisplay();
            }
        }, 1000);
    }
    
    // Update the display
    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeElapsed);
        scoreDisplay.textContent = score;
        
        if (gameActive && !gamePaused) {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.style.opacity = '1';
            });
        } else if (gamePaused) {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.style.opacity = '0.6';
            });
        }
    }
    
    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Utility function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Save game state to browser memory
    function saveGameState() {
        const gameState = {
            gameBoard,
            solutionBoard,
            currentDifficulty,
            score,
            timeElapsed,
            gameActive,
            gamePaused,
            gameCompleted,
            hintsUsed
        };
        
        try {
            localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
        } catch (e) {
            console.log('Could not save game state:', e);
        }
    }
    
    // Load game state from browser memory
    function loadGameState() {
        try {
            const savedState = localStorage.getItem('sudokuGameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                
                gameBoard = gameState.gameBoard || Array(9).fill().map(() => Array(9).fill(0));
                solutionBoard = gameState.solutionBoard || Array(9).fill().map(() => Array(9).fill(0));
                currentDifficulty = gameState.currentDifficulty || 1;
                score = gameState.score || 0;
                timeElapsed = gameState.timeElapsed || 0;
                gameActive = gameState.gameActive || false;
                gamePaused = gameState.gamePaused || false;
                gameCompleted = gameState.gameCompleted || false;
                hintsUsed = gameState.hintsUsed || 0;
                
                // Update UI
                selectDifficulty(currentDifficulty);
                updateGridDisplay();
                
                if (gameActive && !gamePaused && !gameCompleted) {
                    startTimer();
                    startBtn.innerHTML = '<i class="fas fa-play"></i> Restart';
                    gameStatus.innerHTML = '<p>Game loaded. Continue playing!</p>';
                } else if (gamePaused) {
                    pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                    gameStatus.innerHTML = '<p>Game Paused</p>';
                } else if (gameCompleted) {
                    gameStatus.innerHTML = `
                        <p>Previous game completed! Start a new game to play again.</p>
                        <p>Final Score: ${score}</p>
                    `;
                    gameStatus.classList.add('success');
                }
                
                updateDisplay();
            }
        } catch (e) {
            console.log('Could not load game state:', e);
        }
    }
    
    // Initialize the game
    initGame();
});