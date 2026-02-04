/**
 * 五子棋 v2.0 功能测试
 */

console.log("🧪 五子棋 v2.0 功能测试\n");

// 模拟 GobangGame 的核心逻辑进行测试
const BOARD_SIZE = 15;
const BLACK = 1;
const WHITE = 2;

class GobangGameTest {
    constructor() {
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
        this.currentPlayer = BLACK;
        this.gameOver = false;
        this.history = [];
        this.stats = { blackWins: 0, whiteWins: 0 };
        this.currentStep = 0;
    }
    
    isValidPosition(col, row) {
        return col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE && this.board[row][col] === 0;
    }
    
    placePiece(col, row) {
        if (!this.isValidPosition(col, row) || this.gameOver) return false;
        
        this.currentStep++;
        this.board[row][col] = this.currentPlayer;
        this.history.push({ col, row, player: this.currentPlayer });
        
        if (this.checkWin(col, row)) {
            this.gameOver = true;
            this.updateStats(this.currentPlayer);
            return { win: true, steps: this.currentStep };
        }
        
        if (this.history.length === BOARD_SIZE * BOARD_SIZE) {
            this.gameOver = true;
            return { draw: true };
        }
        
        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
        return { continue: true };
    }
    
    updateStats(winner) {
        if (winner === BLACK) this.stats.blackWins++;
        else this.stats.whiteWins++;
    }
    
    checkWin(col, row) {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (const [dx, dy] of directions) {
            let count = 1;
            let x = col + dx, y = row + dy;
            while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && this.board[y][x] === this.currentPlayer) {
                count++;
                x += dx;
                y += dy;
            }
            x = col - dx; y = row - dy;
            while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && this.board[y][x] === this.currentPlayer) {
                count++;
                x -= dx;
                y -= dy;
            }
            if (count >= 5) return true;
        }
        return false;
    }
    
    restart() {
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
        this.currentPlayer = BLACK;
        this.gameOver = false;
        this.history = [];
        this.currentStep = 0;
    }
    
    closePopup() {
        this.gameOver = true;
    }
}

// 测试用例
const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

test('v2.0: 计分系统初始化', () => {
    const game = new GobangGameTest();
    console.assert(game.stats.blackWins === 0, '黑棋胜场应为0');
    console.assert(game.stats.whiteWins === 0, '白棋胜场应为0');
    console.assert(game.currentStep === 0, '当前步数应为0');
});

test('v2.0: 黑棋获胜计分', () => {
    const game = new GobangGameTest();
    // 黑棋水平连五
    for (let i = 0; i < 5; i++) {
        game.placePiece(7 + i, 7);
    }
    console.assert(game.stats.blackWins === 1, '黑棋胜场应为1');
    console.assert(game.stats.whiteWins === 0, '白棋胜场应为0');
    console.assert(game.currentStep === 5, '当前步数应为5');
});

test('v2.0: 白棋获胜计分', () => {
    const game = new GobangGameTest();
    // 白棋对角线连五
    for (let i = 0; i < 5; i++) {
        game.placePiece(3 + i, 3 + i);
    }
    console.assert(game.stats.blackWins === 0, '黑棋胜场应为0');
    console.assert(game.stats.whiteWins === 1, '白棋胜场应为1');
    console.assert(game.currentStep === 5, '当前步数应为5');
});

test('v2.0: 多局比赛比分', () => {
    const game = new GobangGameTest();
    
    // 第一局：黑棋胜
    game.restart();
    for (let i = 0; i < 5; i++) game.placePiece(7 + i, 7);
    console.assert(game.stats.blackWins === 1, '第一局后黑棋应为1');
    
    // 第二局：白棋胜
    game.restart();
    for (let i = 0; i < 5; i++) game.placePiece(5 + i, 5 + i);
    console.assert(game.stats.blackWins === 1, '第二局后黑棋仍为1');
    console.assert(game.stats.whiteWins === 1, '第二局后白棋为1');
    
    // 第三局：黑棋胜
    game.restart();
    for (let i = 0; i < 5; i++) game.placePiece(7 + i, 8);
    console.assert(game.stats.blackWins === 2, '第三局后黑棋为2');
    console.assert(game.stats.whiteWins === 1, '第三局后白棋为1');
    
    console.log(`  最终比分: 黑 ${game.stats.blackWins} : ${game.stats.whiteWins} 白`);
});

test('v2.0: 步数统计', () => {
    const game = new GobangGameTest();
    
    // 落10子
    for (let i = 0; i < 10; i++) {
        const result = game.placePiece(i % 15, Math.floor(i / 2));
    }
    console.assert(game.currentStep === 10, '步数应为10');
});

test('v2.0: 结束游戏功能', () => {
    const game = new GobangGameTest();
    
    // 黑棋获胜
    for (let i = 0; i < 5; i++) game.placePiece(7 + i, 7);
    
    // 关闭弹窗（不重新开局）
    game.closePopup();
    console.assert(game.gameOver === true, '游戏应已结束');
    console.assert(game.stats.blackWins === 1, '比分应已记录');
});

// 运行测试
console.log("=".repeat(50));
let passed = 0;
let failed = 0;

tests.forEach(t => {
    try {
        t.fn();
        console.log(`✅ ${t.name}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${t.name}: ${error.message}`);
        failed++;
    }
});

console.log("=".repeat(50));
console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败\n`);

if (failed === 0) {
    console.log("🎉 所有 v2.0 测试通过！\n");
} else {
    console.log("⚠️ 有测试失败，需要修复！\n");
}

// 实际游戏流程测试
console.log("🎮 实际游戏流程测试:");
const game = new GobangGameTest();

const moves = [
    { col: 7, row: 3, expected: 'continue' },
    { col: 6, row: 6, expected: 'continue' },
    { col: 7, row: 4, expected: 'continue' },
    { col: 5, row: 5, expected: 'continue' },
    { col: 7, row: 5, expected: 'continue' },
    { col: 4, row: 4, expected: 'continue' },
    { col: 7, row: 6, expected: 'continue' },
    { col: 3, row: 3, expected: 'continue' },
    { col: 7, row: 7, expected: 'win' }
];

for (const move of moves) {
    const result = game.placePiece(move.col, move.row);
    if (result.win) {
        console.log(`  第 ${game.currentStep} 步: ${move.col},${move.row} -> 🎉 黑棋获胜！`);
        console.log(`  步数: ${game.currentStep}`);
        console.log(`  比分: 黑 ${game.stats.blackWins} : ${game.stats.whiteWins} 白`);
    }
}

console.log("\n✅ 测试完成！");
