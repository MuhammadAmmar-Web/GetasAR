/**
 * optimize-images.js
 *
 * Mengoptimalkan gambar lokal yang dipakai aplikasi:
 *   - src/assets/genting.jpg (5184x3456 / 2,5MB) -> JPEG 1024px (q85)
 *   - src/assets/truko.jpg   (4032x2268 / 1,4MB) -> JPEG 1024px (q85)
 *   - src/assets/Logo.png    (1280x1280 / 186KB) -> PNG 256px
 *
 * Gambar ini hanya ditampilkan sebagai kartu kecil (±160-256px), jadi
 * resolusi megapixel hanya membuang bandwidth. Pendekatan pure-JS
 * (jpeg-js + pngjs + bilinear) — konsisten dengan fetch-skybox.js.
 *
 * Idempoten: dilewati jika lebar gambar sudah <= target.
 * Dijalankan otomatis melalui hook `prebuild` di package.json.
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const assetsDir = join(projectRoot, 'src', 'assets');

const JPEG_TARGET_WIDTH = 1024;
const JPEG_QUALITY = 85;
const LOGO_TARGET_WIDTH = 256;

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

const optimizeJpeg = (name, targetWidth, quality) => {
  const path = join(assetsDir, name);
  if (!existsSync(path)) {
    console.log(`[optimize-images] Tidak ditemukan: ${name}, dilewati.`);
    return;
  }
  const raw = jpeg.decode(readFileSync(path), { useTArray: true, maxMemoryUsageInMB: 2048 });
  if (raw.width <= targetWidth) {
    console.log(`[optimize-images] ${name} sudah ${raw.width}px (<= ${targetWidth}px), dilewati.`);
    return;
  }
  const ratio = raw.width / raw.height;
  const targetHeight = Math.round(targetWidth / ratio);
  const resized = resizeBilinear(raw.data, raw.width, raw.height, targetWidth, targetHeight);
  const encoded = jpeg.encode({ data: resized, width: targetWidth, height: targetHeight }, quality);
  const before = (statSync(path).size / 1024).toFixed(0);
  writeFileSync(path, Buffer.from(encoded.data));
  const after = (encoded.data.length / 1024).toFixed(0);
  console.log(`[optimize-images] ${name}: ${raw.width}x${raw.height} -> ${targetWidth}x${targetHeight}, ${before}KB -> ${after}KB`);
};

const optimizePng = (name, targetWidth) => {
  const path = join(assetsDir, name);
  if (!existsSync(path)) {
    console.log(`[optimize-images] Tidak ditemukan: ${name}, dilewati.`);
    return;
  }
  const png = PNG.sync.read(readFileSync(path));
  if (png.width <= targetWidth) {
    console.log(`[optimize-images] ${name} sudah ${png.width}px (<= ${targetWidth}px), dilewati.`);
    return;
  }
  const ratio = png.width / png.height;
  const targetHeight = Math.round(targetWidth / ratio);
  const resized = resizeBilinear(png.data, png.width, png.height, targetWidth, targetHeight);
  const out = new PNG({ width: targetWidth, height: targetHeight });
  out.data = Buffer.from(resized);
  const encoded = PNG.sync.write(out, { colorType: 6 });
  const before = (statSync(path).size / 1024).toFixed(0);
  writeFileSync(path, encoded);
  const after = (encoded.length / 1024).toFixed(0);
  console.log(`[optimize-images] ${name}: ${png.width}x${png.height} -> ${targetWidth}x${targetHeight}, ${before}KB -> ${after}KB`);
};

optimizeJpeg('genting.jpg', JPEG_TARGET_WIDTH, JPEG_QUALITY);
optimizeJpeg('truko.jpg', JPEG_TARGET_WIDTH, JPEG_QUALITY);
optimizeJpeg('Banjaran.jpg', JPEG_TARGET_WIDTH, JPEG_QUALITY);
optimizeJpeg('Metep.jpg', JPEG_TARGET_WIDTH, JPEG_QUALITY);
optimizePng('Logo.png', LOGO_TARGET_WIDTH);
console.log('[optimize-images] Selesai.');