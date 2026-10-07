import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('【Codex 不变量 1】目录数据契约与价格整数一致性', () => {
  const catalogPath = path.resolve('data/catalog.json');
  assert.ok(fs.existsSync(catalogPath), 'catalog.json 必须存在');

  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  assert.ok(products.length > 0, '目录中至少存在 1 个商品');

  for (const p of products) {
    // 价格不变量验证
    assert.ok(Number.isInteger(p.basePriceCents), `SPU: ${p.spuId} basePriceCents 必须为整数`);
    assert.ok(Number.isInteger(p.promotionalPriceCents), `SPU: ${p.spuId} promotionalPriceCents 必须为整数`);
    assert.ok(p.promotionalPriceCents > 0, `SPU: ${p.spuId} 价格必须大于 0`);
    assert.ok(
      p.promotionalPriceCents <= p.basePriceCents,
      `SPU: ${p.spuId} 促销价不得高于基准价`
    );
  }
});

test('【Temu 全矩阵验证】18 一级品类与 1,800 SKU 完整性核验', () => {
  const catalogPath = path.resolve('data/catalog.json');
  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

  const categories = new Set(products.map((p) => p.categorySlug));
  assert.equal(categories.size, 18, '必须包含严格的 18 个一级品类');

  let totalSkus = 0;
  const categorySkus = new Map();

  for (const p of products) {
    const skuCount = p.skuVariants ? p.skuVariants.length : 1;
    totalSkus += skuCount;
    categorySkus.set(p.categorySlug, (categorySkus.get(p.categorySlug) || 0) + skuCount);
  }

  assert.equal(totalSkus, 1800, '必须包含精准的 1,800 个全量 SKU 资产');

  for (const [cat, count] of categorySkus.entries()) {
    assert.equal(count, 100, `品类 [${cat}] 必须精准包含 100 个 SKU，实际: ${count}`);
  }
});

test('【Cloudflare 不变量 2】零成本构建期媒体管线产物验证', () => {
  const manifestPath = path.resolve('public/images/optimized/image-manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'image-manifest.json 必须存在');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const catalog = JSON.parse(fs.readFileSync('data/catalog.json', 'utf-8'));

  for (const p of catalog) {
    const heroAsset = manifest[p.heroImageBaseName];
    assert.ok(heroAsset, `母版图 ${p.heroImageBaseName} 必须存在于 manifest 中`);
    assert.ok(heroAsset.versions.length >= 3, `母版图 ${p.heroImageBaseName} 必须包含至少 3 档响应式阶梯`);
    assert.ok(heroAsset.blurDataURL.startsWith('data:image/webp;base64,'), '必须包含微型 WebP 模糊占位图');

    // 验证物理 WebP 文件在磁盘上切实存在
    for (const v of heroAsset.versions) {
      const diskPath = path.resolve(v.path.replace(/^\//, 'public/'));
      assert.ok(fs.existsSync(diskPath), `物理 WebP 文件必须存在: ${diskPath}`);
    }
  }
});
