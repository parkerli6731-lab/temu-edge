import React from 'react';
import Link from 'next/link';
import { getAllProducts, getAllCategories } from '@/lib/catalog';
import { ResponsiveCatalogImage } from '@/components/media/ResponsiveCatalogImage';
import { FlashSaleCountdownIsland } from '@/components/islands/FlashSaleCountdownIsland';

export default function HomePage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* 顶部主推横幅与闪电促销通知 */}
      <section className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-temu-darkOrange via-temu-orange to-yellow-500 p-6 md:p-10 text-white shadow-xl relative">
        <div className="max-w-2xl relative z-10">
          <span className="inline-block bg-black/40 text-yellow-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            FACTORY DIRECT SUPER SALE
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Shop Like a Billionaire. <br />
            <span className="text-yellow-200">Zero Cloud Latency.</span>
          </h1>
          <p className="text-sm md:text-base opacity-95 mb-6">
            100% Edge-rendered catalog deployed to Cloudflare 330+ Anycast PoPs worldwide. 
            Sub-30ms TTFB with zero-bill Sharp WebP image pipelines.
          </p>
          <div className="max-w-md">
            <FlashSaleCountdownIsland initialSeconds={9420} />
          </div>
        </div>
        <div className="absolute right-4 bottom-4 md:right-12 md:bottom-8 opacity-20 md:opacity-30 text-8xl md:text-9xl font-black select-none pointer-events-none">
          90% OFF
        </div>
      </section>

      {/* 分类胶囊导航 (Category Pills) */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>🏷️</span> Popular Categories
        </h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/"
            className="px-4 py-2 rounded-full text-xs font-bold bg-temu-dark text-white shadow-sm flex-shrink-0"
          >
            All Deals ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}/`}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-gray-700 hover:bg-orange-50 hover:text-temu-darkOrange border border-gray-200 shadow-sm flex-shrink-0 transition-colors"
            >
              {cat.name} ({cat.productCount})
            </Link>
          ))}
        </div>
      </section>

      {/* 闪电促销商品瀑布流卡片 (Lightning Deals Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>🔥</span> Lightning Flash Deals
          </h2>
          <span className="text-xs text-temu-darkOrange font-bold">Updated Just Now • 330+ Nodes Synced</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p, idx) => {
            const promoPrice = (p.promotionalPriceCents / 100).toFixed(2);
            const basePrice = (p.basePriceCents / 100).toFixed(2);
            const discountPct = Math.round(
              ((p.basePriceCents - p.promotionalPriceCents) / p.basePriceCents) * 100
            );

            return (
              <article
                key={p.spuId}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                <Link href={`/goods/${p.spuId}/`} className="block relative aspect-square">
                  <ResponsiveCatalogImage
                    baseName={p.heroImageBaseName}
                    alt={p.title}
                    priority={idx < 2}
                    className="w-full h-full"
                  />
                  {p.isFlashSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      -{discountPct}%
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs font-medium">
                    {p.salesCountText}
                  </span>
                </Link>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/goods/${p.spuId}/`}
                      className="text-xs font-medium text-gray-800 line-clamp-2 hover:text-temu-orange transition-colors"
                    >
                      {p.title}
                    </Link>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">
                      <span>★</span>
                      <span className="font-bold text-gray-700">{p.ratingScore}</span>
                      <span className="text-gray-400">({p.ratingCount.toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-temu-darkOrange font-mono">
                        ${promoPrice}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through ml-1.5 font-mono">
                        ${basePrice}
                      </span>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-temu-darkOrange px-1.5 py-0.5 rounded font-bold">
                      Direct
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
