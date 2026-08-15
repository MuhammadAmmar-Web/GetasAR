/**
 * fetch-skybox.js
 *
 * Mengunduh HDRI hutan "Forest Slope" dari Poly Haven (lisensi CC0) dan
 * menurunkannya menjadi equirectangular 2K (2048x1024) JPG untuk background
 * 360 (scene.background R3F & skybox-image model-viewer).
 *
 * Pendekatan: pure-JS tanpa native build.
 *  - Download: fetch bawaan Node (Node 18+)
 *  - Decode/Encode JPEG: jpeg-js
 *  - Resize: bilinear interpolation (pure JS)
 *
 * Licensi: Poly Haven assets berlisensi CC0 (public domain) — bebas digunakan
 * termasuk komersial. Sumber: https://polyhaven.com/a/forest_slope
 *
 * Usage:
 *   node scripts/fetch-skybox.js
 *
 * Output: public/forest360.jpg
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import jpeg from 'jpeg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const outputPath = join(projectRoot, 'public', 'forest360.jpg');

const SOURCE_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/forest_slope.jpg';
const TARGET_WIDTH = 1024;
const JPEG_QUALITY = 75;

// Bilinear resize pada buffer RGBA (pure JS)
const resizeBilinear = (src, sw, sh, dw, dh) => {
  const out = new Uint8Array(dw * dh * 4);
  const xRatio = sw / dw;
  const yRatio = sh / dh;
  for (let y = 0; y < dh; y++) {
    const sy = y * yRatio;
    const y0 = Math.floor(sy);
    const y1 = Math.min(y0 + 1, sh - 1);
    const fy = sy - y0;
    for (let x = 0; x < dw; x++) {
      const sx = x * xRatio;
      const x0 = Math.floor(sx);
      const x1 = Math.min(x0 + 1, sw - 1);
      const fx = sx - x0;
      const i00 = (y0 * sw + x0) * 4;
      const i01 = (y0 * sw + x1) * 4;
      const i10 = (y1 * sw + x0) * 4;
      const i11 = (y1 * sw + x1) * 4;
      const o = (y * dw + x) * 4;
      for (let c = 0; c < 4; c++) {
        const top = src[i00 + c] * (1 - fx) + src[i01 + c] * fx;
        const bottom = src[i10 + c] * (1 - fx) + src[i11 + c] * fx;
        out[o + c] = Math.round(top * (1 - fy) + bottom * fy);
      }
    }
  }
  return out;
};

const main = async () => {
  console.log('Mengunduh Forest Slope (Poly Haven / CC0)...');
  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Gagal mengunduh: HTTP ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  console.log(`Unduh selesai: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

  console.log('Decode JPEG...');
  const raw = jpeg.decode(buffer, { useTArray: true, maxMemoryUsageInMB: 4096 });
  console.log(`Dimensi asli: ${raw.width}x${raw.height}`);

  const ratio = raw.width / raw.height;
  const targetHeight = Math.round(TARGET_WIDTH / ratio);
  console.log(`Resize ke ${TARGET_WIDTH}x${targetHeight} (ratio ${ratio.toFixed(2)})...`);
  const resized = resizeBilinear(raw.data, raw.width, raw.height, TARGET_WIDTH, targetHeight);

  const encoded = jpeg.encode({ data: resized, width: TARGET_WIDTH, height: targetHeight }, JPEG_QUALITY);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, Buffer.from(encoded.data));
  console.log(`Selesai! Skybox hutan dibuat: ${outputPath}`);
  console.log(`Ukuran: ${(encoded.data.length / 1024).toFixed(1)} KB (q=${JPEG_QUALITY}, ${TARGET_WIDTH}x${targetHeight})`);
};

main().catch((err) => {
  console.error('Fetch skybox gagal:', err.message);
  process.exit(1);
});
