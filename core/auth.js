/**
 * 用户认证模块 - 模拟登录功能
 */

class AuthService {
    constructor() {
        this.STORAGE_KEY = 'gobang_auth';
        this.loadState();
    }

    // 从本地存储加载状态
    loadState() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const state = JSON.parse(stored);
                this.user = state.user || null;
                this.isLoggedIn = state.isLoggedIn || false;
                this.loginTime = state.loginTime || null;
            }
        } catch (e) {
            console.warn('无法加载登录状态:', e);
            this.user = null;
            this.isLoggedIn = false;
        }
    }

    // 保存状态到本地存储
    saveState() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                user: this.user,
                isLoggedIn: this.isLoggedIn,
                loginTime: this.loginTime
            }));
        } catch (e) {
            console.warn('无法保存登录状态:', e);
        }
    }

    // 验证邮箱格式
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 模拟登录
    login(email) {
        return new Promise((resolve, reject) => {
            // 模拟网络延迟
            setTimeout(() => {
                // 验证邮箱
                if (!this.validateEmail(email)) {
                    reject(new Error('请输入有效的邮箱地址'));
                    return;
                }

                // 模拟登录成功
                const user = {
                    email: email,
                    username: email.split('@')[0],
                    avatar: this.generateAvatar(email),
                    loginTime: new Date().toISOString()
                };

                this.user = user;
                this.isLoggedIn = true;
                this.loginTime = user.loginTime;
                this.saveState();

                // 触发登录成功事件 (仅浏览器环境)
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:login', { detail: user }));
                }

                resolve(user);
            }, 800); // 模拟800ms网络延迟
        });
    }

    // 退出登录
    logout() {
        const previousUser = this.user;
        
        this.user = null;
        this.isLoggedIn = false;
        this.loginTime = null;
        this.saveState();

        // 触发退出登录事件 (仅浏览器环境)
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout', { detail: previousUser }));
        }

        return true;
    }

    // 获取当前用户
    getCurrentUser() {
        return this.user;
    }

    // 检查是否已登录
    checkLoginStatus() {
        return this.isLoggedIn;
    }

    // 生成用户头像（基于邮箱的哈希颜色）
    generateAvatar(email) {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIndex = Math.abs(hash) % colors.length;
        return colors[colorIndex];
    }
}

// 导出单例
const authService = new AuthService();

// Node.js 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
    module.exports.AuthService = AuthService;
    module.exports.authService = authService;
}
