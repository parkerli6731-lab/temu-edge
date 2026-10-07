import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('【Cloudflare 不变量 3】微岛屿架构与客户端水合物理隔离检查', () => {
  const islandsDir = path.resolve('src/components/islands');
  assert.ok(fs.existsSync(islandsDir), 'islands 目录必须存在');

  const files = fs.readdirSync(islandsDir);
  assert.ok(files.length >= 3, '至少包含 3 个微岛屿组件');

  for (const f of files) {
    if (!f.endsWith('.tsx')) continue;
    const content = fs.readFileSync(path.join(islandsDir, f), 'utf-8');
    assert.ok(
      content.includes("'use client'") || content.includes('"use client"'),
      `微岛屿组件 ${f} 必须明确声明 'use client' 边界指令`
    );
  }
});

test('【Cloudflare 不变量 4】Next.js 静态导出与边缘配置核验', () => {
  const nextConfigContent = fs.readFileSync(path.resolve('next.config.js'), 'utf-8');
  assert.ok(nextConfigContent.includes("output: 'export'"), 'next.config.js 必须开启 output: export');
  assert.ok(nextConfigContent.includes('unoptimized: true'), 'next.config.js 必须关闭运行时图片转码 unoptimized: true');

  const headersContent = fs.readFileSync(path.resolve('public/_headers'), 'utf-8');
  assert.ok(headersContent.includes('immutable'), 'public/_headers 必须配置 immutable 永久缓存规则');

  const robotsContent = fs.readFileSync(path.resolve('public/robots.txt'), 'utf-8');
  assert.ok(robotsContent.includes('GPTBot') && robotsContent.includes('PerplexityBot'), 'robots.txt 必须显式放行顶级 AI 爬虫');
});
