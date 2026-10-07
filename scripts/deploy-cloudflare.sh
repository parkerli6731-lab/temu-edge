#!/usr/bin/env bash
# Cloudflare Pages 直传部署脚本 (Cloudflare SOP-5)
set -euo pipefail

echo "=========================================================="
echo "🚀 [Cloudflare Pages] 启动 Temu 边缘化全量发布流水线..."
echo "=========================================================="

# 1. 运行完整门禁
echo "🔍 步骤 1/3: 运行全量契约对账与静态导出门禁..."
npm run pipeline:full

# 2. 检查 wrangler 登录状态或提示
echo "☁️ 步骤 2/3: 准备发布至 Cloudflare Pages (Account ID: efd7ba849c27d36e3982242b6b10a988)..."

# 3. 直传部署
echo "📦 步骤 3/3: 上传静态编译产物 (out/)..."
npx wrangler pages deploy out --project-name=temu-edge

echo "=========================================================="
echo "🎉 部署完成！请访问 Cloudflare 分配的全局 Anycast 域名。"
echo "=========================================================="
