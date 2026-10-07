#!/usr/bin/env bash
# Claude Code SOP-6 & Boris Cherny Multi-Agent Matrix: Git Worktree Dispatcher
# Usage: ./scripts/spawn-worktree-agent.sh <branch-name> <session-name>

set -euo pipefail

BRANCH_NAME="${1:-}"
SESSION_NAME="${2:-agent-session}"

if [ -z "$BRANCH_NAME" ]; then
  echo "❌ 错误: 请指定分支名称"
  echo "用法: ./scripts/spawn-worktree-agent.sh <branch-name> [session-name]"
  exit 1
fi

TARGET_DIR="../temu-worktree-${BRANCH_NAME//\//-}"

echo "🚀 [Agent 并发矩阵] 正在创建隔离的 Git 工作树: ${TARGET_DIR}"

if [ -d "$TARGET_DIR" ]; then
  echo "⚠️ 目标目录已存在，跳过创建工作树"
else
  git worktree add "$TARGET_DIR" -b "$BRANCH_NAME"
fi

echo "📦 正在软链接 node_modules 避免重复下载开销..."
if [ ! -d "$TARGET_DIR/node_modules" ]; then
  ln -s "$(pwd)/node_modules" "$TARGET_DIR/node_modules"
fi

echo "✅ 隔离工作树就绪！"
echo "👉 可直接在 tmux 中拉起独立智能体会话: cd ${TARGET_DIR} && agy"
