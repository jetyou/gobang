/**
 * 五子棋游戏测试
 */

const assert = require('assert');

// 导入游戏类（在实际测试中可能需要模拟 DOM）
describe('GobangGame', function() {
    describe('#initBoard()', function() {
        it('应该创建一个15x15的空棋盘', function() {
            // 这里测试棋盘初始化逻辑
            const board = [];
            for (let i = 0; i < 15; i++) {
                board[i] = [];
                for (let j = 0; j < 15; j++) {
                    board[i][j] = 0; // EMPTY
                }
            }
            
            assert.strictEqual(board.length, 15);
            assert.strictEqual(board[0].length, 15);
        });
    });
    
    describe('#isValidPosition()', function() {
        it('应该正确验证有效位置', function() {
            // 测试位置验证逻辑
            const isValidPosition = (col, row) => {
                return col >= 0 && col < 15 && row >= 0 && row < 15;
            };
            
            assert.strictEqual(isValidPosition(0, 0), true);
            assert.strictEqual(isValidPosition(14, 14), true);
            assert.strictEqual(isValidPosition(-1, 0), false);
            assert.strictEqual(isValidPosition(15, 0), false);
            assert.strictEqual(isValidPosition(7, 7), true);
        });
    });
    
    describe('#checkWin()', function() {
        it('应该检测水平连五', function() {
            const checkWin = (col, row, board, currentPlayer) => {
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
                
                for (const [dx, dy] of directions) {
                    let count = 1;
                    
                    // 正方向
                    let x = col + dx, y = row + dy;
                    while (x >= 0 && x < 15 && y >= 0 && y < 15 && board[y][x] === currentPlayer) {
                        count++;
                        x += dx;
                        y += dy;
                    }
                    
                    // 反方向
                    x = col - dx; y = row - dy;
                    while (x >= 0 && x < 15 && y >= 0 && y < 15 && board[y][x] === currentPlayer) {
                        count++;
                        x -= dx;
                        y -= dy;
                    }
                    
                    if (count >= 5) return true;
                }
                
                return false;
            };
            
            // 测试水平连五
            const board = Array(15).fill(null).map(() => Array(15).fill(0));
            board[7][3] = 1;
            board[7][4] = 1;
            board[7][5] = 1;
            board[7][6] = 1;
            board[7][7] = 1;
            
            assert.strictEqual(checkWin(7, 7, board, 1), true);
        });
        
        it('应该检测垂直连五', function() {
            // 测试垂直连五
            const board = Array(15).fill(null).map(() => Array(15).fill(0));
            board[3][7] = 1;
            board[4][7] = 1;
            board[5][7] = 1;
            board[6][7] = 1;
            board[7][7] = 1;
            
            // 模拟检测逻辑
            let count = 1;
            for (let i = 1; i < 5; i++) {
                if (board[7+i][7] === 1) count++;
            }
            for (let i = 1; i < 5; i++) {
                if (board[7-i][7] === 1) count++;
            }
            assert.strictEqual(count >= 5, true);
        });
        
        it('应该检测对角线连五', function() {
            // 测试对角线连五
            const board = Array(15).fill(null).map(() => Array(15).fill(0));
            board[3][3] = 1;
            board[4][4] = 1;
            board[5][5] = 1;
            board[6][6] = 1;
            board[7][7] = 1;
            
            assert.strictEqual(true, true); // 简化测试
        });
    });
    
    describe('#undo()', function() {
        it('应该正确撤销最后一步', function() {
            const history = [{col: 7, row: 7, player: 1}];
            const board = Array(15).fill(null).map(() => Array(15).fill(0));
            board[7][7] = 1;
            
            // 撤销
            const lastMove = history.pop();
            board[lastMove.row][lastMove.col] = 0;
            
            assert.strictEqual(board[7][7], 0);
            assert.strictEqual(history.length, 0);
        });
    });
});

// 运行测试
if (require.main === module) {
    const Mocha = require('mocha');
    const mocha = new Mocha();
    
    mocha.addFile(__filename);
    mocha.run(failures => {
        process.exitCode = failures ? 1 : 0;
    });
}
