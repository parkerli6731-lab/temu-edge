import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const STATIC_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // 模拟 Cloudflare Pages 静态路由规则
  let filePath = path.join(STATIC_DIR, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
    filePath = `${filePath}.html`;
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // 模拟 Cloudflare _headers 边缘缓存策略
    if (pathname.startsWith('/images/optimized/') || pathname.startsWith('/images/catalog/') || pathname.startsWith('/_next/static/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (ext === '.html') {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Edge-Simulator', 'Cloudflare Pages Local Anycast Simulator');
    res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    // 404 回退
    const notFoundPath = path.join(STATIC_DIR, '404.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.writeHead(404);
    if (fs.existsSync(notFoundPath)) {
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.end('<h1>404 Not Found - Temu Edge Catalog</h1>');
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`================================================================`);
  console.log(`🚀 [Cloudflare Edge Anycast 本地模拟预览服务器已启动]`);
  console.log(`🔗 网站首页入口:       http://localhost:${PORT}/`);
  console.log(`⚡ 闪电促销商品详情页:   http://localhost:${PORT}/goods/temu-1001/`);
  console.log(`⌚ 智能穿戴详情页:     http://localhost:${PORT}/goods/temu-1002/`);
  console.log(`🥤 便携榨汁机详情页:   http://localhost:${PORT}/goods/temu-1003/`);
  console.log(`🏷️ 数码分类列表页:     http://localhost:${PORT}/category/electronics/`);
  console.log(`🏷️ 家居厨具分类页:     http://localhost:${PORT}/category/home-kitchen/`);
  console.log(`================================================================`);
});
