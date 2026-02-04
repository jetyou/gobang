# 项目文件结构说明

> **整理时间**: 2026-02-04  
> **版本**: v2.1

---

## 📁 目录结构

```
gobang/
├── 📦 core/              # 核心代码（必选）
├── 📄 docs/              # 项目文档（必读）
├── 📝 logs/              # 过程记录（参考）
├── 🧪 tests/             # 测试文件（可选）
├── 💾 backups/           # 备份文件（可选）
└── root files            # 根目录文件
```

---

## 📦 Core Code (核心代码) ⭐⭐⭐⭐⭐

**说明**: 项目运行的必要文件

| 文件 | 类型 | 说明 |
|------|------|------|
| `index.html` | HTML | 主页面，包含棋盘和UI |
| `game.js` | JavaScript | 核心游戏逻辑（当前版本v2.1） |
| `style.css` | CSS | 样式文件 |

**说明**: 这3个文件可以直接运行游戏

---

## 📄 Documentation (项目文档) ⭐⭐⭐⭐

**说明**: 记录项目成果和设计

| 文件 | 说明 |
|------|------|
| `README.md` | 项目说明、快速开始、功能特性 |
| `DEVELOPMENT_LOG.md` | 开发日志，记录各版本变更 |
| `PROJECT_PLAN.md` | 开发计划，初始规划 |
| `REQUIREMENTS_v2.md` | v2.0需求文档，新增功能说明 |

---

## 📝 Process Logs (过程记录) ⭐⭐⭐

**说明**: 记录开发过程中的分析和命令

| 文件 | 说明 |
|------|------|
| `opencode_command.md` | **重要！** 记录所有与OpenCode的15次交互 |
| `DEV_COMMANDS.md` | 开发过程中用到的所有命令速查 |
| `DEBUG_LOG.md` | v2.0 Bug排查和修复记录 |

**推荐**: 如果要排查问题或学习开发过程，查看这些文件

---

## 🧪 Tests (测试文件)

**说明**: 验证代码正确性的测试

| 文件 | 说明 |
|------|------|
| `test.js` | 原始单元测试 |
| `test_win.js` | 胜负判定专项测试 |
| `test_v2.js` | v2.0功能测试 |
| `test_bugfix.js` | Bug修复验证测试 |

---

## 💾 Backups (备份文件)

**说明**: 保留的历史版本

| 文件 | 说明 |
|------|------|
| `game_v2.js` | v2.0代码备份 |
| `style_v2.css` | v2.0样式备份 |

---

## 📊 文件分类汇总

```
核心代码 (3个)
├── index.html
├── game.js
└── style.css

项目文档 (4个)
├── README.md
├── DEVELOPMENT_LOG.md
├── PROJECT_PLAN.md
└── REQUIREMENTS_v2.md

过程记录 (3个)
├── opencode_command.md ⭐ 重点
├── DEV_COMMANDS.md
└── DEBUG_LOG.md

测试文件 (4个)
├── test.js
├── test_win.js
├── test_v2.js
└── test_bugfix.js

备份文件 (2个)
├── game_v2.js
└── style_v2.css
```

---

## 🎯 使用建议

### 新手快速上手
```
1. README.md          → 了解项目
2. index.html         → 运行游戏
```

### 排查问题
```
1. DEVELOPMENT_LOG.md → 查看历史
2. DEBUG_LOG.md       → 查找Bug记录
3. opencode_command.md → 还原交互过程
```

### 学习开发过程
```
1. opencode_command.md → 按时间线查看所有交互
2. DEV_COMMANDS.md     → 学习命令用法
```

### 重现开发环境
```
1. DEV_COMMANDS.md     → 按命令列表操作
2. opencode_command.md → 参考具体交互
```

---

## 📈 文件数量统计

| 分类 | 数量 | 总占比 |
|------|------|--------|
| 核心代码 | 3 | 20% |
| 项目文档 | 4 | 27% |
| 过程记录 | 3 | 20% |
| 测试文件 | 4 | 27% |
| 备份 | 2 | 13% |
| **总计** | **16** | **100%** |

---

## 🗑️ 清理建议

以下文件可以删除（如果不需要历史版本）：

```
backups/ 目录
├── game_v2.js
└── style_v2.css
```

**注意**: `opencode_command.md` 建议保留，这是完整的开发过程记录

---

*整理时间: 2026-02-04*
*版本: 1.0*
