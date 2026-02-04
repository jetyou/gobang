/**
 * 五子棋胜负判定测试
 */

const assert = require('assert');

// 模拟 GobangGame 的胜负判定逻辑
function checkWin(board, BOARD_SIZE, currentPlayer) {
    const directions = [
        [1, 0],   // 水平
        [0, 1],   // 垂直
        [1, 1],   // 对角线
        [1, -1]   // 反对角线
    ];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== currentPlayer) continue;
            
            for (const [dx, dy] of directions) {
                let count = 1;
                
                // 正方向
                let x = col + dx, y = row + dy;
                while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[y][x] === currentPlayer) {
                    count++;
                    x += dx;
                    y += dy;
                }
                
                // 反方向
                x = col - dx; y = row - dy;
                while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[y][x] === currentPlayer) {
                    count++;
                    x -= dx;
                    y -= dy;
                }
                
                if (count >= 5) {
                    return { win: true, col, row, count };
                }
            }
        }
    }
    
    return { win: false };
}

// 测试用例
console.log("🧪 五子棋胜负判定测试\n");

const BOARD_SIZE = 15;
const BLACK = 1;
const WHITE = 2;

// 测试 1: 水平连五
console.log("测试 1: 水平连五");
const board1 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board1[7][3] = BLACK;
board1[7][4] = BLACK;
board1[7][5] = BLACK;
board1[7][6] = BLACK;
board1[7][7] = BLACK;
const result1 = checkWin(board1, BOARD_SIZE, BLACK);
console.log(`  位置: (7,3) 到 (7,7) 水平连五`);
console.log(`  结果: ${result1.win ? '✅ 获胜' : '❌ 未检测到'}`);
console.log(`  连子数: ${result1.count}\n`);

// 测试 2: 垂直连五
console.log("测试 2: 垂直连五");
const board2 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board2[3][7] = BLACK;
board2[4][7] = BLACK;
board2[5][7] = BLACK;
board2[6][7] = BLACK;
board2[7][7] = BLACK;
const result2 = checkWin(board2, BOARD_SIZE, BLACK);
console.log(`  位置: (3,7) 到 (7,7) 垂直连五`);
console.log(`  结果: ${result2.win ? '✅ 获胜' : '❌ 未检测到'}`);
console.log(`  连子数: ${result2.count}\n`);

// 测试 3: 对角线连五
console.log("测试 3: 对角线连五");
const board3 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board3[3][3] = BLACK;
board3[4][4] = BLACK;
board3[5][5] = BLACK;
board3[6][6] = BLACK;
board3[7][7] = BLACK;
const result3 = checkWin(board3, BOARD_SIZE, BLACK);
console.log(`  位置: (3,3) 到 (7,7) 对角线连五`);
console.log(`  结果: ${result3.win ? '✅ 获胜' : '❌ 未检测到'}`);
console.log(`  连子数: ${result3.count}\n`);

// 测试 4: 反对角线连五
console.log("测试 4: 反对角线连五");
const board4 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board4[11][3] = BLACK;
board4[10][4] = BLACK;
board4[9][5] = BLACK;
board4[8][6] = BLACK;
board4[7][7] = BLACK;
const result4 = checkWin(board4, BOARD_SIZE, BLACK);
console.log(`  位置: (11,3) 到 (7,7) 反对角线连五`);
console.log(`  结果: ${result4.win ? '✅ 获胜' : '❌ 未检测到'}`);
console.log(`  连子数: ${result4.count}\n`);

// 测试 5: 只有四子（不应该获胜）
console.log("测试 5: 只有四子");
const board5 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board5[7][4] = BLACK;
board5[7][5] = BLACK;
board5[7][6] = BLACK;
board5[7][7] = BLACK;
const result5 = checkWin(board5, BOARD_SIZE, BLACK);
console.log(`  位置: (7,4) 到 (7,7) 只有四子`);
console.log(`  结果: ${result5.win ? '❌ 误判获胜' : '✅ 正确未获胜'}`);
console.log(`  连子数: ${result5.count}\n`);

// 测试 6: 白棋获胜
console.log("测试 6: 白棋获胜");
const board6 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board6[5][5] = WHITE;
board6[6][6] = WHITE;
board6[7][7] = WHITE;
board6[8][8] = WHITE;
board6[9][9] = WHITE;
const result6 = checkWin(board6, BOARD_SIZE, WHITE);
console.log(`  位置: (5,5) 到 (9,9) 白棋对角线连五`);
console.log(`  结果: ${result6.win ? '✅ 白棋获胜' : '❌ 未检测到'}`);
console.log(`  连子数: ${result6.count}\n`);

// 测试 7: 边界情况
console.log("测试 7: 边界连五");
const board7 = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
board7[0][0] = BLACK;
board7[0][1] = BLACK;
board7[0][2] = BLACK;
board7[0][3] = BLACK;
board7[0][4] = BLACK;
const result7 = checkWin(board7, BOARD_SIZE, BLACK);
console.log(`  位置: (0,0) 到 (0,4) 边界水平连五`);
console.log(`  结果: ${result7.win ? '✅ 获胜' : '❌ 未检测到'}`);
console.log(`  连子数: ${result7.count}\n`);

// 统计结果
const passed = [result1.win, result2.win, result3.win, result4.win, !result5.win, result6.win, result7.win].filter(x => x).length;
const total = 7;

console.log("=".repeat(50));
console.log(`📊 测试结果: ${passed}/${total} 通过`);
console.log("=".repeat(50));

if (passed === total) {
    console.log("✅ 所有测试通过！\n");
} else {
    console.log("❌ 有测试失败，需要修复！\n");
}

// 运行 assert 验证
console.log("\n🔬 单元测试验证:");
try {
    assert.strictEqual(checkWin(board1, BOARD_SIZE, BLACK).win, true, "水平连五应该获胜");
    assert.strictEqual(checkWin(board2, BOARD_SIZE, BLACK).win, true, "垂直连五应该获胜");
    assert.strictEqual(checkWin(board3, BOARD_SIZE, BLACK).win, true, "对角线连五应该获胜");
    assert.strictEqual(checkWin(board4, BOARD_SIZE, BLACK).win, true, "反对角线连五应该获胜");
    assert.strictEqual(checkWin(board5, BOARD_SIZE, BLACK).win, false, "只有四子不应该获胜");
    assert.strictEqual(checkWin(board6, BOARD_SIZE, WHITE).win, true, "白棋连五应该获胜");
    assert.strictEqual(checkWin(board7, BOARD_SIZE, BLACK).win, true, "边界连五应该获胜");
    
    console.log("✅ 所有单元测试通过！\n");
} catch (error) {
    console.error("❌ 单元测试失败:", error.message);
}
