/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 强制关闭运行时图像优化服务，符合 Cloudflare Pages 静态边缘规范
  },
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
