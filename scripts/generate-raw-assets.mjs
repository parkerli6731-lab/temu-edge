import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAW_DIR = path.resolve('raw-assets');

const items = [
  { name: 'earbuds-pro', title: 'Wireless Earbuds Pro', color: '#10b981', icon: '🎧' },
  { name: 'earbuds-case', title: 'Earbuds Power Case', color: '#059669', icon: '🔋' },
  { name: 'earbuds-in-ear', title: 'Ergonomic In-Ear Fit', color: '#047857', icon: '👂' },
  { name: 'smart-watch', title: 'Rugged Smart Watch', color: '#3b82f6', icon: '⌚' },
  { name: 'smart-watch-wrist', title: 'AMOLED On Wrist', color: '#2563eb', icon: '🏃' },
  { name: 'portable-blender', title: 'Portable 6-Blade Blender', color: '#f59e0b', icon: '🥤' },
  { name: 'blender-fruit', title: 'Fresh Smoothie Mode', color: '#d97706', icon: '🍓' },
  { name: 'memory-pillow', title: 'Contour Memory Pillow', color: '#8b5cf6', icon: '🛏️' },
  { name: 'pillow-support', title: 'Ergonomic Cervical Spine', color: '#7c3aed', icon: '💤' },
  { name: 'solar-lights', title: '100 LED Solar Light 4-Pack', color: '#ec4899', icon: '☀️' },
  { name: 'solar-lights-night', title: '270° Wide Angle Illumination', color: '#db2777', icon: '💡' },
];

async function generate() {
  await fs.mkdir(RAW_DIR, { recursive: true });
  for (const item of items) {
    const svg = `
      <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${item.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="1200" fill="url(#grad)" rx="40" />
        <circle cx="600" cy="500" r="240" fill="#ffffff" opacity="0.15" />
        <text x="600" y="550" font-size="180" text-anchor="middle" font-family="system-ui, sans-serif">${item.icon}</text>
        <rect x="150" y="780" width="900" height="160" rx="20" fill="#000000" opacity="0.4" />
        <text x="600" y="875" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="system-ui, sans-serif">TEMU FLASH DEALS</text>
        <text x="600" y="1030" font-size="44" fill="#f8fafc" text-anchor="middle" font-family="system-ui, sans-serif">${item.title}</text>
      </svg>
    `;
    const targetFile = path.join(RAW_DIR, `${item.name}.png`);
    await sharp(Buffer.from(svg)).png().toFile(targetFile);
    console.log(`Generated raw master asset: ${item.name}.png`);
  }
}

generate().catch(console.error);
