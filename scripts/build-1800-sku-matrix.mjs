import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { CATEGORIES } from './categories-data.mjs';

const RAW_DIR = path.resolve('raw-assets');
const DATA_DIR = path.resolve('data');
const CATALOG_IMG_DIR = path.resolve('public/images/catalog');

// 变体修饰词字典 (生成 10 款各有特色的真实爆款 SKU 商品)
const VARIANT_MODIFIERS = [
  { prefix: 'Classic Pro Edition', suffix: 'Standard', priceFactor: 1.0, color: 'Obsidian Black', discount: 65 },
  { prefix: 'Upgraded Ergonomic', suffix: 'Plus', priceFactor: 1.15, color: 'Pure Glacier White', discount: 68 },
  { prefix: 'Cooling Breathable', suffix: 'Ice Edition', priceFactor: 1.25, color: 'Sky Frost Blue', discount: 62 },
  { prefix: 'Heavy Duty Reinforced', suffix: 'Max', priceFactor: 1.35, color: 'Space Gunmetal Gray', discount: 70 },
  { prefix: '2-Pack Value Bundle', suffix: 'Twin Pack', priceFactor: 1.85, color: 'Dual Tone Charcoal', discount: 74 },
  { prefix: 'Ultra Compact Portable', suffix: 'Travel Edition', priceFactor: 0.95, color: 'Emerald Forest Green', discount: 60 },
  { prefix: 'Deluxe Gift Box Set', suffix: 'Premium Kit', priceFactor: 1.5, color: 'Rose Champagne Gold', discount: 66 },
  { prefix: 'Family Multi-Pack (3-Pack)', suffix: 'Family Saver', priceFactor: 2.45, color: 'Multi-Color Assorted', discount: 76 },
  { prefix: 'Eco-Friendly Bio-Based', suffix: 'Eco Edition', priceFactor: 1.1, color: 'Natural Earth Sand', discount: 64 },
  { prefix: 'Smart Generation 2', suffix: 'Ultra Pro', priceFactor: 1.4, color: 'Matte Deep Navy', discount: 71 },
];

function generateDetailedSpecs(item, cat, mIdx) {
  const catNameClean = cat.name.split(' (')[0];
  const mod = VARIANT_MODIFIERS[mIdx];
  return [
    { label: 'Item Model & SKU Code', value: `TM-${cat.slug.toUpperCase().slice(0, 4)}-${item.id}-${mIdx + 1}` },
    { label: 'Product Edition / Variant', value: `${mod.prefix} (${mod.color})` },
    { label: 'Material & Construction', value: getMaterialForCategory(cat.slug, item.name, mIdx) },
    { label: 'Dimensions & Form Factor', value: getDimensions(cat.slug, mIdx) },
    { label: 'Net Weight / Volume', value: getWeight(cat.slug, mIdx) },
    { label: 'Quality & Safety Standard', value: 'ISO 9001 / CE / RoHS / FCC / LFGB / REACH Certified' },
    { label: 'Color & Surface Finish', value: `${mod.color} • Anti-Fingerprint UV Matte Coating` },
    { label: 'Operating / Performance Spec', value: getPerformanceSpec(cat.slug, mIdx) },
    { label: 'Maintenance & Care', value: getCareInstructions(cat.slug) },
    { label: 'Packaging Type', value: 'Drop-Tested Shockproof Molded Recyclable Kraft Box' },
    { label: 'Country / Factory of Origin', value: `Direct OEM Tier-1 Manufacturing Facility (${catNameClean})` },
    { label: 'Warranty & Guarantee', value: '90-Day Free Return & Replacement + 365-Day Quality Guarantee' },
    { label: 'Global Logistics Tier', value: 'Air Express Tracked Free Shipping (3-5 Business Days Door-to-Door)' },
  ];
}

function getMaterialForCategory(slug, name, mIdx) {
  if (slug.includes('kitchen')) return 'Food-Grade SUS304 Stainless Steel & BPA-Free Certified Silicone';
  if (slug.includes('clothing')) return '95% Combed Organic Cotton + 5% High-Elasticity Spandex (400GSM)';
  if (slug.includes('electronics')) return 'Aerospace Anodized Aluminum Alloy & Flame-Retardant ABS-PC V0';
  if (slug.includes('shoes-bags')) return 'High-Density 900D Waterproof Cordura & Orthopedic Memory Foam Cushion';
  if (slug.includes('beauty')) return 'Dermatologist-Approved Clinical Formula / Medical-Grade Silicone';
  if (slug.includes('toys')) return 'Non-Toxic Eco-Friendly ABS Plastic (EN71 & ASTM F963 Compliant)';
  if (slug.includes('tools')) return 'Drop-Forged Chrome Vanadium Steel (CR-V) & Tungsten Carbide';
  if (slug.includes('jewelry')) return '925 Sterling Silver with 18K Real Gold Electroplating (Nickel-Free)';
  if (slug.includes('pet')) return 'Food-Grade Antibacterial PP + 304 Stainless Steel (Bite-Resistant)';
  if (slug.includes('sports')) return '7075 Aerospace Aluminum & 210T Ripstop Tear-Resistant Nylon';
  if (slug.includes('appliances')) return 'Heat-Resistant Engineering Thermoplastic & Pure Copper Motor';
  return 'Premium Industrial Grade Materials with Anti-Corrosion Treatment';
}

function getDimensions(slug, mIdx) {
  const variations = [
    'Standard Universal Fit (32.5 x 24.0 x 14.5 cm / 12.8 x 9.4 x 5.7 in)',
    'Compact Travel Size (28.0 x 18.5 x 8.0 cm / 11.0 x 7.3 x 3.1 in)',
    'Large High-Capacity (45.0 x 30.0 x 20.0 cm / 17.7 x 11.8 x 7.9 in)',
    'Ultra-Slim Profile (14.2 x 7.1 x 1.2 cm / 5.6 x 2.8 x 0.5 in)',
    'Ergonomic Multi-Tier (55.0 x 38.0 x 25.0 cm / 21.6 x 15.0 x 9.8 in)',
  ];
  return variations[mIdx % variations.length];
}

function getWeight(slug, mIdx) {
  const weights = [
    '450g ± 15g (15.8 oz) Ultralight Portable',
    '850g ± 25g (1.87 lbs) Balanced Standard',
    '1,250g ± 40g (2.75 lbs) Heavy-Duty Stable',
    '280g ± 10g (9.8 oz) Featherweight Minimalist',
    '2,100g ± 50g (4.6 lbs) Industrial Solid',
  ];
  return weights[mIdx % weights.length];
}

function getPerformanceSpec(slug, mIdx) {
  if (slug.includes('electronics')) return 'Bluetooth 5.3 Low-Latency / 40,000Hz Frequency / 65W PD Fast Charge';
  if (slug.includes('appliances')) return '110-240V Dual Voltage 50/60Hz / 1200W Rapid Thermal Heating Element';
  if (slug.includes('tools')) return 'Max Torque 45N.m / 2-Speed Gearbox 0-450 / 0-1500 RPM / 20V Battery';
  if (slug.includes('kitchen')) return 'Thermal Tolerance -40°C to 240°C (-40°F to 464°F) / Dishwasher Safe';
  if (slug.includes('sports')) return 'Waterproof Hydrostatic Head 3,000mm PU / UV50+ Sun Protection';
  if (slug.includes('beauty')) return '40,000 Micro-Vibrations Per Minute / IPX7 Full Body Waterproofing';
  return 'High Efficiency Grade A+ Operational Rating (Continuous 10,000+ Cycle Tested)';
}

function getCareInstructions(slug) {
  if (slug.includes('clothing')) return 'Machine Wash Cold (30°C / 86°F), Tumble Dry Low, Do Not Bleach';
  if (slug.includes('kitchen')) return 'Dishwasher Safe top-rack; Clean with mild non-abrasive detergent';
  if (slug.includes('electronics') || slug.includes('appliances')) return 'Unplug before wiping with dry soft microfiber cloth; Avoid liquids';
  if (slug.includes('shoes-bags')) return 'Spot clean with mild damp cloth; Air dry naturally away from direct sun';
  return 'Wipe clean with soft damp cloth; Store in a dry, ventilated environment';
}

function generateHighlights(item, cat, mod) {
  return [
    `✦ Direct Factory Sourcing: Bypasses brand markups for authentic tier-1 manufacturing quality (${mod.prefix})`,
    `✦ Certified Quality Standards: Full ISO 9001, CE, and RoHS international certification`,
    `✦ Ergonomic & User-Centric Design: Tested through 10,000+ hours of customer stress testing`,
    `✦ Zero-Risk Guarantee: 90-day free returns with prepaid shipping and full refund protection`,
    `✦ Rapid Door-to-Door Delivery: Priority air express logistics with full real-time milestone tracking`,
  ];
}

function generateLongDescription(item, cat, mod) {
  const catNameClean = cat.name.split(' (')[0];
  return `### Premium Factory-Direct Engineering (${mod.prefix})
Experience unmatched craftsmanship and industrial reliability with the ${mod.prefix} ${item.title}. Engineered specifically for modern consumers who demand durability without paying retail brand premiums, this product is manufactured under strict ISO 9001 international quality control standards. Every unit undergoes rigorous stress testing to guarantee dependable performance from day one.

### Uncompromising Quality & Materials
Constructed using high-grade, sustainable materials carefully selected for safety, longevity, and environmental responsibility, this item delivers superior texture and everyday resilience in ${mod.color}. Sourced directly from certified OEM facilities specializing in ${catNameClean}, you enjoy the exact same high-precision manufacturing tolerances typically found in luxury department store goods at a fraction of the cost.

### Designed for Seamless Daily Use
Whether you are using it at home, in the workplace, or on the move, ergonomic ergonomics and thoughtful human-centered design ensure a seamless, effortless experience. Easy to maintain, beautifully packaged, and backed by our comprehensive 90-day money-back guarantee, this item represents the gold standard of direct-to-consumer value on Temu Edge.`;
}

function generatePackageContents(item, mod) {
  const words = item.title.split(' ');
  const shortTitle = words.slice(0, 4).join(' ');
  return [
    `1x ${mod.prefix} ${shortTitle} (Main Factory Sealed Unit in ${mod.color})`,
    `1x Custom Protective Accessory & Component Kit`,
    `1x Illustrated Multi-Language User Manual (EN/ES/FR/DE)`,
    `1x Eco-Friendly Protective Carrying / Storage Bag`,
    `1x Certificate of Factory Quality Inspection & Authenticity Card`,
  ];
}

function generateCustomerReviews(item, mIdx) {
  const reviewers = [
    { name: 'Sarah Jenkins', country: '🇺🇸 United States', text: 'Absolutely blown away by the quality! Arrived in just 4 days in pristine factory packaging. Exactly as pictured, sturdy and high-end feel. 10/10 recommendation!' },
    { name: 'Marcus Lindqvist', country: '🇸🇪 Sweden', text: 'You can immediately tell this comes from the same factory that supplies major retail brands. Flawless finish and works like a charm. Very impressive value.' },
    { name: 'Elena Rostova', country: '🇩🇪 Germany', text: 'Super fast delivery to Frankfurt. Build quality is solid and packaging was completely undamaged. Good instructions included.' },
    { name: 'David Chen', country: '🇨🇦 Canada', text: 'Half the price of Amazon with identical, if not better, durability. The variant selector made it easy to get the exact color I wanted. Will buy again!' },
  ];
  return reviewers.map((r, i) => ({
    author: r.name,
    rating: i === 2 ? 4 : 5,
    date: `2026-09-${28 - i * 5}`,
    verified: true,
    country: r.country,
    comment: r.text,
  }));
}

function generateFaqs() {
  return [
    {
      question: 'How long does shipping take and is full tracking provided?',
      answer: 'All orders are dispatched from our priority air express fulfillment hubs within 24 hours of checkout. Full end-to-end milestone tracking is provided, with standard delivery arriving at your doorstep in 3 to 5 business days.',
    },
    {
      question: 'What is the return policy if the product does not fit my needs?',
      answer: 'We provide a 100% Risk-Free 90-Day Return Guarantee. If you are not completely satisfied for any reason, you can request a prepaid return shipping label and receive an instant full refund once scanned.',
    },
    {
      question: 'Are the materials non-toxic and compliant with international standards?',
      answer: 'Yes! All materials are rigorously tested and certified by independent laboratories for ISO 9001, CE, FCC, RoHS, and food-grade LFGB/FDA standards where applicable. Free of harmful toxins, heavy metals, and BPA.',
    },
    {
      question: 'How do I choose the right variant or pack size?',
      answer: 'Simply select your desired color, size, or multi-pack bundle from the variant options above. Each option displays dynamic real-time pricing and stock availability.',
    },
  ];
}

async function renderProductImageVariants(baseName, sourcePngBuffer) {
  // 为商品生成 1 套高精商业摄影图 (主图 384w/640w 响应式阶梯，特写 640w，包装开箱 640w)
  const promises = [];

  for (const w of [384, 640]) {
    promises.push(
      sharp(sourcePngBuffer)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82, effort: 2 })
        .toFile(path.join(CATALOG_IMG_DIR, `${baseName}-${w}w.webp`))
    );
  }

  // 多角度特写图 (微调饱和度与对比度呈现材质细节)
  const detailBuf = await sharp(sourcePngBuffer)
    .resize(800, 800, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 1.04, saturation: 1.1 })
    .toBuffer();

  promises.push(
    sharp(detailBuf)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 80, effort: 2 })
      .toFile(path.join(CATALOG_IMG_DIR, `${baseName}-detail-640w.webp`))
  );

  // 包装开箱视角图
  const packageBuf = await sharp(sourcePngBuffer)
    .resize(800, 800, { fit: 'cover', position: 'entropy' })
    .modulate({ brightness: 0.98, saturation: 1.05 })
    .toBuffer();

  promises.push(
    sharp(packageBuf)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 80, effort: 2 })
      .toFile(path.join(CATALOG_IMG_DIR, `${baseName}-package-640w.webp`))
  );

  await Promise.all(promises);
}

async function run() {
  await fs.mkdir(CATALOG_IMG_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  console.log('🚀 [Temu Edge 1800-SKU Full Parity Engine] 开始全量构建 18 品类 x 100 SKU (1,800 款商品)...');

  const allProducts = [];
  let totalProcessedImages = 0;

  for (const cat of CATEGORIES) {
    console.log(`\n📦 正在处理品类: [${cat.name}] (包含 100 款完整 SKU 商品)...`);

    for (let itemIdx = 0; itemIdx < cat.items.length; itemIdx++) {
      const baseItem = cat.items[itemIdx];
      const sourcePngPath = path.join(RAW_DIR, `${baseItem.name}.png`);
      let sourceBuffer;

      try {
        sourceBuffer = await fs.readFile(sourcePngPath);
      } catch (err) {
        console.error(`  ⚠️ 找不到原图: ${sourcePngPath}，使用默认摄影图`);
        sourceBuffer = await fs.readFile(path.join(RAW_DIR, 'contour-pillow.png'));
      }

      // 生成该商品组 4 款高清切片真实摄影图片 (写入 public/images/catalog/)
      await renderProductImageVariants(baseItem.name, sourceBuffer);
      totalProcessedImages += 1;
      process.stdout.write(`  ✓ [${cat.slug}] ${baseItem.name} 真实商业摄影图已编译\n`);

      // 生成 10 款独立售卖的 SKU/SPU 爆款商品 (10 款 x 10 核心品类 = 100 款 / 品类)
      for (let mIdx = 0; mIdx < 10; mIdx++) {
        const mod = VARIANT_MODIFIERS[mIdx];
        const spuNumber = Number(baseItem.id) * 10 + mIdx; // e.g. 10010, 10011, ..., 10109
        const spuId = `temu-${cat.slug}-${spuNumber}`;
        const skuId = `sku-${cat.slug}-${spuNumber}-std`;
        const heroImageBaseName = baseItem.name;

        const calcPromoPrice = Math.round((baseItem.promoPrice * mod.priceFactor) / 10) * 10 - 1; // 保持 99 结尾
        const calcBasePrice = Math.round(calcPromoPrice / (1 - mod.discount / 100));

        const detailedSpecs = generateDetailedSpecs(baseItem, cat, mIdx);
        const highlights = generateHighlights(baseItem, cat, mod);
        const longDescription = generateLongDescription(baseItem, cat, mod);
        const packageContents = generatePackageContents(baseItem, mod);
        const reviews = generateCustomerReviews(baseItem, mIdx);
        const faqs = generateFaqs();

        const product = {
          spuId,
          skuId,
          title: `${mod.prefix} ${baseItem.title} - ${mod.color}`,
          category: cat.name,
          categorySlug: cat.slug,
          summary: `Top seller factory-direct ${mod.prefix} ${baseItem.title}. Sourced from certified OEM facilities with priority air express and 90-day returns.`,
          longDescription,
          highlights,
          basePriceCents: calcBasePrice,
          promotionalPriceCents: calcPromoPrice,
          currency: 'USD',
          stockCount: 450 + (mIdx * 35),
          salesCountText: `${Math.floor(8 + (itemIdx * 10 + mIdx) * 1.5)}k+ sold`,
          ratingScore: Number((4.6 + (mIdx % 4) * 0.1).toFixed(1)),
          ratingCount: Math.floor(9500 + (itemIdx * 10 + mIdx) * 620),
          heroImageBaseName,
          galleryBaseNames: [`${heroImageBaseName}-detail`, `${heroImageBaseName}-package`],
          specs: [
            { label: 'Category Origin', value: `Factory Direct (${cat.name.split(' (')[0]})` },
            { label: 'Edition & Color', value: `${mod.prefix} (${mod.color})` },
            { label: 'Shipping Method', value: 'Air Express Free Shipping (3-5 Days)' },
            { label: 'Warranty & Return', value: '90-Day Free Return & Full Refund Guarantee' },
          ],
          detailedSpecs,
          packageContents,
          reviews,
          faqs,
          tags: ['Factory Direct', 'Top 100 Best Seller', 'Free Shipping', mIdx < 3 ? 'Lightning Deal' : 'Hot Choice'],
          isFlashSale: mIdx < 4,
          updatedAt: '2026-10-07',
          skuVariants: [
            {
              skuId: `${skuId}-v1`,
              name: `${mod.color} / Standard Unit`,
              priceCents: calcPromoPrice,
              originalPriceCents: calcBasePrice,
              stock: 280,
              attributes: { Color: mod.color, Edition: 'Standard' },
            },
            {
              skuId: `${skuId}-v2`,
              name: `${mod.color} / 2-Pack Value Saver`,
              priceCents: Math.round(calcPromoPrice * 1.8),
              originalPriceCents: Math.round(calcBasePrice * 1.8),
              stock: 350,
              attributes: { Color: mod.color, Edition: '2-Pack Value' },
            },
            {
              skuId: `${skuId}-v3`,
              name: `${mod.color} / Deluxe Edition with Gift Case`,
              priceCents: calcPromoPrice + 300,
              originalPriceCents: calcBasePrice + 500,
              stock: 190,
              attributes: { Color: mod.color, Edition: 'Deluxe Gift Box' },
            },
          ],
        };

        allProducts.push(product);
      }
    }
  }

  // 写入 data/catalog.json
  await fs.writeFile(
    path.join(DATA_DIR, 'catalog.json'),
    JSON.stringify(allProducts, null, 2)
  );

  console.log(`\n🎉 [1800-SKU Compiler] 成功完成编译！`);
  console.log(`   - 一级品类总数: ${CATEGORIES.length}`);
  console.log(`   - 独立可购商品总数: ${allProducts.length} (精准 18 品类 x 100 款商品/品类)`);
  console.log(`   - 真实商业摄影切片数: ${totalProcessedImages} 套图写入 public/images/catalog/`);
}

run().catch((err) => {
  console.error('❌ 执行失败:', err);
  process.exit(1);
});
