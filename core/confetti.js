/**
 * 五子棋撒花动画模块
 * 在游戏获胜时播放庆祝动画
 */

class ConfettiAnimation {
    constructor() {
        this.colors = [
            '#f44336', '#e91e63', '#9c27b0', '#673ab7',
            '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
            '#009688', '#4caf50', '#8bc34a', '#cddc39',
            '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
        ];
        this.shapes = ['circle', 'square', 'triangle'];
        this.isPlaying = false;
        this.timer = null;
        this.particles = [];
        this.particleCount = 100;
        this.duration = 3000;
    }

    /**
     * 创建单个撒花碎片
     */
    createParticle() {
        const particle = document.createElement('div');
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        const size = Math.random() * 10 + 5;
        const x = Math.random() * 100;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 2;
        const duration = Math.random() * 2 + 2;

        particle.className = 'confetti-particle';
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            left: ${x}vw;
            top: -20px;
            border-radius: ${shape === 'circle' ? '50%' : '0'};
            transform: rotate(${rotation}deg);
            opacity: 1;
            animation: confetti-fall ${duration}s linear forwards;
            animation-delay: -${delay}s;
            z-index: 9999;
            pointer-events: none;
        `;

        return particle;
    }

    /**
     * 创建所有碎片
     */
    createAllParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        return this.particles;
    }

    /**
     * 启动撒花动画
     */
    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        // 将动画样式注入到页面
        this.injectStyles();

        // 创建碎片
        const particles = this.createAllParticles();

        // 添加到页面
        particles.forEach(particle => {
            document.body.appendChild(particle);
        });

        // 定时添加新碎片
        this.timer = setInterval(() => {
            if (this.particles.length < 200) {
                const particle = this.createParticle();
                document.body.appendChild(particle);
                this.particles.push(particle);
            }
        }, 100);

        // 自动停止
        setTimeout(() => {
            this.stop();
        }, this.duration);
    }

    /**
     * 注入CSS动画样式
     */
    injectStyles() {
        if (document.getElementById('confetti-styles')) return;

        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
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

            .confetti-particle {
                will-change: transform, opacity;
            }

            .winner-overlay {
                z-index: 10000;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 停止并清理动画
     */
    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        // 清除定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // 移除所有碎片
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }

    /**
     * 播放简短庆祝动画（快速撒花后停止）
     */
    quickBurst() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        this.injectStyles();

        // 快速添加一批碎片
        const count = 50;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = this.createParticle();
                document.body.appendChild(particle);
                this.particles.push(particle);
            }, i * 30);
        }

        // 2秒后清理
        setTimeout(() => {
            this.stop();
        }, 2000);
    }

    /**
     * 检查是否正在播放
     */
    getIsPlaying() {
        return this.isPlaying;
    }
}

// 创建全局实例
let confettiAnimation;

function getConfettiAnimation() {
    if (!confettiAnimation) {
        confettiAnimation = new ConfettiAnimation();
    }
    return confettiAnimation;
}

// 如果是模块环境，导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfettiAnimation;
}
