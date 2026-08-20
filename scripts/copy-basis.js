/**
 * copy-basis.js
 *
 * Menyalin basis transcoder (basis_transcoder.js + .wasm) dari paket three.js
 * ke public/basis/ agar KTX2Loader dapat men-decode tekstur KHR_texture_basisu
 * pada mapsgardu.glb saat runtime (jalur '/basis/').
 *
 * Dijalankan otomatis melalui hook `prebuild` di package.json.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const sourceDir = join(projectRoot, 'node_modules', 'three', 'examples', 'jsm', 'libs', 'basis');
const targetDir = join(projectRoot, 'public', 'basis');

const files = ['basis_transcoder.js', 'basis_transcoder.wasm'];

if (!existsSync(sourceDir)) {
  console.log('[copy-basis] Sumber basis transcoder tidak ditemukan, melewatkan.');
  process.exit(0);
}

mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  const src = join(sourceDir, file);
  if (!existsSync(src)) {
    console.warn(`[copy-basis] File tidak ditemukan: ${src}`);
    continue;
  }
  copyFileSync(src, join(targetDir, file));
  console.log(`[copy-basis] Disalin: ${file}`);
}

console.log(`[copy-basis] Selesai ke ${targetDir}`);