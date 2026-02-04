# OpenCode Command Hook

> 自动记录 OpenCode 执行的命令和输出到 COMMAND.md

## 📦 安装

```bash
# 克隆或下载此项目
cd /path/to/opencode-hook

# 运行安装脚本
chmod +x install-hook.sh
./install-hook.sh
```

安装脚本会自动：
1. 创建配置目录 `~/.opencode-hooks/`
2. 安装记录脚本和归档脚本
3. 配置 OpenCode Hook
4. 创建示例 COMMAND.md

---

## 📝 使用方法

安装后，OpenCode 执行的命令会自动记录到项目的 `COMMAND.md` 文件。

### 记录格式

```markdown
# OpenCode 命令记录

> 自动生成，记录 OpenCode 执行的命令和输出
> 格式: 详细版
> 存储: 随项目迁移

---

## 2026-02-04 12:15

### 命令
```bash
ls -la
```

### 目录
`/Users/jetyou/project`

### 输出
```
total 256
...
```

---

```

### 查看记录

```bash
cat COMMAND.md
# 或使用编辑器打开
```

---

## 🔧 配置

### 跳过简单命令

默认跳过以下简单命令：
- `cd`
- `pwd`
- `echo`
- `ls`
- `cat`
- `head`
- `tail`
- `grep`

在 `record-cmd.sh` 中修改 `commandBlacklist` 调整。

### 归档策略

当 `COMMAND.md` 超过 10000 行时，自动归档。

手动归档：

```bash
# 执行归档
~/.opencode-hooks/archive-cmd.sh archive

# 只清理旧归档
~/.opencode-hooks/archive-cmd.sh cleanup

# 查看统计
~/.opencode-hooks/archive-cmd.sh stats
```

设置定时任务（每月1号归档）：

```bash
crontab -e

# 添加
0 0 1 * * ~/.opencode-hooks/archive-cmd.sh archive
```

---

## 📁 文件结构

```
~/.opencode-hooks/
├── record-cmd.sh      # 记录脚本（主脚本）
├── archive-cmd.sh     # 归档脚本
├── hook-config.json   # Hook 配置模板
├── record.log         # 记录日志
└── archive/           # 归档目录
    └── COMMAND_YYYY-MM.md
```

---

## ⚙️ 自定义

### 修改跳过规则

编辑 `record-cmd.sh`:

```bash
commandBlacklist=(
    "^cd "
    "^pwd$"
    "^echo "
    "^ls$"
)
```

### 修改归档阈值

```bash
MAX_LINES=10000  # 改为 20000 或其他值
```

---

## 🗑️ 卸载

```bash
# 删除配置目录
rm -rf ~/.opencode-hooks

# 删除项目内的 COMMAND.md（可选）
rm COMMAND.md
```

---

## 📄 许可证

MIT
