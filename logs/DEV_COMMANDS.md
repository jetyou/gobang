# 五子棋项目开发命令手册

> **项目**: 网页五子棋 (Gobang)  
> **开发时间**: 2026-02-04  
> **开发工具**: Oh My OpenCode + Superpowers + Anthropic Skills

---

## 📋 目录

1. [环境准备](#环境准备)
2. [工具安装](#工具安装)
3. [项目初始化](#项目初始化)
4. [Git 版本控制](#git-版本控制)
5. [测试验证](#测试验证)
6. [部署运行](#部署运行)
7. [GitHub 发布](#github-发布)

---

## 1️⃣ 环境准备

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 Git 版本
git --version
```

---

## 2️⃣ 工具安装

### Oh My OpenCode

```bash
# 全局安装
npm install -g oh-my-opencode@latest

# 验证安装
oh-my-opencode --version

# 安装到 OpenCode
oh-my-opencode install
```

### Superpowers（OpenCode 版本）

```bash
# 克隆仓库
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers

# 创建目录和符号链接
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js \
      ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/skills \
      ~/.config/opencode/skills/superpowers
```

### Anthropic 官方 Skills

```bash
# 克隆官方 Skills
git clone https://github.com/anthropics/skills ~/.config/opencode/anthropics-skills

# 复制 Skills
cp -r ~/.config/opencode/anthropics-skills/skills/* \
      ~/.config/opencode/skills/anthropics/
```

---

## 3️⃣ 项目初始化

```bash
# 创建项目目录
mkdir -p /Users/jetyou/.openclaw/workspace/gobang
cd /Users/jetyou/.openclaw/workspace/gobang

# 创建项目文档
cat > CLAUDE.md << 'EOF'
# 五子棋项目

## 项目概述
开发一个网页版五子棋游戏，支持双人对战。

## 技术栈
- 前端：HTML5 + CSS3 + JavaScript (原生)
- 无需后端，纯前端实现
EOF
```

---

## 4️⃣ Git 版本控制

```bash
# 初始化 Git
git init

# 配置用户信息
git config user.name "Your Name"
git config user.email "your@email.com"

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 网页五子棋游戏"

# 查看状态
git status

# 查看日志
git log --oneline -3
```

---

## 5️⃣ 测试验证

```bash
# 列出所有文件
find . -type f ! -path './.git/*' ! -name '.gitignore' | sort

# 统计文件数量
find . -type f ! -path './.git/*' ! -name '.gitignore' | wc -l
```

---

## 6️⃣ 部署运行

### 启动本地服务器

```bash
# 启动服务器
cd /Users/jetyou/.openclaw/workspace/gobang
npx serve -l 3000

# 后台运行
npx serve -l 3000 &
```

### 直接打开文件

```bash
# macOS
open index.html
```

---

## 7️⃣ GitHub 发布

### 创建仓库并推送

```bash
# 1. 创建 Personal Access Token
# 访问: https://github.com/settings/tokens
# 勾选: repo, delete_repo

# 2. 运行创建脚本
chmod +x create-github-repo.sh
./create-github-repo.sh "YOUR_TOKEN_HERE"

# 3. 或手动推送
git remote add origin "https://github.com/jetyou/gobang.git"
git push -u origin main
```

### 验证推送

```bash
# 检查仓库文件
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/jetyou/gobang/contents

# 或访问网页
# https://github.com/jetyou/gobang
```

---

## 📚 常用命令速查表

### Git 操作

| 操作 | 命令 |
|------|------|
| 初始化仓库 | `git init` |
| 添加文件 | `git add .` |
| 提交 | `git commit -m "message"` |
| 查看状态 | `git status` |
| 推送 | `git push origin main` |

### 文件操作

| 操作 | 命令 |
|------|------|
| 创建文件 | `cat > filename << 'EOF'...EOF` |
| 创建目录 | `mkdir -p path/to/dir` |
| 复制文件 | `cp source dest` |

### 开发工具

| 操作 | 命令 |
|------|------|
| 安装 npm 包 | `npm install -g package` |
| 启动服务器 | `npx serve -l port` |

---

## 🔧 故障排除

### Git 提交时用户信息缺失

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 权限被拒绝

```bash
git remote set-url origin "https://TOKEN@github.com/username/repo.git"
```

---

## 📖 相关资源

| 资源 | 链接 |
|------|------|
| Oh My OpenCode | https://github.com/code-yeongyu/oh-my-opencode |
| Superpowers | https://github.com/obra/superpowers |
| Anthropic Skills | https://github.com/anthropics/skills |
| 项目仓库 | https://github.com/jetyou/gobang |

---

*文档创建时间: 2026-02-04*
