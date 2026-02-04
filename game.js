/**
 * 五子棋游戏核心逻辑
 */

class GobangGame {
    constructor() {
        // 棋盘配置
        this.BOARD_SIZE = 15;
        this.CELL_SIZE = 40;
        this.PADDING = 20;
        
        // 棋子配置
        this.EMPTY = 0;
        this.BLACK = 1;
        this.WHITE = 2;
        
        // 游戏状态
        this.board = [];
        this.currentPlayer = this.BLACK;
        this.gameOver = false;
        this.history = []; // 记录落子历史，用于悔棋
        
        // Canvas
        this.canvas = document.getElementById('chessboard');
        this.ctx = this.canvas.getContext('2d');
        
        // UI 元素
        this.playerIndicator = document.getElementById('player-indicator');
        this.gameStatus = document.getElementById('game-status');
        this.restartBtn = document.getElementById('restart-btn');
        this.undoBtn = document.getElementById('undo-btn');
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化
        this.initBoard();
        this.drawBoard();
    }
    
    /**
     * 初始化棋盘
     */
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
        this.updateUI();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.restartBtn.addEventListener('click', () => this.restart());
        this.undoBtn.addEventListener('click', () => this.undo());
    }
    
    /**
     * 处理点击事件
     */
    handleClick(e) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算点击的坐标
        const col = Math.round((x - this.PADDING) / this.CELL_SIZE);
        const row = Math.round((y - this.PADDING) / this.CELL_SIZE);
        
        // 验证坐标是否有效
        if (this.isValidPosition(col, row)) {
            this.placePiece(col, row);
        }
    }
    
    /**
     * 检查位置是否有效
     */
    isValidPosition(col, row) {
        return col >= 0 && col < this.BOARD_SIZE && 
               row >= 0 && row < this.BOARD_SIZE &&
               this.board[row][col] === this.EMPTY;
    }
    
    /**
     * 落子
     */
    placePiece(col, row) {
        if (!this.isValidPosition(col, row) || this.gameOver) {
            return false;
        }
        
        this.board[row][col] = this.currentPlayer;
        this.history.push({ col, row, player: this.currentPlayer });
        
        this.drawPiece(col, row, this.currentPlayer);
        
        // 检查是否获胜
        if (this.checkWin(col, row)) {
            this.gameOver = true;
            this.showWinner(this.currentPlayer);
            return true;
        }
        
        // 检查平局
        if (this.history.length === this.BOARD_SIZE * this.BOARD_SIZE) {
            this.gameOver = true;
            this.showDraw();
            return true;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === this.BLACK ? this.WHITE : this.BLACK;
        this.updateUI();
        
        return true;
    }
    
    /**
     * 悔棋
     */
    undo() {
        if (this.history.length === 0 || this.gameOver) {
            return false;
        }
        
        const lastMove = this.history.pop();
        this.board[lastMove.row][lastMove.col] = this.EMPTY;
        this.currentPlayer = lastMove.player;
        
        this.redrawBoard();
        this.updateUI();
        
        return true;
    }
    
    /**
     * 重新开始
     */
    restart() {
        this.initBoard();
        this.drawBoard();
    }
    
    /**
     * 检查获胜
     */
    checkWin(col, row) {
        const directions = [
            [1, 0],   // 水平
            [0, 1],   // 垂直
            [1, 1],   // 对角线
            [1, -1]   // 反对角线
        ];
        
        for (const [dx, dy] of directions) {
            if (this.countInDirection(col, row, dx, dy) + 
                this.countInDirection(col, row, -dx, -dy) - 1 >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 统计某个方向上的连续棋子数
     */
    countInDirection(col, row, dx, dy) {
        let count = 0;
        let x = col + dx;
        let y = row + dy;
        
        while (x >= 0 && x < this.BOARD_SIZE && 
               y >= 0 && y < this.BOARD_SIZE &&
               this.board[y][x] === this.currentPlayer) {
            count++;
            x += dx;
            y += dy;
        }
        
        return count;
    }
    
    /**
     * 绘制棋盘
     */
    drawBoard() {
        const ctx = this.ctx;
        
        // 清空画布
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            // 垂直线
            ctx.beginPath();
            ctx.moveTo(this.PADDING + i * this.CELL_SIZE, this.PADDING);
            ctx.lineTo(this.PADDING + i * this.CELL_SIZE, 
                      this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE);
            ctx.stroke();
            
            // 水平线
            ctx.beginPath();
            ctx.moveTo(this.PADDING, this.PADDING + i * this.CELL_SIZE);
            ctx.lineTo(this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE,
                      this.PADDING + i * this.CELL_SIZE);
            ctx.stroke();
        }
        
        // 绘制星位（天元和四个角的星位）
        this.drawStarPoint(7, 7); // 天元
        this.drawStarPoint(3, 3);
        this.drawStarPoint(3, 11);
        this.drawStarPoint(11, 3);
        this.drawStarPoint(11, 11);
        
        // 重绘所有棋子
        this.redrawBoard();
    }
    
    /**
     * 重绘棋盘（用于悔棋后刷新）
     */
    redrawBoard() {
        for (const move of this.history) {
            this.drawPiece(move.col, move.row, move.player);
        }
    }
    
    /**
     * 绘制星位
     */
    drawStarPoint(col, row) {
        const ctx = this.ctx;
        const x = this.PADDING + col * this.CELL_SIZE;
        const y = this.PADDING + row * this.CELL_SIZE;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8B4513';
        ctx.fill();
    }
    
    /**
     * 绘制棋子
     */
    drawPiece(col, row, player) {
        const ctx = this.ctx;
        const x = this.PADDING + col * this.CELL_SIZE;
        const y = this.PADDING + row * this.CELL_SIZE;
        const radius = this.CELL_SIZE / 2 - 2;
        
        // 绘制棋子阴影
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
        
        // 绘制棋子主体
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, 
                                                   x, y, radius);
        if (player === this.BLACK) {
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ddd');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    /**
     * 更新UI显示
     */
    updateUI() {
        // 更新当前玩家指示器
        if (this.currentPlayer === this.BLACK) {
            this.playerIndicator.textContent = '● 黑棋';
            this.playerIndicator.className = 'black-player';
        } else {
            this.playerIndicator.textContent = '○ 白棋';
            this.playerIndicator.className = 'white-player';
        }
        
        // 更新游戏状态
        if (this.gameOver) {
            this.gameStatus.textContent = '游戏结束';
        } else {
            this.gameStatus.textContent = '游戏进行中';
        }
    }
    
    /**
     * 显示胜利者
     */
    showWinner(player) {
        const winnerName = player === this.BLACK ? '黑棋' : '白棋';
        this.gameStatus.textContent = `${winnerName} 获胜！`;
        
        // 创建胜利提示弹窗
        const overlay = document.createElement('div');
        overlay.className = 'winner-overlay';
        overlay.innerHTML = `
            <div class="winner-message">
                <h2>🎉 ${winnerName} 获胜！ 🎉</h2>
                <button class="btn" onclick="this.parentElement.parentElement.remove(); game.restart();">
                    再来一局
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    /**
     * 显示平局
     */
    showDraw() {
        this.gameStatus.textContent = '平局！';
        
        const overlay = document.createElement('div');
        overlay.className = 'winner-overlay';
        overlay.innerHTML = `
            <div class="winner-message">
                <h2>🤝 平局！ 🤝</h2>
                <button class="btn" onclick="this.parentElement.parentElement.remove(); game.restart();">
                    再来一局
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

// 初始化游戏
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new GobangGame();
});

// 导出以便测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GobangGame;
}
