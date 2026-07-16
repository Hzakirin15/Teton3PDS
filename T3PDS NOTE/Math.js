class MathGame {
    constructor() {
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.questionElement = document.getElementById('question');
        this.answerInput = document.getElementById('answerInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.showHistoryBtn = document.getElementById('showHistoryBtn');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.exportHistoryBtn = document.getElementById('exportHistoryBtn');
        
        this.correctCountElement = document.getElementById('correctCount');
        this.wrongCountElement = document.getElementById('wrongCount');
        this.accuracyElement = document.getElementById('accuracy');
        
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalCorrectElement = document.getElementById('finalCorrect');
        this.finalAccuracyElement = document.getElementById('finalAccuracy');
        this.finalPlayerElement = document.getElementById('finalPlayer');
        this.gameOverScreen = document.getElementById('gameOver');
        
        this.usernameInput = document.getElementById('usernameInput');
        this.saveUsernameBtn = document.getElementById('saveUsernameBtn');
        this.currentUsernameElement = document.getElementById('currentUsername');
        this.currentUserDisplay = document.getElementById('currentUserDisplay');
        
        this.historyModal = document.getElementById('historyModal');
        this.historyList = document.getElementById('historyList');
        this.noHistoryMessage = document.getElementById('noHistoryMessage');
        
        // Game state
        this.timeLeft = 60;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.gameActive = false;
        this.timerInterval = null;
        this.currentQuestion = null;
        this.username = 'Guest';
        this.gameHistory = [];
        
        // Operations
        this.operations = ['+', '-', '*', '/'];
        
        this.setupEventListeners();
        this.loadGameHistory();
        this.loadUsername();
        this.generateQuestion();
        this.updateStats();
        this.updateUserDisplay();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        this.saveUsernameBtn.addEventListener('click', () => this.saveUsername());
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveUsername();
            }
        });
        
        this.showHistoryBtn.addEventListener('click', () => this.showHistory());
        this.closeHistoryBtn.addEventListener('click', () => this.hideHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        
        // Close modal when clicking outside
        this.historyModal.addEventListener('click', (e) => {
            if (e.target === this.historyModal) {
                this.hideHistory();
            }
        });
        
        // Only allow whole numbers
        this.answerInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9-]/g, '');
            if (e.target.value.startsWith('-')) {
                e.target.value = '-' + e.target.value.slice(1).replace(/[^0-9]/g, '');
            }
        });
    }
    
    saveUsername() {
        const username = this.usernameInput.value.trim();
        if (username) {
            this.username = username;
            localStorage.setItem('mathGameUsername', this.username);
            this.updateUserDisplay();
            this.usernameInput.value = '';
            this.showNotification('Username saved successfully!', 'success');
        } else {
            this.showNotification('Please enter a username', 'error');
        }
    }
    
    loadUsername() {
        const savedUsername = localStorage.getItem('mathGameUsername');
        if (savedUsername) {
            this.username = savedUsername;
            this.updateUserDisplay();
        }
    }
    
    updateUserDisplay() {
        this.currentUsernameElement.textContent = this.username;
        this.finalPlayerElement.textContent = this.username;
    }
    
    startGame() {
        if (this.gameActive) return;
        
        this.gameActive = true;
        this.timeLeft = 60;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.answerInput.disabled = false;
        this.answerInput.focus();
        
        this.gameOverScreen.classList.add('hidden');
        this.updateDisplay();
        this.generateQuestion();
        this.startTimer();
    }
    
    pauseGame() {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.answerInput.disabled = true;
        
        this.startBtn.textContent = 'Resume';
    }
    
    resetGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        this.timeLeft = 60;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.answerInput.disabled = false;
        this.answerInput.value = '';
        
        this.startBtn.textContent = 'Start Game';
        this.gameOverScreen.classList.add('hidden');
        
        this.updateDisplay();
        this.generateQuestion();
    }
    
    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    endGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.answerInput.disabled = true;
        
        // Save game result to history
        this.saveGameResult();
        
        this.finalScoreElement.textContent = this.score;
        this.finalCorrectElement.textContent = this.correctCount;
        this.finalAccuracyElement.textContent = this.calculateAccuracy();
        this.finalPlayerElement.textContent = this.username;
        
        this.gameOverScreen.classList.remove('hidden');
    }
    
    saveGameResult() {
        const gameResult = {
            username: this.username,
            score: this.score,
            correct: this.correctCount,
            wrong: this.wrongCount,
            accuracy: this.calculateAccuracy(),
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        this.gameHistory.unshift(gameResult);
        
        // Keep only last 50 games
        if (this.gameHistory.length > 50) {
            this.gameHistory = this.gameHistory.slice(0, 50);
        }
        
        this.saveGameHistory();
    }
    
    saveGameHistory() {
        localStorage.setItem('mathGameHistory', JSON.stringify(this.gameHistory));
    }
    
    loadGameHistory() {
        const savedHistory = localStorage.getItem('mathGameHistory');
        if (savedHistory) {
            this.gameHistory = JSON.parse(savedHistory);
        }
    }
    
    showHistory() {
        this.renderHistory();
        this.historyModal.classList.remove('hidden');
    }
    
    hideHistory() {
        this.historyModal.classList.add('hidden');
    }
    
    renderHistory() {
        if (this.gameHistory.length === 0) {
            this.historyList.classList.add('hidden');
            this.noHistoryMessage.classList.remove('hidden');
            return;
        }
        
        this.historyList.classList.remove('hidden');
        this.noHistoryMessage.classList.add('hidden');
        
        // Sort by score (descending)
        const sortedHistory = [...this.gameHistory].sort((a, b) => b.score - a.score);
        
        this.historyList.innerHTML = '';
        
        sortedHistory.forEach((game, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${index < 3 ? 'high-score' : ''}`;
            
            const date = new Date(game.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            historyItem.innerHTML = `
                <div class="history-rank">#${index + 1}</div>
                <div class="history-details">
                    <div class="history-username">${this.escapeHtml(game.username)}</div>
                    <div class="history-stats">${game.correct} correct • ${game.wrong} wrong • ${game.accuracy}</div>
                    <div class="history-date">${formattedDate}</div>
                </div>
                <div class="history-score">${game.score}</div>
            `;
            
            this.historyList.appendChild(historyItem);
        });
    }
    
    clearHistory() {
        if (confirm('Are you sure you want to clear all game history?')) {
            this.gameHistory = [];
            localStorage.removeItem('mathGameHistory');
            this.renderHistory();
            this.showNotification('History cleared successfully!', 'success');
        }
    }
    
    exportHistory() {
        if (this.gameHistory.length === 0) {
            this.showNotification('No history to export', 'error');
            return;
        }
        
        const csvContent = this.convertToCSV(this.gameHistory);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `math_game_history_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('History exported successfully!', 'success');
    }
    
    convertToCSV(history) {
        const headers = ['Rank', 'Username', 'Score', 'Correct', 'Wrong', 'Accuracy', 'Date'];
        const rows = history.map((game, index) => [
            index + 1,
            game.username,
            game.score,
            game.correct,
            game.wrong,
            game.accuracy,
            new Date(game.date).toLocaleString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4ecdc4, #45b7d1)' : 'linear-gradient(135deg, #ff6b6b, #ee5a24)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    generateQuestion() {
        const operation = this.operations[Math.floor(Math.random() * this.operations.length)];
        let num1, num2, answer;
        
        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 + num2;
                break;
                
            case '-':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
                
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                break;
                
            case '/':
                // Ensure division results in whole numbers
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * answer;
                break;
        }
        
        this.currentQuestion = { num1, num2, operation, answer };
        this.questionElement.textContent = `${num1} ${operation} ${num2} = ?`;
        this.answerInput.value = '';
    }
    
    checkAnswer() {
        if (!this.gameActive) return;
        
        const userAnswer = parseInt(this.answerInput.value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback(false);
            return;
        }
        
        if (userAnswer === this.currentQuestion.answer) {
            this.score += 10;
            this.correctCount++;
            this.showFeedback(true);
        } else {
            this.wrongCount++;
            this.showFeedback(false);
        }
        
        this.updateStats();
        this.generateQuestion();
        this.answerInput.focus();
    }
    
    showFeedback(isCorrect) {
        const questionContainer = document.querySelector('.question-container');
        
        if (isCorrect) {
            questionContainer.classList.remove('wrong-feedback');
            questionContainer.classList.add('correct-feedback');
        } else {
            questionContainer.classList.remove('correct-feedback');
            questionContainer.classList.add('wrong-feedback');
        }
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            questionContainer.classList.remove('correct-feedback', 'wrong-feedback');
        }, 500);
    }
    
    updateDisplay() {
        this.timerElement.textContent = `${this.timeLeft}s`;
        this.scoreElement.textContent = this.score;
        
        // Change timer color when time is running out
        if (this.timeLeft <= 10) {
            this.timerElement.style.color = '#ff6b6b';
            this.timerElement.style.animation = 'pulse 1s infinite';
        } else {
            this.timerElement.style.color = '#4ecdc4';
            this.timerElement.style.animation = 'none';
        }
    }
    
    updateStats() {
        this.correctCountElement.textContent = this.correctCount;
        this.wrongCountElement.textContent = this.wrongCount;
        this.accuracyElement.textContent = this.calculateAccuracy();
    }
    
    calculateAccuracy() {
        const total = this.correctCount + this.wrongCount;
        return total > 0 ? Math.round((this.correctCount / total) * 100) + '%' : '0%';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const mathGame = new MathGame();
});

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);