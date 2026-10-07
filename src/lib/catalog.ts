import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ProductItem, CategoryItem, ProductSchema } from '@/types/catalog';

/**
 * 目录数据读取服务 (Build-Time SSOT)
 */

export function getAllProducts(): readonly ProductItem[] {
  const filePath = join(process.cwd(), 'data/catalog.json');
  const content = readFileSync(filePath, 'utf-8');
  const rawList = JSON.parse(content);
  return rawList.map((item: unknown) => ProductSchema.parse(item));
}

export function getProductBySpuId(spuId: string): ProductItem | undefined {
  const all = getAllProducts();
  return all.find((p) => p.spuId === spuId);
}

export function getAllCategories(): readonly CategoryItem[] {
  const all = getAllProducts();
  const map = new Map<string, { name: string; count: number; hero: string; desc: string }>();

  for (const p of all) {
    const existing = map.get(p.categorySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(p.categorySlug, {
        name: p.category,
        count: 1,
        hero: p.heroImageBaseName,
        desc: `High quality ${p.category} at factory direct prices.`,
      });
    }
  }

  return Array.from(map.entries()).map(([slug, meta]) => ({
    slug,
    name: meta.name,
    heroImageBaseName: meta.hero,
    description: meta.desc,
    productCount: meta.count,
  }));
}

export function getProductsByCategory(categorySlug: string): readonly ProductItem[] {
  return getAllProducts().filter((p) => p.categorySlug === categorySlug);
}
