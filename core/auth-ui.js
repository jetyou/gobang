/**
 * 认证界面管理器 - 模态框版本
 */

class AuthUI {
    constructor(authService) {
        this.auth = authService;
        this.modalId = 'auth-modal-overlay';
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // 监听认证状态变化
        window.addEventListener('auth:login', () => this.onLoginSuccess());
        window.addEventListener('auth:logout', () => this.render());
    }

    // 创建模态框遮罩层
    createModal() {
        if (document.getElementById(this.modalId)) return;

        const overlay = document.createElement('div');
        overlay.id = this.modalId;
        overlay.className = 'auth-modal-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    // 移除模态框
    removeModal() {
        const overlay = document.getElementById(this.modalId);
        if (overlay) {
            overlay.remove();
        }
    }

    render() {
        if (this.auth.checkLoginStatus()) {
            // 已登录
            this.removeModal();
            this.renderLoggedInView();
        } else {
            // 未登录，显示模态框
            this.createModal();
            this.renderLoginView();
        }
    }

    renderLoginView() {
        const overlay = document.getElementById(this.modalId);
        if (!overlay) return;

        overlay.innerHTML = `
            <div class="auth-modal">
                <div class="auth-view login-view">
                    <div class="auth-header">
                        <div class="auth-logo">🍵</div>
                        <h2>欢迎回来</h2>
                        <p>登录五子棋，开始游戏</p>
                    </div>
                    
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="email-input">邮箱地址</label>
                            <input 
                                type="email" 
                                id="email-input" 
                                placeholder="请输入您的邮箱"
                                required
                                autocomplete="email"
                            >
                        </div>
                        
                        <button type="submit" class="auth-btn" id="login-btn">
                            <span class="btn-text">立即登录</span>
                            <span class="btn-loading" style="display: none;">
                                <span class="spinner"></span>
                                登录中...
                            </span>
                        </button>
                        
                        <p class="auth-hint">
                            💡 演示说明：输入任意有效邮箱即可登录
                        </p>
                    </form>
                </div>
            </div>
        `;

        // 绑定表单事件
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email-input');
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!email) {
                this.showError('请输入邮箱地址');
                return;
            }

            // 显示加载状态
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';

            try {
                await this.auth.login(email);
            } catch (error) {
                this.showError(error.message);
                loginBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });

        // 自动聚焦输入框
        setTimeout(() => emailInput.focus(), 100);
    }

    renderLoggedInView() {
        const authContainer = document.getElementById('auth-container');
        if (!authContainer) return;

        const user = this.auth.getCurrentUser();
        const loginTime = new Date(user.loginTime).toLocaleString('zh-CN');

        authContainer.innerHTML = `
            <div class="auth-view logged-in-view">
                <div class="user-info">
                    <div class="user-avatar" style="background: ${user.avatar}">
                        ${user.username.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-details">
                        <div class="user-name">${user.username}</div>
                        <div class="user-email">${user.email}</div>
                        <div class="login-time">登录于 ${loginTime}</div>
                    </div>
                </div>
                
                <button class="auth-btn logout-btn" id="logout-btn">
                    🚪 退出登录
                </button>
            </div>
        `;

        // 绑定退出事件
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.auth.logout();
        });
    }

    onLoginSuccess() {
        // 登录成功，关闭模态框
        this.removeModal();
        // 重新渲染登录状态视图
        this.renderLoggedInView();
        // 通知游戏模块
        window.dispatchEvent(new CustomEvent('game:authStateChange', { 
            detail: { isLoggedIn: true } 
        }));
    }

    showError(message) {
        const modal = document.querySelector('.auth-modal');
        if (!modal) return;

        // 移除旧的错误提示
        const existingError = modal.querySelector('.auth-error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        
        const form = modal.querySelector('.auth-form') || modal.querySelector('.auth-view');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthUI;
}
