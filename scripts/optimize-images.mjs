import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('raw-assets');
const OUTPUT_DIR = path.resolve('public/images/optimized');
const SIZES = [384, 640, 1024];

async function processImages() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const files = await fs.readdir(SOURCE_DIR);
  const manifest = {};

  for (const file of files) {
    if (!file.match(/\.(jpe?g|png|webp)$/i)) continue;
    const baseName = path.parse(file).name;
    const sourceFilePath = path.join(SOURCE_DIR, file);

    console.log(`🖼️ [Zero-Bill Pipeline] Processing master asset: ${file}`);
    manifest[baseName] = { versions: [] };

    const metadata = await sharp(sourceFilePath).metadata();

    for (const width of SIZES) {
      if (width > (metadata.width || 0) * 1.25) continue;

      const outputFileName = `${baseName}-${width}w.webp`;
      const outputFilePath = path.join(OUTPUT_DIR, outputFileName);

      await sharp(sourceFilePath)
        .resize({ width, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
        .webp({ quality: 80, effort: 6 })
        .toFile(outputFilePath);

      manifest[baseName].versions.push({
        width,
        path: `/images/optimized/${outputFileName}`,
      });
    }

    // Micro blur placeholder (16px base64)
    const blurBuffer = await sharp(sourceFilePath)
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();
    manifest[baseName].blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'image-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`✅ [Zero-Bill Pipeline] Media compilation finished. image-manifest.json generated with ${Object.keys(manifest).length} assets.`);
}

processImages().catch((err) => {
  console.error('❌ Pipeline failed:', err);
  process.exit(1);
});
