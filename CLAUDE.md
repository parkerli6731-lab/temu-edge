# Temu.com Headless Catalog Edge Deployment (Developer Guidelines)
# System Hierarchy: Codex Invariants (Tibo) + Claude Code Ergonomics (Boris) + Cloudflare SOP

## 1. 核心架构不变量 (Non-Negotiable Invariants)
1. **纯静态导出 (SSG Export)**：全站必须无缝编译为静态 HTML/JS/CSS，配置 `output: 'export'`。禁止在静态主页面中使用任何 Node.js 运行时动态 API。
2. **微岛屿水合隔离 (Micro-Islands)**：全站 95% 页面为纯静态 RSC。任何包含动态倒计时、购物车变更、转盘抽奖的组件必须置于 `src/components/islands/` 并声明 `'use client'`，阻断 React #418/#423 水合崩溃。
3. **媒体管线零账单**：严禁在生产环境向外部动态图床传递动态参数。所有商品图必须由 `scripts/optimize-images.mjs` 在构建期通过 Sharp 生成 384w/640w/1024w WebP 阶梯。
4. **价格不变量**：所有金额在数据契约与组件间必须以整数（Cents/分）传递，禁止使用浮点数进行货币折算。
5. **Harness 治理原则**：严禁编写超过 1000 行的临时胶水代码绕过框架限制。

## 2. 常用工程命令
- **全链路流水线**: `npm run pipeline:full` (对账 -> 媒体转码 -> 自动化测试 -> Next.js 静态编译)
- **源数据对账门禁**: `npm run verify:parity`
- **媒体编译管线**: `npm run images:optimize`
- **本地开发测试**: `npm run dev`
- **自动化测试**: `npm run test`
- **静态导出构建**: `npm run build`
- **多 Agent 并发派发**: `./scripts/spawn-worktree-agent.sh <branch-name>`

## 3. 提交与 PR 规范 (Codex Intent-First)
- 提交信息必须遵守三段式：
  1. `Intent`: 本次修改解决什么具体商业或架构问题？
  2. `Invariants`: 是否破坏了只读数据模型或引起了水合泄露？
  3. `Implementation`: 自动化测试与契约对账验证结果。
