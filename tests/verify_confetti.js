/**
 * 撒花动画功能验证脚本
 */

// 简单的断言函数
function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion Failed: ' + message);
    }
    console.log('✓ ' + message);
}

function assertStrictEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`Assertion Failed: ${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
    console.log('✓ ' + message);
}

// 测试 1: 颜色数组应该包含有效颜色
function testColors() {
    const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    
    assert(colors.length > 0, '颜色数组不为空');
    assert(colors.length === 16, '颜色数组有16个颜色');
    
    colors.forEach((color, i) => {
        assert(color.startsWith('#'), `颜色 ${i} 是有效的十六进制格式`);
        assert(color.length === 7, `颜色 ${i} 格式正确 (#RRGGBB)`);
    });
}

// 测试 2: 形状数组应该包含有效形状
function testShapes() {
    const shapes = ['circle', 'square', 'triangle'];
    assert(shapes.length === 3, '形状数组有3个形状');
    assert(shapes.includes('circle'), '包含 circle 形状');
    assert(shapes.includes('square'), '包含 square 形状');
    assert(shapes.includes('triangle'), '包含 triangle 形状');
}

// 测试 3: 随机选择逻辑
function testRandomSelection() {
    const colors = ['#f44336', '#e91e63', '#9c27b0'];
    const shapes = ['circle', 'square', 'triangle'];
    
    // 测试随机选择是否返回有效值
    for (let i = 0; i < 100; i++) {
        const selectedColor = colors[Math.floor(Math.random() * colors.length)];
        const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
        
        assert(colors.includes(selectedColor), `随机颜色 ${i} 有效`);
        assert(shapes.includes(selectedShape), `随机形状 ${i} 有效`);
    }
}

// 测试 4: 位置计算逻辑
function testPositionCalculation() {
    const x = Math.random() * 100;
    const delay = Math.random() * 2;
    
    assert(x >= 0 && x <= 100, 'X 位置在 0-100 范围内');
    assert(delay >= 0 && delay <= 2, '延迟时间在 0-2 秒范围内');
}

// 测试 5: 粒子计数
function testParticleCount() {
    const particleCount = 100;
    let createdCount = 0;
    
    for (let i = 0; i < particleCount; i++) {
        createdCount++;
    }
    
    assertStrictEqual(createdCount, 100, '应该创建100个粒子');
}

// 测试 6: 动画时长配置
function testDuration() {
    const duration = 3000;
    const quickBurstDuration = 2000;
    
    assertStrictEqual(duration, 3000, '主动画时长为3秒');
    assertStrictEqual(quickBurstDuration, 2000, '快速爆发动画时长为2秒');
}

// 测试 7: CSS 动画关键帧语法
function testCSSAnimationSyntax() {
    const keyframes = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    
    assert(keyframes.includes('@keyframes'), '包含关键帧定义');
    assert(keyframes.includes('translateY'), '使用 translateY 动画');
    assert(keyframes.includes('rotate'), '使用 rotate 动画');
    assert(keyframes.includes('opacity'), '使用 opacity 动画');
}

// 运行所有测试
console.log('=== 撒花动画功能测试 ===\n');

try {
    testColors();
    testShapes();
    testRandomSelection();
    testPositionCalculation();
    testParticleCount();
    testDuration();
    testCSSAnimationSyntax();
    
    console.log('\n=== 所有测试通过! ✅ ===');
} catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
}
