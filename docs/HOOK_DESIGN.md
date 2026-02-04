# OpenCode Command Hook 设计

> **设计时间**: 2026-02-04  
> **目标**: 记录 OpenCode 执行的命令和输出到 COMMAND.md

---

## 🎯 设计目标

1. **自动记录**: OpenCode 执行命令时自动触发
2. **增量更新**: 只记录新内容，不重复
3. **格式清晰**: 便于后续查阅
4. **兼容性好**: 不影响 OpenCode 正常功能

---

## 📝 记录格式

```markdown
# COMMAND.md - OpenCode 命令记录

## 2026-02-04 12:15

### 命令
```bash
ls -la
```

### 目录
/Users/jetyou/.openclaw/workspace/gobang

### 输出
```
total 256
drwxr-xr-x  26 jetyou  staff    832 Feb  4 12:06 .
...
```

---

## 2026-02-04 12:10

### 命令
```bash
git status
```

### 目录
/Users/jetyou/.openclaw/workspace/gobang

### 输出
```
On branch main
Your branch is up to date with 'origin/main'.
```

---

```

---

## 🔧 实现方案

### 步骤 1: 创建记录脚本

```bash
#!/bin/bash

# 文件路径（根据当前目录确定）
if [ -f "COMMAND.md" ]; then
    CMD_FILE="COMMAND.md"
elif [ -f "../COMMAND.md" ]; then
    CMD_FILE="../COMMAND.md"
else
    CMD_FILE="COMMAND.md"
fi

# 获取时间戳
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# 获取命令和参数
COMMAND="$1"
CWD="$2"
OUTPUT="$3"

# 写入记录
cat >> "$CMD_FILE" << EOF

## $TIMESTAMP

### 命令
\`\`\`bash
$COMMAND
\`\`\`

### 目录
$CWD

### 输出
\`\`\`
$OUTPUT
\`\`\`

EOF

echo "已记录到 $CMD_FILE"
```

保存到: `~/.opencode-hooks/record-cmd.sh`

---

### 步骤 2: 配置 OpenCode Hook

在 OpenCode 配置文件中添加：

```jsonc
{
  "hooks": {
    "postCommand": {
      "enabled": true,
      "command": "~/.opencode-hooks/record-cmd.sh '{{.Command}}' '{{.Cwd}}' '{{.Output}}'",
      "silent": true
    }
  }
}
```

或者使用环境变量：

```jsonc
{
  "hooks": {
    "postCommand": {
      "enabled": true,
      "command": "RECORD_CMD=1 ~/.opencode-hooks/record-cmd.sh",
      "silent": true
    }
  }
}
```

---

### 步骤 3: 高级配置（可选）

#### 3.1 只在特定目录记录

```jsonc
{
  "hooks": {
    "postCommand": {
      "enabled": true,
      "command": "~/.opencode-hooks/record-cmd.sh",
      "silent": true,
      "condition": {
        "type": "path",
        "pattern": "**/workspace/**"
      }
    }
  }
}
```

#### 3.2 排除特定命令

```bash
# 在 record-cmd.sh 中添加
if [[ "$COMMAND" =~ ^(cd|ls|pwd|echo)$ ]]; then
    exit 0  # 跳过简单命令
fi
```

#### 3.3 添加分隔符

```bash
# 在文件开头添加
if [ ! -f "$CMD_FILE" ]; then
    cat > "$CMD_FILE" << 'EOF'
# OpenCode 命令记录

> 自动生成，请勿手动编辑

---
EOF
fi
```

---

## 📂 脚本位置

```
~/.opencode-hooks/
├── record-cmd.sh          # 主脚本
└── README.md             # 说明文档（可选）
```

---

## ⚙️ 配置步骤

### 1. 创建脚本目录
```bash
mkdir -p ~/.opencode-hooks
```

### 2. 创建记录脚本
```bash
cat > ~/.opencode-hooks/record-cmd.sh << 'EOF'
#!/bin/bash

# 记录脚本
EOF
chmod +x ~/.opencode-hooks/record-cmd.sh
```

### 3. 编辑 OpenCode 配置
```bash
# 找到 OpenCode 配置文件
# 通常在 ~/.config/opencode/opencode.jsonc

# 添加 hooks 配置
```

### 4. 重启 OpenCode

---

## 🤔 需要讨论的问题

### 1. 记录哪些内容？

| 内容 | 记录？ | 说明 |
|------|--------|------|
| 命令本身 | ✅ | 执行的完整命令 |
| 时间戳 | ✅ | 精确到秒 |
| 工作目录 | ✅ | 便于追踪项目 |
| 命令输出 | ✅ | 便于复现 |
| 错误信息 | ✅ | 便于排查 |

### 2. 输出格式偏好？

**A. 简洁版**
```
## 12:15
ls -la
→ ...
```

**B. 详细版**（当前设计）
```
## 2026-02-04 12:15

### 命令
`ls -la`

### 目录
/path/to/project

### 输出
...
```

### 3. 存储位置？

**A. 项目内** `COMMAND.md`
- 优点：随项目迁移
- 缺点：每个项目都要有

**B. 全局** `~/.opencode-hooks/COMMAND.md`
- 优点：统一管理
- 缺点：需要指定项目

**C. 两者都要**
- 项目内有则记录项目
- 否则记录到全局

### 4. 保留策略？

- 只保留最近 30 天
- 保留所有，但定期归档
- 按项目分文件

---

## 📋 待确认事项

请回复确认：

1. **输出格式**: 简洁版还是详细版？
2. **存储位置**: 项目内、全局、还是两者都要？
3. **保留策略**: 保留多久？是否归档？

确认后我直接生成完整的脚本和配置！
