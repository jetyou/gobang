#!/bin/bash
#
# OpenCode Hook 安装脚本
#
# 功能:
# - 安装命令记录脚本
# - 配置 OpenCode Hook
# - 创建示例 COMMAND.md
#

set -e

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 OpenCode Hook 安装脚本${NC}"
echo ""

# 配置目录
HOOK_DIR="${HOME}/.opencode-hooks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 步骤 1: 创建目录
echo -e "${YELLOW}步骤 1: 创建配置目录...${NC}"
mkdir -p "$HOOK_DIR"
chmod 700 "$HOOK_DIR"
echo "✓ 创建目录: $HOOK_DIR"

# 步骤 2: 复制脚本
echo ""
echo -e "${YELLOW}步骤 2: 安装脚本...${NC}"
cp "${SCRIPT_DIR}/record-cmd.sh" "$HOOK_DIR/"
cp "${SCRIPT_DIR}/archive-cmd.sh" "$HOOK_DIR/"
chmod +x "$HOOK_DIR"/*.sh
echo "✓ 安装脚本"

# 步骤 3: 查找 OpenCode 配置文件
echo ""
echo -e "${YELLOW}步骤 3: 配置 OpenCode Hook...${NC}"

# 可能的配置文件位置
CONFIG_FILES=(
    "${HOME}/.config/opencode/opencode.jsonc"
    "${HOME}/.config/opencode/opencode.json"
    "${HOME}/.opencode/config.jsonc"
    "${HOME}/.opencode/config.json"
)

CONFIG_FILE=""
for cf in "${CONFIG_FILES[@]}"; do
    if [ -f "$cf" ]; then
        CONFIG_FILE="$cf"
        break
    fi
done

if [ -z "$CONFIG_FILE" ]; then
    # 尝试创建默认配置
    CONFIG_FILE="${HOME}/.config/opencode/opencode.jsonc"
    mkdir -p "$(dirname "$CONFIG_FILE")"
    echo "{}" > "$CONFIG_FILE"
fi

echo "✓ 配置文件: $CONFIG_FILE"

# 步骤 4: 更新配置
echo ""
echo -e "${YELLOW}步骤 4: 更新配置...${NC}"

# 读取现有配置
EXISTING=$(cat "$CONFIG_FILE" 2>/dev/null || echo "{}")

# 合并配置
cat > "$CONFIG_FILE" << EOF
{
  "hooks": {
    "postCommand": {
      "enabled": true,
      "command": "$HOOK_DIR/record-cmd.sh '{{.Command}}' '{{.Cwd}}' '{{.Output}}'",
      "silent": true,
      "timeout": 30
    }
  }
}
EOF

echo "✓ 已更新 Hook 配置"

# 步骤 5: 创建示例
echo ""
echo -e "${YELLOW}步骤 5: 创建示例 COMMAND.md...${NC}"

# 在当前目录创建示例
if [ -f "COMMAND.md" ]; then
    echo "✓ COMMAND.md 已存在"
else
    cat > "COMMAND.md" << 'EOF'
# OpenCode 命令记录

> 自动生成，记录 OpenCode 执行的命令和输出
> 格式: 详细版
> 存储: 随项目迁移

---
EOF
    echo "✓ 已创建示例 COMMAND.md"
fi

# 完成
echo ""
echo -e "${GREEN}✅ 安装完成！${NC}"
echo ""
echo "📝 下一步:"
echo "   1. 重启 OpenCode"
echo "   2. 执行一些命令测试"
echo "   3. 查看 COMMAND.md 确认记录"
echo ""
echo "📁 文件位置:"
echo "   脚本: $HOOK_DIR/"
echo "   归档: $HOOK_DIR/archive/"
echo "   日志: $HOOK_DIR/record.log"
echo ""
echo "🔧 归档命令（每月运行一次）:"
echo "   $HOOK_DIR/archive-cmd.sh archive"
