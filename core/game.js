/**
 * 五子棋游戏 v2.1 - 修复版 + 登录验证
 */

class GobangGame {
    constructor() {
        this.BOARD_SIZE = 15;
        this.CELL_SIZE = 40;
        this.PADDING = 20;
        this.EMPTY = 0;
        this.BLACK = 1;
        this.WHITE = 2;
        
        this.board = [];
        this.currentPlayer = this.BLACK;
        this.gameOver = false;
        this.history = [];
        this.stats = { blackWins: 0, whiteWins: 0 };
        this.currentStep = 0;
        this.isLoggedIn = false;
        
        this.canvas = document.getElementById('chessboard');
        this.ctx = this.canvas.getContext('2d');
        this.playerIndicator = document.getElementById('player-indicator');
        this.gameStatus = document.getElementById('game-status');
        this.restartBtn = document.getElementById('restart-btn');
        this.undoBtn = document.getElementById('undo-btn');
        this.boardOverlay = document.getElementById('board-overlay');
        
        this.bindEvents();
        this.initBoard();
        this.drawBoard();
        this.updateStatsDisplay();
        this.checkAuthState();
    }
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.restartBtn.addEventListener('click', () => this.restart());
        this.undoBtn.addEventListener('click', () => this.undo());
        
        // 监听登录状态变化
        window.addEventListener('game:authStateChange', (e) => {
            this.isLoggedIn = e.detail.isLoggedIn;
            this.updateBoardState();
        });
        
        // 页面加载时检查登录状态
        window.addEventListener('auth:login', () => {
            this.isLoggedIn = true;
            this.updateBoardState();
        });
        
        window.addEventListener('auth:logout', () => {
            this.isLoggedIn = false;
            this.updateBoardState();
        });
    }
    
    checkAuthState() {
        if (typeof authService !== 'undefined') {
            this.isLoggedIn = authService.checkLoginStatus();
            this.updateBoardState();
        }
    }
    
    updateBoardState() {
        if (!this.boardOverlay) return;
        
        if (this.isLoggedIn) {
            this.boardOverlay.style.display = 'none';
        } else {
            this.boardOverlay.style.display = 'flex';
        }
    }
    
    initBoard() {
        this.board = [];
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                this.board[i][j] = this.EMPTY;
            }
        }
        this.currentPlayer = this.BLACK;
        this.gameOver = false;
        this.history = [];
        this.currentStep = 0;
        this.updateUI();
    }
    
    handleClick(e) {
        // 检查登录状态
        if (!this.isLoggedIn) {
            this.showAuthRequired();
            return;
        }
        
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.round((x - this.PADDING) / this.CELL_SIZE);
        const row = Math.round((y - this.PADDING) / this.CELL_SIZE);
        
        if (this.isValidPosition(col, row)) {
            this.placePiece(col, row);
        }
    }
    
    showAuthRequired() {
        // 创建或更新提示
        let tip = document.querySelector('.auth-tip');
        if (tip) tip.remove();
        
        tip = document.createElement('div');
        tip.className = 'auth-tip';
        tip.innerHTML = `
            <span class="tip-icon">🔒</span>
            <span class="tip-text">请先登录后再下棋</span>
        `;
        document.body.appendChild(tip);
        
        setTimeout(() => tip.remove(), 2500);
    }
    
    isValidPosition(col, row) {
        return col >= 0 && col < this.BOARD_SIZE && 
               row >= 0 && row < this.BOARD_SIZE &&
               this.board[row][col] === this.EMPTY;
    }
    
    placePiece(col, row) {
        // 双重验证登录状态
        if (!this.isLoggedIn) {
            this.showAuthRequired();
            return false;
        }
        
        if (!this.isValidPosition(col, row) || this.gameOver) return false;
        
        const player = this.currentPlayer;
        this.currentStep++;
        this.board[row][col] = player;
        this.history.push({ col, row, player });
        
        this.drawPiece(col, row, player);
        
        if (this.checkWin(col, row, player)) {
            this.gameOver = true;
            this.updateStats(player);
            this.showWinner(player, this.currentStep);
            return true;
        }
        
        if (this.history.length === this.BOARD_SIZE * this.BOARD_SIZE) {
            this.gameOver = true;
            this.showDraw(this.currentStep);
            return true;
        }
        
        this.currentPlayer = this.currentPlayer === this.BLACK ? this.WHITE : this.BLACK;
        this.updateUI();
        
        return true;
    }
    
    checkWin(col, row, player) {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (const [dx, dy] of directions) {
            const forward = this.countInDirection(col, row, dx, dy, player);
            const backward = this.countInDirection(col, row, -dx, -dy, player);
            if (forward + backward - 1 >= 5) return true;
        }
        return false;
    }
    
    countInDirection(col, row, dx, dy, player) {
        let count = 1;  // 当前位置算1个
        let x = col + dx;
        let y = row + dy;
        while (x >= 0 && x < this.BOARD_SIZE && 
               y >= 0 && y < this.BOARD_SIZE &&
               this.board[y][x] === player) {
            count++;
            x += dx;
            y += dy;
        }
        return count;
    }
    
    updateStats(winner) {
        if (winner === this.BLACK) this.stats.blackWins++;
        else this.stats.whiteWins++;
        this.updateStatsDisplay();
    }
    
    updateStatsDisplay() {
        let statsContainer = document.getElementById('score-board');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.id = 'score-board';
            statsContainer.className = 'score-board';
            statsContainer.innerHTML = `
                <div class="score-item black">
                    <span class="piece">●</span>
                    <span class="wins">0</span>
                </div>
                <div class="vs">VS</div>
                <div class="score-item white">
                    <span class="piece">○</span>
                    <span class="wins">0</span>
                </div>
            `;
            const gameInfo = document.querySelector('.game-info');
            gameInfo.appendChild(statsContainer);
        }
        const blackWins = statsContainer.querySelector('.black .wins');
        const whiteWins = statsContainer.querySelector('.white .wins');
        blackWins.textContent = this.stats.blackWins;
        whiteWins.textContent = this.stats.whiteWins;
    }
    
    undo() {
        if (!this.isLoggedIn) {
            this.showAuthRequired();
            return false;
        }
        if (this.history.length === 0 || this.gameOver) return false;
        const lastMove = this.history.pop();
        this.board[lastMove.row][lastMove.col] = this.EMPTY;
        this.currentPlayer = lastMove.player;
        this.currentStep--;
        this.redrawBoard();
        this.updateUI();
        return true;
    }
    
    restart() {
        if (!this.isLoggedIn) {
            this.showAuthRequired();
            return;
        }
        const overlays = document.querySelectorAll('.winner-overlay');
        overlays.forEach(o => o.remove());
        this.initBoard();
        this.drawBoard();
    }
    
    drawBoard() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(this.PADDING + i * this.CELL_SIZE, this.PADDING);
            ctx.lineTo(this.PADDING + i * this.CELL_SIZE, this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.PADDING, this.PADDING + i * this.CELL_SIZE);
            ctx.lineTo(this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE, this.PADDING + i * this.CELL_SIZE);
            ctx.stroke();
        }
        this.drawStarPoint(7, 7);
        this.drawStarPoint(3, 3);
        this.drawStarPoint(3, 11);
        this.drawStarPoint(11, 3);
        this.drawStarPoint(11, 11);
        this.redrawBoard();
    }
    
    redrawBoard() {
        for (const move of this.history) {
            this.drawPiece(move.col, move.row, move.player);
        }
    }
    
    drawStarPoint(col, row) {
        const ctx = this.ctx;
        const x = this.PADDING + col * this.CELL_SIZE;
        const y = this.PADDING + row * this.CELL_SIZE;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8B4513';
        ctx.fill();
    }
    
    drawPiece(col, row, player) {
        const ctx = this.ctx;
        const x = this.PADDING + col * this.CELL_SIZE;
        const y = this.PADDING + row * this.CELL_SIZE;
        const radius = this.CELL_SIZE / 2 - 2;
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
        gradient.addColorStop(0, player === this.BLACK ? '#666' : '#fff');
        gradient.addColorStop(1, player === this.BLACK ? '#000' : '#ddd');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    updateUI() {
        if (this.currentPlayer === this.BLACK) {
            this.playerIndicator.textContent = '● 黑棋';
            this.playerIndicator.className = 'black-player';
        } else {
            this.playerIndicator.textContent = '○ 白棋';
            this.playerIndicator.className = 'white-player';
        }
        this.gameStatus.textContent = this.gameOver ? '游戏结束' : `第 ${this.currentStep} 步`;
    }
    
    showWinner(player, steps) {
        const winnerName = player === this.BLACK ? '黑棋' : '白棋';
        const blackScore = this.stats.blackWins;
        const whiteScore = this.stats.whiteWins;
        this.gameStatus.textContent = `${winnerName} 获胜！`;
        
        // 触发撒花动画
        setTimeout(() => {
            const confetti = getConfettiAnimation();
            confetti.quickBurst();
        }, 300);
        
        const overlay = document.createElement('div');
        overlay.className = 'winner-overlay';
        const message = document.createElement('div');
        message.className = 'winner-message';
        const title = document.createElement('h2');
        title.textContent = `🎉 ${winnerName} 获胜！ 🎉`;
        const stepsInfo = document.createElement('p');
        stepsInfo.className = 'steps';
        stepsInfo.innerHTML = `共用 <strong>${steps}</strong> 步`;
        const scoreInfo = document.createElement('p');
        scoreInfo.className = 'score';
        scoreInfo.textContent = `当前比分: 黑 ${blackScore} : ${whiteScore} 白`;
        const actions = document.createElement('div');
        actions.className = 'winner-actions';
        
        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn';
        restartBtn.textContent = '再来一局';
        restartBtn.addEventListener('click', () => {
            overlay.remove();
            this.restart();
        });
        
        const endBtn = document.createElement('button');
        endBtn.className = 'btn btn-secondary';
        endBtn.textContent = '结束游戏';
        endBtn.addEventListener('click', () => {
            overlay.remove();
        });
        
        actions.appendChild(restartBtn);
        actions.appendChild(endBtn);
        message.appendChild(title);
        message.appendChild(stepsInfo);
        message.appendChild(scoreInfo);
        message.appendChild(actions);
        overlay.appendChild(message);
        document.body.appendChild(overlay);
    }
    
    showDraw(steps) {
        const blackScore = this.stats.blackWins;
        const whiteScore = this.stats.whiteWins;
        this.gameStatus.textContent = '平局！';
        
        const overlay = document.createElement('div');
        overlay.className = 'winner-overlay';
        const message = document.createElement('div');
        message.className = 'winner-message';
        const title = document.createElement('h2');
        title.textContent = '🤝 平局！ 🤝';
        const stepsInfo = document.createElement('p');
        stepsInfo.className = 'steps';
        stepsInfo.innerHTML = `共用 <strong>${steps}</strong> 步`;
        const scoreInfo = document.createElement('p');
        scoreInfo.className = 'score';
        scoreInfo.textContent = `当前比分: 黑 ${blackScore} : ${whiteScore} 白`;
        const actions = document.createElement('div');
        actions.className = 'winner-actions';
        
        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn';
        restartBtn.textContent = '再来一局';
        restartBtn.addEventListener('click', () => {
            overlay.remove();
            this.restart();
        });
        
        const endBtn = document.createElement('button');
        endBtn.className = 'btn btn-secondary';
        endBtn.textContent = '结束游戏';
        endBtn.addEventListener('click', () => {
            overlay.remove();
        });
        
        actions.appendChild(restartBtn);
        actions.appendChild(endBtn);
        message.appendChild(title);
        message.appendChild(stepsInfo);
        message.appendChild(scoreInfo);
        message.appendChild(actions);
        overlay.appendChild(message);
        document.body.appendChild(overlay);
    }
}

let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new GobangGame();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GobangGame;
}
