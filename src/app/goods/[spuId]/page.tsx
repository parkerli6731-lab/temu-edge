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
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.categorySlug}/`} className="hover:underline">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* 首屏主展示区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        {/* 左侧：95% 纯静态图片展示区 (Sharp WebP 响应式渲染) */}
        <section className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
            <ResponsiveCatalogImage
              baseName={product.heroImageBaseName}
              alt={product.title}
              priority={true}
              className="w-full h-full object-cover"
            />
            {product.isFlashSale && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow-md tracking-wider">
                -{discountPct}% FLASH DEAL
              </span>
            )}
            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded">
              📸 Authentic Studio Photography
            </span>
          </div>

          {/* 多视角高清特写缩略图栏 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-temu-darkOrange shadow-sm">
              <ResponsiveCatalogImage
                baseName={product.heroImageBaseName}
                alt={`${product.title} - Front View`}
                className="w-full h-full object-cover"
              />
            </div>
            {product.galleryBaseNames.map((gName, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-temu-darkOrange transition-colors">
                <ResponsiveCatalogImage
                  baseName={gName}
                  alt={`${product.title} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-4 pt-1">
            <span>🔍 100% Authentic Product Shots</span>
            <span>•</span>
            <span>📐 Multi-Angle High Res</span>
          </div>
        </section>

        {/* 右侧：商品详情与微岛屿交互区 */}
        <section className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-orange-100 text-temu-darkOrange text-xs font-bold px-2 py-0.5 rounded">
                Factory Direct OEM
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded">
                ✓ Free Priority Air Express
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                ★ 90-Day Money-Back Guarantee
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100 flex-wrap">
              <span className="text-amber-500 font-bold flex items-center gap-1 text-sm">
                ★ {product.ratingScore}
                <span className="text-gray-400 font-normal text-xs">({product.ratingCount.toLocaleString()} verified ratings)</span>
              </span>
              <span>•</span>
              <span className="text-gray-700 font-semibold">{product.salesCountText}</span>
              <span>•</span>
              <span className="text-temu-darkOrange font-medium">#1 Best Seller in {product.category.split(' (')[0]}</span>
            </div>

            {/* 价格区块 */}
            <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-200/80 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-temu-darkOrange font-mono">
                  ${promoPrice}
                </span>
                <span className="text-sm text-gray-400 line-through font-mono">
                  ${basePrice}
                </span>
                <span className="text-xs font-extrabold bg-red-600 text-white px-2 py-0.5 rounded">
                  SAVE ${( (product.basePriceCents - product.promotionalPriceCents) / 100 ).toFixed(2)} ({discountPct}% OFF)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                <span>🛡️ Lowest Price Guaranteed: Sourced direct from certified factory floor.</span>
              </p>
            </div>

            {/* 微岛屿 1: 闪电促销倒计时 (客户端隔离挂载，零水合报错) */}
            <div className="mb-4">
              <FlashSaleCountdownIsland initialSeconds={7200} />
            </div>

            {/* 微岛屿 2: 动态加购与 SKU 变体选择器 */}
            <div className="mb-6">
              <AddToCartIsland
                spuId={product.spuId}
                skuId={product.skuId}
                title={product.title}
                promotionalPriceCents={product.promotionalPriceCents}
                currency={product.currency}
                stockCount={product.stockCount}
                heroImageBaseName={product.heroImageBaseName}
                skuVariants={product.skuVariants}
              />
            </div>

            {/* 核心规格属性表 (首屏速览) */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Quick Specifications Summary
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <dt className="text-gray-500 text-[11px]">{s.label}</dt>
                    <dd className="font-bold text-gray-800 truncate mt-0.5">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 信任徽标 */}
          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600">
            <div className="bg-slate-50 py-2 rounded-lg">🛡️ 90-Day Free Return</div>
            <div className="bg-slate-50 py-2 rounded-lg">⚡ Instant Delay Refund</div>
            <div className="bg-slate-50 py-2 rounded-lg">🔒 256-Bit SSL Checkout</div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          二屏深度详情区：产品核心卖点、详尽长描述、10+项技术规格表、包装清单与买家评测
         ========================================================================= */}
      <div className="space-y-8">
        {/* 1. 核心核心卖点 (Highlights) */}
        {product.highlights && product.highlights.length > 0 && (
          <section className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 p-6 rounded-2xl border border-amber-200/60 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-temu-darkOrange text-xl">⭐</span> Product Highlights & Key Advantages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-white/80 rounded-xl border border-amber-100 text-xs text-gray-800 leading-relaxed font-medium">
                  <span className="text-emerald-600 font-bold shrink-0">✔</span>
                  <span>{highlight.replace(/^✦\s*/, '')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. 深度图文描述 (Long Description) */}
        {product.longDescription && (
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>📖</span> Detailed Product Description & Engineering
            </h2>
            <div className="prose max-w-none text-gray-700 text-sm leading-relaxed space-y-4">
              {product.longDescription.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-base font-bold text-gray-900 pt-3 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-temu-darkOrange rounded-full inline-block"></span>
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={pIdx} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. 完整技术规格参数矩阵表 (10+ Granular Specifications) */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 flex-wrap gap-2">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span>⚙️</span> Complete Technical Specifications Matrix
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
              100% Factory Verified Specifications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-1/3 border-b border-gray-200">Specification Attribute</th>
                  <th className="py-3 px-4 w-2/3 border-b border-gray-200">Detailed Value / Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
                {(product.detailedSpecs || product.specs).map((spec, sIdx) => (
                  <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-white hover:bg-orange-50/30' : 'bg-gray-50/60 hover:bg-orange-50/30'}>
                    <td className="py-3 px-4 font-semibold text-gray-900 font-sans">{spec.label}</td>
                    <td className="py-3 px-4 text-gray-800">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. 包装配件清单 (Package Contents) */}
        {product.packageContents && product.packageContents.length > 0 && (
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>📦</span> Package Contents & Unboxing Checklist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {product.packageContents.map((pkgItem, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-gray-800">
                  <span className="text-lg">🎁</span>
                  <span>{pkgItem}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. 真实买家评价 (Verified Customer Reviews) */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span>💬</span> Verified Customer Reviews
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Over {product.ratingCount.toLocaleString()} verified buyers with a {product.ratingScore} out of 5.0 satisfaction score
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-500">★ {product.ratingScore}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  98.4% Recommended
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((rev, rIdx) => (
                <div key={rIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">{rev.author}</span>
                    <span className="text-gray-400 text-[11px]">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-500 font-bold">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      ✓ Verified Purchase
                    </span>
                    <span className="text-gray-500 text-[11px]">{rev.country}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. 常见问答 (FAQ) */}
        {product.faqs && product.faqs.length > 0 && (
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>❓</span> Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-3">
              {product.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span className="bg-temu-darkOrange text-white text-[10px] font-black w-4 h-4 rounded-full inline-flex items-center justify-center">Q</span>
                    {faq.question}
                  </h4>
                  <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. 全球品质与售后保障协议 */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1.5">
              <div className="text-2xl">🏭</div>
              <h4 className="text-sm font-bold">100% Factory Direct</h4>
              <p className="text-xs text-slate-300">
                Straight from ISO 9001 certified OEM assembly lines with zero retail intermediary markup.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-2xl">✈️</div>
              <h4 className="text-sm font-bold">Fast Air Express</h4>
              <p className="text-xs text-slate-300">
                Dispatched within 24 hours with full milestone tracking. Free shipping on all orders.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-2xl">🛡️</div>
              <h4 className="text-sm font-bold">90-Day Money-Back</h4>
              <p className="text-xs text-slate-300">
                If anything is not completely to your satisfaction, return with prepaid postage for an instant refund.
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
