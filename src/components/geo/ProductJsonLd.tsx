import React from 'react';
import { ProductItem } from '@/types/catalog';

export const ProductJsonLd: React.FC<{ product: ProductItem }> = ({ product }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.summary,
    sku: product.skuId,
    mpn: product.spuId,
    image: [
      `https://temu-edge.pages.dev/images/catalog/${product.heroImageBaseName}-640w.webp`,
    ],
    brand: {
      '@type': 'Brand',
      name: 'Temu Direct Factory',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.ratingScore.toString(),
      reviewCount: product.ratingCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.promotionalPriceCents / 100).toFixed(2),
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stockCount > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://temu-edge.pages.dev/goods/${product.spuId}/`,
      seller: {
        '@type': 'Organization',
        name: 'Temu Global Marketplace',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 90,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    additionalProperty: product.specs.map((s) => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
