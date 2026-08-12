/**
 * patch-mindar.js
 *
 * mind-ar@1.2.5 was compiled against an older three.js API (r136–r151).
 * Modern three (r152+) removed `sRGBEncoding` and `renderer.outputEncoding`,
 * replacing them with the `outputColorSpace` property. Since @react-three/fiber
 * and @react-three/drei require a modern three, we cannot downgrade three.
 *
 * This script patches the compiled mind-ar browser bundle so it uses the
 * modern three.js color-space API instead, keeping color output equivalent.
 * It is run automatically via the `postinstall` hook so the patch survives
 * dependency reinstalls.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetPath = join(
  __dirname,
  '..',
  'node_modules',
  'mind-ar',
  'dist',
  'mindar-image-three.prod.js'
);

if (!existsSync(targetPath)) {
  console.log('[patch-mindar] Unable to locate mind-ar bundle, skipping.');
  process.exit(0);
}

let source = readFileSync(targetPath, 'utf-8');
let changed = false;

// 1) Drop the now-removed `sRGBEncoding as Si` import.
const importPattern = /\bsRGBEncoding as Si,\s*/g;
if (importPattern.test(source)) {
  source = source.replace(importPattern, '');
  changed = true;
}

// 2) Switch the old renderer encoding assignment to the modern color space API.
const encodingPattern = /\brenderer\.outputEncoding\s*=\s*Si/;
if (encodingPattern.test(source)) {
  source = source.replace(
    encodingPattern,
    'renderer.outputColorSpace = "srgb"'
  );
  changed = true;
}

if (changed) {
  writeFileSync(targetPath, source, 'utf-8');
  console.log('[patch-mindar] Successfully patched mind-ar bundle for three.js modern API.');
} else {
  console.log('[patch-mindar] No applicable patterns found; bundle already patched or changed upstream.');
}

