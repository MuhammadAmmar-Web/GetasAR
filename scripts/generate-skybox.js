/**
 * generate-skybox.js
 *
 * Menghasilkan gambar equirectangular 360 (rasio 2:1) sebagai background
 * model-viewer (atribut skybox-image) dan peta 3D utama (scene.background).
 *
 * Pendekatan: pure-JS dengan pngjs (tanpa native build), konsisten dengan
 * scripts/compile-targets.js.
 *
 * Desain tema HUTAN:
 *   - y 0 - 0.5H  : gradien hijau tua (zenith/kanopi) -> hijau kabut (cakrawala)
 *   - y 0.5H - H  : gradien tanah mossy green -> cokelat lumut gelap
 *   - siluet kanopi pohon via value noise (lebih gelap di puncak, transparan ke tanah)
 *   - patch tanah via noise halus agar tidak polos
 *
 * PRNG deterministik (mulberry32) + seed tetap -> hasil konsisten tiap regenerate.
 *
 * Usage:
 *   node scripts/generate-skybox.js
 *
 * Output: public/skybox360.png
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const outputPath = join(projectRoot, 'public', 'skybox360.png');

const WIDTH = 2048;
const HEIGHT = 1024;

const clamp = (v) => Math.max(0, Math.min(255, v));
const lerp = (a, b, t) => Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));

// PRNG deterministik: hasil sama setiap regenerate (seed tetap)
const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Value noise 2D (interpolasi smooth) berbasis lattice gradien
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

const createNoise = (seed) => {
  const rand = mulberry32(seed);
  const grad = [];
  for (let i = 0; i < 256; i++) {
    grad.push([rand() * 2 - 1, rand() * 2 - 1]);
  }
  const index = (xi, yi) => grad[((xi & 255) + ((yi & 255) << 8)) & 255];
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = fade(xf);
    const v = fade(yf);
    const aa = index(xi, yi);
    const bb = index(xi + 1, yi);
    const cc = index(xi, yi + 1);
    const dd = index(xi + 1, yi + 1);
    const x1 = aa[0] * xf + aa[1] * yf;
    const x2 = bb[0] * (xf - 1) + bb[1] * yf;
    const y1 = cc[0] * xf + cc[1] * (yf - 1);
    const y2 = dd[0] * (xf - 1) + dd[1] * (yf - 1);
    return lerp(lerp(x1, x2, u), lerp(y1, y2, u), v);
  };
};

const main = () => {
  const png = new PNG({ width: WIDTH, height: HEIGHT });
  const data = png.data;

  // Noise terpisah untuk kanopi dan tanah agar polanya tidak berulang sinkron
  const canopyNoise = createNoise(42);
  const groundNoise = createNoise(2026);

  for (let y = 0; y < HEIGHT; y++) {
    const t = y / HEIGHT;
    for (let x = 0; x < WIDTH; x++) {
      let r, g, b;

      if (t < 0.5) {
        // Kanopi/langit: hijau tua (zenith) -> hijau kabut (cakrawala)
        const u = t / 0.5;
        r = lerp(24, 170, u);
        g = lerp(58, 200, u);
        b = lerp(44, 178, u);
      } else {
        // Tanah: mossy green (cakrawala) -> cokelat lumut gelap (bawah)
        const u = (t - 0.5) / 0.5;
        r = lerp(170, 36, u);
        g = lerp(200, 62, u);
        b = lerp(178, 40, u);
      }

      // Siluet kanopi pohon: gelap di puncak, transparan menuju tanah
      const n = canopyNoise(x / 55.0, y / 30.0);
      const canopy = Math.max(0, n) * 0.55;
      if (t < 0.72) {
        const fadeOut = Math.max(0, 1 - (t - 0.5) / 0.22);
        const strength = 0.4 + 0.6 * fadeOut;
        r = clamp(r - canopy * 45 * strength);
        g = clamp(g - canopy * 30 * strength);
        b = clamp(b - canopy * 40 * strength);
      }

      // Patch tanah halus agar tidak polos
      if (t >= 0.5) {
        const ng = groundNoise(x / 140.0 + 1000, y / 90.0 + 2000);
        const p = Math.max(0, ng) * 0.15;
        r = clamp(r - p * 30);
        g = clamp(g - p * 25);
        b = clamp(b - p * 20);
      }

      const i = (WIDTH * y + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }

  const buffer = PNG.sync.write(png);
  writeFileSync(outputPath, buffer);
  console.log(`Selesai! Skybox hutan dibuat: ${outputPath}`);
  console.log(`Ukuran: ${(buffer.length / 1024).toFixed(1)} KB`);
};

main();
