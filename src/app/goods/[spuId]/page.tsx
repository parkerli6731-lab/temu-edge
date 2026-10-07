import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts, getProductBySpuId } from '@/lib/catalog';
import { ResponsiveCatalogImage } from '@/components/media/ResponsiveCatalogImage';
import { AddToCartIsland } from '@/components/islands/AddToCartIsland';
import { FlashSaleCountdownIsland } from '@/components/islands/FlashSaleCountdownIsland';
import { ProductJsonLd } from '@/components/geo/ProductJsonLd';

interface PageProps {
  params: {
    spuId: string;
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    spuId: p.spuId,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductBySpuId(params.spuId);
  if (!product) return {};

  const promoPrice = (product.promotionalPriceCents / 100).toFixed(2);
  return {
    title: `${product.title} - $${promoPrice} | Temu Edge Deals`,
    description: product.summary,
    alternates: {
      canonical: `https://temu-edge.pages.dev/goods/${product.spuId}/`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySpuId(params.spuId);
  if (!product) notFound();

  const promoPrice = (product.promotionalPriceCents / 100).toFixed(2);
  const basePrice = (product.basePriceCents / 100).toFixed(2);
  const discountPct = Math.round(
    ((product.basePriceCents - product.promotionalPriceCents) / product.basePriceCents) * 100
  );

  return (
    <article className="max-w-7xl mx-auto px-4 py-6">
      {/* 嵌入 GEO Schema.org 结构化图谱 */}
      <ProductJsonLd product={product} />

      {/* 面包屑导航 */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.categorySlug}/`} className="hover:underline">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* 左侧：95% 纯静态图片展示区 (Sharp WebP 响应式渲染) */}
        <section className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <ResponsiveCatalogImage
              baseName={product.heroImageBaseName}
              alt={product.title}
              priority={true}
              className="w-full h-full"
            />
            {product.isFlashSale && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow-md">
                -{discountPct}% OFF
              </span>
            )}
          </div>

          {/* 缩略图栏 */}
          <div className="grid grid-cols-3 gap-3">
            {product.galleryBaseNames.map((gName, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <ResponsiveCatalogImage
                  baseName={gName}
                  alt={`${product.title} view ${i + 1}`}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 右侧：商品详情与微岛屿交互区 */}
        <section className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-100 text-temu-darkOrange text-xs font-bold px-2 py-0.5 rounded">
                Factory Direct
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                ✓ Free Shipping On All Orders
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
              <span className="text-amber-500 font-bold flex items-center gap-1">
                ★ {product.ratingScore}
                <span className="text-gray-400 font-normal">({product.ratingCount.toLocaleString()} reviews)</span>
              </span>
              <span>•</span>
              <span className="text-gray-700 font-medium">{product.salesCountText}</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">Top Rated in {product.category}</span>
            </div>

            {/* 价格区块 */}
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-temu-darkOrange font-mono">
                  ${promoPrice}
                </span>
                <span className="text-sm text-gray-400 line-through font-mono">
                  ${basePrice}
                </span>
                <span className="text-xs font-extrabold bg-red-600 text-white px-2 py-0.5 rounded">
                  SAVE ${( (product.basePriceCents - product.promotionalPriceCents) / 100 ).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Prices guaranteed for 30 days. Import duties & taxes included.
              </p>
            </div>

            {/* 微岛屿 1: 闪电促销倒计时 (客户端隔离挂载，零水合报错) */}
            <div className="mb-4">
              <FlashSaleCountdownIsland initialSeconds={7200} />
            </div>

            {/* 微岛屿 2: 动态加购与数量计算器 */}
            <div className="mb-6">
              <AddToCartIsland
                skuId={product.skuId}
                promotionalPriceCents={product.promotionalPriceCents}
                currency={product.currency}
                stockCount={product.stockCount}
              />
            </div>

            {/* 核心规格属性表 */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Product Specifications</h3>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded">
                    <dt className="text-gray-500">{s.label}</dt>
                    <dd className="font-semibold text-gray-800">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 信任徽标 */}
          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-500">
            <div>🛡️ 90-Day Free Return</div>
            <div>⚡ Fast Refund If Delayed</div>
            <div>🔒 Secure Payment</div>
          </div>
        </section>
      </div>
    </article>
  );
}
