import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CatalogSchema } from '../src/types/catalog';

/**
 * 目录数据契约与源数据对账门禁 (Parity Gate)
 * 遵循 Codex SOP-2: 在构建期阻断一切破损数据进入生产环境
 */

export function runCatalogParityCheck() {
  const catalogPath = join(process.cwd(), 'data/catalog.json');
  const rawAssetsDir = join(process.cwd(), 'raw-assets');

  console.log('🔍 [Parity Gate] 开始执行 Temu 目录数据对账与强类型契约校验...');

  if (!existsSync(catalogPath)) {
    throw new Error(`🛑 缺失目录数据文件: ${catalogPath}`);
  }

  const rawJson = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  const parseResult = CatalogSchema.safeParse(rawJson);

  if (!parseResult.success) {
    console.error('❌ [Parity Gate] Zod Schema 校验失败:');
    console.error(JSON.stringify(parseResult.error.format(), null, 2));
    throw new Error('🛑 目录数据不符合强类型不变量契约，构建终止！');
  }

  const products = parseResult.data;
  let errorCount = 0;

  for (const p of products) {
    // 价格合理性检查：秒杀促销价不得高于原价
    if (p.promotionalPriceCents > p.basePriceCents) {
      console.error(`❌ [价格异常] SPU: ${p.spuId} 秒杀价 (${p.promotionalPriceCents}) 高于基准价 (${p.basePriceCents})`);
      errorCount++;
    }

    // 检查母版图片是否存在
    const heroDisk = join(rawAssetsDir, `${p.heroImageBaseName}.png`);
    if (!existsSync(heroDisk)) {
      console.error(`❌ [缺失图片] SPU: ${p.spuId} 缺失母版 Hero 图片: ${heroDisk}`);
      errorCount++;
    }

    // 检查画廊图是否存在
    for (const g of p.galleryBaseNames) {
      const gDisk = join(rawAssetsDir, `${g}.png`);
      if (!existsSync(gDisk)) {
        console.error(`❌ [缺失图片] SPU: ${p.spuId} 缺失画廊图片: ${gDisk}`);
        errorCount++;
      }
    }
  }

  if (errorCount > 0) {
    throw new Error(`🛑 目录数据对账未通过，共发现 ${errorCount} 处违规。构建终止！`);
  }

  console.log(`✅ [Parity Gate] 对账 100% 吻合！共校验 ${products.length} 个核心商品，零破损引用。`);
}

// 直接运行
runCatalogParityCheck();
