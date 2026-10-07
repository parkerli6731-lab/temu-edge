import { z } from 'zod';

/**
 * Temu Edge Catalog - 核心不变量与只读类型契约 (Box with Invariants)
 * 遵循 Codex / Tibo Sottiaux 架构规范：
 * 1. 价格恒为整数（Cents），彻底隔离浮点误差
 * 2. 字段只读强约束，确保构建期 Single Source of Truth
 */

export interface ProductSpec {
  readonly label: string;
  readonly value: string;
}

export interface SkuVariant {
  readonly skuId: string;
  readonly name: string;
  readonly priceCents: number;
  readonly originalPriceCents: number;
  readonly stock: number;
  readonly attributes: Record<string, string>; // e.g. { Color: "Black", Size: "M" }
}

export interface CustomerReview {
  readonly author: string;
  readonly rating: number;
  readonly date: string;
  readonly verified: boolean;
  readonly country: string;
  readonly comment: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface ProductItem {
  readonly spuId: string;
  readonly skuId: string;
  readonly title: string;
  readonly category: string;
  readonly categorySlug: string;
  readonly summary: string;
  readonly longDescription?: string;
  readonly highlights?: readonly string[];
  readonly basePriceCents: number;       // 原价/基准价 (分)
  readonly promotionalPriceCents: number; // 促销秒杀价 (分)
  readonly currency: 'USD' | 'EUR' | 'CAD' | 'GBP';
  readonly stockCount: number;
  readonly salesCountText: string;       // e.g. "100k+ sold"
  readonly ratingScore: number;          // e.g. 4.8
  readonly ratingCount: number;
  readonly heroImageBaseName: string;    // 母版图基准文件名 (构建期对应 Sharp WebP 阶梯)
  readonly galleryBaseNames: readonly string[];
  readonly specs: readonly ProductSpec[];
  readonly detailedSpecs?: readonly ProductSpec[];
  readonly packageContents?: readonly string[];
  readonly reviews?: readonly CustomerReview[];
  readonly faqs?: readonly FaqItem[];
  readonly tags: readonly string[];
  readonly isFlashSale: boolean;
  readonly updatedAt: string;
  readonly skuVariants?: readonly SkuVariant[];
}

export interface CategoryItem {
  readonly slug: string;
  readonly name: string;
  readonly heroImageBaseName: string;
  readonly description: string;
  readonly productCount: number;
  readonly skuCount?: number;
}

export const SkuVariantSchema = z.object({
  skuId: z.string().min(1),
  name: z.string().min(1),
  priceCents: z.number().int().positive(),
  originalPriceCents: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  attributes: z.record(z.string()),
});

export const CustomerReviewSchema = z.object({
  author: z.string().min(1),
  rating: z.number().min(1).max(5),
  date: z.string(),
  verified: z.boolean(),
  country: z.string(),
  comment: z.string().min(1),
});

export const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

// Zod 运行时 Schema 校验门禁 (Parity Gate)
export const ProductSchema = z.object({
  spuId: z.string().min(1),
  skuId: z.string().min(1),
  title: z.string().min(3),
  category: z.string().min(1),
  categorySlug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(5),
  longDescription: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  basePriceCents: z.number().int().positive(),
  promotionalPriceCents: z.number().int().positive(),
  currency: z.enum(['USD', 'EUR', 'CAD', 'GBP']),
  stockCount: z.number().int().nonnegative(),
  salesCountText: z.string(),
  ratingScore: z.number().min(0).max(5),
  ratingCount: z.number().int().nonnegative(),
  heroImageBaseName: z.string().min(1),
  galleryBaseNames: z.array(z.string()),
  specs: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  detailedSpecs: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  packageContents: z.array(z.string()).optional(),
  reviews: z.array(CustomerReviewSchema).optional(),
  faqs: z.array(FaqItemSchema).optional(),
  tags: z.array(z.string()),
  isFlashSale: z.boolean(),
  updatedAt: z.string(),
  skuVariants: z.array(SkuVariantSchema).optional(),
});

export const CatalogSchema = z.array(ProductSchema);
