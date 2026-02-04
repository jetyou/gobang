/**
 * 认证模块测试
 */

// 模拟 localStorage (Node环境)
global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value;
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

// 加载认证模块
const AuthModule = require('./auth.js');
const AuthService = AuthModule;
const authService = new AuthService();

const assert = {
    equal(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} 预期 ${expected}, 得到 ${actual}`);
        }
        console.log(`✅ ${message || '测试通过'}`);
    },
    true(value, message = '') {
        if (!value) {
            throw new Error(`${message} 预期 true, 得到 ${value}`);
        }
        console.log(`✅ ${message || '测试通过'}`);
    },
    false(value, message = '') {
        if (value) {
            throw new Error(`${message} 预期 false, 得到 ${value}`);
        }
        console.log(`✅ ${message || '测试通过'}`);
    }
};

// 测试邮箱验证
function testEmailValidation() {
    console.log('\n📋 测试邮箱验证...\n');
    
    const auth = new AuthService();
    
    assert.true(auth.validateEmail('test@example.com'), '有效邮箱格式');
    assert.true(auth.validateEmail('user.name@domain.com'), '带点的邮箱');
    assert.true(auth.validateEmail('user+tag@gmail.com'), '带+的邮箱');
    assert.false(auth.validateEmail('invalid'), '无效邮箱 - 无@');
    assert.false(auth.validateEmail('test@'), '无效邮箱 - 无域名');
    assert.false(auth.validateEmail('@example.com'), '无效邮箱 - 无用户名');
    assert.false(auth.validateEmail('test @example.com'), '无效邮箱 - 空格');
}

// 测试登录流程
async function testLoginFlow() {
    console.log('\n📋 测试登录流程...\n');
    
    const auth = new AuthService();
    
    // 测试无效邮箱
    try {
        await auth.login('invalid-email');
        assert.true(false, '应该抛出错误');
    } catch (e) {
        assert.equal(e.message, '请输入有效的邮箱地址', '无效邮箱报错');
    }
    
    // 测试有效邮箱登录
    const user = await auth.login('test@example.com');
    assert.equal(user.email, 'test@example.com', '登录邮箱正确');
    assert.equal(user.username, 'test', '用户名提取正确');
    assert.true(auth.checkLoginStatus(), '登录后状态为已登录');
    assert.true(!!auth.getCurrentUser(), '获取当前用户');
    
    // 测试退出登录
    auth.logout();
    assert.false(auth.checkLoginStatus(), '退出后状态为未登录');
    assert.true(!auth.getCurrentUser(), '退出后无当前用户');
    
    console.log('\n✅ 所有认证测试通过!\n');
}

// 运行测试
console.log('🚀 开始认证模块测试...\n');
testEmailValidation();
testLoginFlow();
