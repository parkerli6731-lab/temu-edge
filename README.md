# ⚡ Temu Edge Catalog (temu.com 边缘化迁移落地工程)

> **工业级无头目录解耦、边缘静态生成与全球极速调度实战**  
> 融合 **Codex Invariants (Tibo Sottiaux)** + **Claude Code Concurrency (Boris Cherny)** + **Cloudflare Headless Catalog SOP** 三大工程体系。

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20Anycast-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/efd7ba849c27d36e3982242b6b10a988/workers-and-pages)
[![Next.js 14 SSG](https://img.shields.io/badge/Next.js-14%20SSG%20Export-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Readonly%20Invariants-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sharp WebP](https://img.shields.io/badge/Sharp-Zero--Bill%20LANCZOS-99CC00?style=for-the-badge)](https://sharp.pixelplumbing.com/)

---

## 🌟 核心架构价值与指标 (Core Value)

- ⚡ **全球超低延迟 (Sub-30ms TTFB)**：全站 100% 静态预编译 HTML 直出，免除中心化数据库连接池排队与 SSR 冷启动。
- 🛡️ **微岛屿水合物理隔离 (Micro-Islands)**：95% 页面为纯静态 RSC；倒计时、加购计数器、优惠券转盘隔离为独立客户端微岛屿，**React #418/#423 水合崩溃率 0%**。
- 💰 **运行期媒体 $0 账单 (Zero-Bill Media Pipeline)**：构建期 Sharp LANCZOS 降采样转阶梯 WebP，配合 Cloudflare 边缘 `immutable` 强缓存，彻底终结动态图床账单刺客。
- 🔍 **生成式引擎优化 (GEO Ready)**：全量内嵌 Schema.org `Product` / `Offer` JSON-LD 结构化图谱，精准放行 `GPTBot`、`PerplexityBot`，成为 AI 搜索首选引用源。
- 🔒 **金融级价格不变量**：金额恒以整数（Cents/分）存储与传递，彻底杜绝浮点数精度漂移。

---

## 🌐 网站页面入口与路由拓扑

| 页面形态 | 路由 | 说明 |
| :--- | :--- | :--- |
| 🏠 **全站首页** | `/` | 闪电大促瀑布流、分类胶囊与品牌横幅 |
| ⚡ **降噪耳机 PDP** | `/goods/temu-1001/` | 78% 折扣、秒杀倒计时微岛屿、加购计算器 |
| ⌚ **三防手表 PDP** | `/goods/temu-1002/` | 响应式多尺寸画廊、多档物理规格 |
| 🥤 **便携果汁机 PDP** | `/goods/temu-1003/` | 高赞买家评价、食品级参数对照表 |
| 🛏️ **慢回弹记忆枕 PDP** | `/goods/temu-1004/` | 人体工学脊椎支撑、透气网布说明 |
| ☀️ **太阳能庭院灯 PDP** | `/goods/temu-1005/` | 270° 广角照明、IP65 防泼溅规格 |
| 🏷️ **影音数码 PLP** | `/category/electronics/` | 影音数码分类聚合专区 |
| 🏷️ **智能穿戴 PLP** | `/category/smart-gadgets/` | 智能穿戴分类聚合专区 |
| 🏷️ **家居厨具 PLP** | `/category/home-kitchen/` | 家居厨具分类聚合专区 |
| 🏷️ **庭院家居 PLP** | `/category/home-garden/` | 庭院家居分类聚合专区 |

---

## 🚀 快速启动与本地预览

```bash
# 1. 克隆仓库与安装依赖
git clone https://github.com/parkerli6731-lab/temu-edge.git
cd temu-edge
npm install

# 2. 运行端到端全量门禁流水线 (对账 -> 图片优化 -> 测试 -> 静态编译)
npm run pipeline:full

# 3. 启动本地 Cloudflare Anycast 边缘模拟服务器
npm run preview
# 浏览器访问: http://localhost:3000/
```

---

## ☁️ Cloudflare Pages 云端部署操作指南

本工程已完成静态编译输出至 `out/` 目录，完全支持 Cloudflare Pages：

### 方式 1：Cloudflare Dashboard Git 关联部署 (最推荐)
1. 登录 Cloudflare 控制台：[Workers & Pages 控制台](https://dash.cloudflare.com/efd7ba849c27d36e3982242b6b10a988/workers-and-pages)
2. 点击 **Create application** -> **Pages** -> **Connect to Git**
3. 选择仓库：`parkerli6731-lab/temu-edge`，分支：`main`
4. 构建参数填写：
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variables**: `NODE_VERSION` = `20`
5. 点击 **Save and Deploy**，即可获得全球 Anycast 分布式域名。

### 方式 2：Wrangler CLI 本地直接部署
```bash
# 登录 Cloudflare
npx wrangler login

# 一键直传部署静态产物
npx wrangler pages deploy out --project-name=temu-edge
```

---

## 🛠️ 多智能体并发矩阵 (Claude Code SOP-6)

```bash
# 一键派发物理隔离的 Git 工作树分支并软链接依赖
./scripts/spawn-worktree-agent.sh feat/new-feature
cd ../temu-worktree-feat-new-feature
```

---

## 📄 许可与贡献
本项目遵循 MIT 协议。基于 AI-Native Engineering 范式开发。
