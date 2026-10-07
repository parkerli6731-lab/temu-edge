import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, getProductsByCategory } from '@/lib/catalog';
import { ResponsiveCatalogImage } from '@/components/media/ResponsiveCatalogImage';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categories = getAllCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return {};

  return {
    title: `${category.name} Factory Deals - Up to 90% Off | Temu Edge`,
    description: category.description,
    alternates: {
      canonical: `https://temu-edge.pages.dev/category/${category.slug}/`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const categories = getAllCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(params.slug);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* 分类头部标牌 */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{category.name}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">{category.name}</h1>
          <p className="text-xs text-gray-600 mt-1">{category.description}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-orange-100 text-temu-darkOrange text-xs font-bold px-3 py-1.5 rounded-full">
            {products.length} Products Found
          </span>
        </div>
      </div>

      {/* 商品网格 */}
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
    </main>
  );
}
