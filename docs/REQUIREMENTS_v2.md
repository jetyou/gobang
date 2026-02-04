# 五子棋游戏 - 需求更新

> **更新日期**: 2026-02-04  
> **版本**: 2.0

---

## 一、原始需求 (v1.0)

- [x] 15x15 棋盘
- [x] 黑白棋轮流下棋
- [x] 胜负判定（连五子获胜）
- [x] 重新开始功能
- [x] 悔棋功能

---

## 二、新增需求 (v2.0)

### 2.1 胜利弹窗改进

- [ ] 显示胜利者（黑棋/白棋）
- [ ] 显示用了多少步获胜
- [ ] 提供两个选项：
  - "再来一局" - 重新开局
  - "结束游戏" - 关闭弹窗，保留当前棋局

### 2.2 战绩记录

- [ ] 记录黑棋获胜次数
- [ ] 记录白棋获胜次数
- [ ] 显示当前比分（黑:白）
- [ ] 在游戏区域显示比分

### 2.3 UI 改进

- [ ] 在游戏信息区域显示比分
- [ ] 弹窗显示步数和比分
- [ ] 战绩持久化（可选：使用 localStorage）

---

## 三、功能详情

### 3.1 胜利弹窗

```html
<div class="winner-overlay">
    <div class="winner-message">
        <h2>🎉 黑棋 获胜！ 🎉</h2>
        <p>共用 <strong>23</strong> 步</p>
        <p>当前比分: 黑棋 3 : 2 白棋</p>
        <div class="winner-actions">
            <button class="btn" onclick="game.restart()">再来一局</button>
            <button class="btn btn-secondary" onclick="game.closePopup()">结束游戏</button>
        </div>
    </div>
</div>
```

### 3.2 比分显示

```html
<div class="score-board">
    <div class="score black-score">
        <span class="piece">●</span>
        <span class="count">3</span>
    </div>
    <div class="vs">VS</div>
    <div class="score white-score">
        <span class="piece">○</span>
        <span class="count">2</span>
    </div>
</div>
```

### 3.3 数据结构

```javascript
class GobangGame {
    constructor() {
        // ... 现有属性
        
        // 新增：战绩统计
        this.stats = {
            blackWins: 0,
            whiteWins: 0,
            totalGames: 0
        };
        
        // 新增：当前步数
        this.currentStep = 0;
    }
}
```

---

## 四、开发计划

### 阶段 1: 需求分析
- [x] 更新需求文档
- [x] 确定功能细节

### 阶段 2: 代码修改
- [ ] 修改 game.js
  - 添加步数统计
  - 添加战绩统计
  - 修改胜利弹窗
  - 添加结束游戏选项
- [ ] 修改 style.css
  - 添加比分显示样式
  - 改进弹窗样式

### 阶段 3: 测试验证
- [ ] 测试胜利弹窗
- [ ] 测试比分记录
- [ ] 测试重新开局
- [ ] 测试结束游戏

### 阶段 4: 文档更新
- [ ] 更新开发日志
- [ ] 记录 OpenCode 交互
- [ ] 更新测试用例

---

## 五、验收标准

1. ✅ 五子连成后正确显示胜利弹窗
2. ✅ 弹窗显示用了多少步
3. ✅ 弹窗提供"再来一局"和"结束游戏"选项
4. ✅ 比分正确记录和显示
5. ✅ 战绩在游戏过程中保持

---

## 六、优先级

| 功能 | 优先级 | 状态 |
|------|--------|------|
| 胜利弹窗显示步数 | P0 | 待开发 |
| 弹窗显示比分 | P0 | 待开发 |
| 弹窗提供两个选项 | P0 | 待开发 |
| 比分记录和显示 | P0 | 待开发 |
| 战绩持久化 | P2 | 可选 |

---

*创建时间: 2026-02-04 11:15*
*版本: 2.0*
