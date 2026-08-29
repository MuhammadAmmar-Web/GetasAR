/**
 * optimize-assets.js
 *
 * Optimasi lossless/near-lossless seluruh aset gambar proyek GetasAR
 * menggunakan sharp. Tidak mengubah resolusi, hanya mengoptimalkan
 * encoding internal untuk memperkecil ukuran file.
 *
 * - PNG markers: kompresi lossless (palette + deflate level 9)
 * - JPEG foto dusun: progressive JPEG + mozjpeg optimization (quality 90)
 * - PNG logo: kompresi lossless
 * - JPEG skybox: progressive JPEG + mozjpeg optimization (quality 90)
 *
 * Usage:
 *   node scripts/optimize-assets.js
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const formatKB = (bytes) => (bytes / 1024).toFixed(1);

const optimizePNG = async (relPath) => {
  const absPath = join(projectRoot, relPath);
  const before = statSync(absPath).size;
  const buffer = readFileSync(absPath);

  const optimized = await sharp(buffer)
    .png({
      compressionLevel: 9,
      palette: true,       // Kuantisasi ke palette jika memungkinkan (lossless untuk <=256 warna)
      quality: 100,        // Kualitas palette maksimum
      effort: 10,          // Upaya kompresi maksimum
    })
    .toBuffer();

  // Hanya tulis jika hasilnya lebih kecil
  if (optimized.length < before) {
    writeFileSync(absPath, optimized);
    const after = optimized.length;
    console.log(`  ✅ ${relPath}: ${formatKB(before)} KB → ${formatKB(after)} KB (hemat ${formatKB(before - after)} KB)`);
    return { before, after };
  } else {
    console.log(`  ⏭️  ${relPath}: ${formatKB(before)} KB — sudah optimal`);
    return { before, after: before };
  }
};

const optimizeJPEG = async (relPath) => {
  const absPath = join(projectRoot, relPath);
  const before = statSync(absPath).size;
  const buffer = readFileSync(absPath);

  const optimized = await sharp(buffer)
    .jpeg({
      quality: 90,         // Kualitas tinggi — visual identik
      progressive: true,   // Progressive scan untuk loading bertahap
      mozjpeg: true,       // Menggunakan encoder mozjpeg (lebih efisien)
    })
    .toBuffer();

  if (optimized.length < before) {
    writeFileSync(absPath, optimized);
    const after = optimized.length;
    console.log(`  ✅ ${relPath}: ${formatKB(before)} KB → ${formatKB(after)} KB (hemat ${formatKB(before - after)} KB)`);
    return { before, after };
  } else {
    console.log(`  ⏭️  ${relPath}: ${formatKB(before)} KB — sudah optimal`);
    return { before, after: before };
  }
};

const main = async () => {
  console.log('═══ Optimasi Aset GetasAR ═══\n');

  let totalBefore = 0;
  let totalAfter = 0;

  // 1. Marker PNG (lossless)
  console.log('📌 Marker AR (PNG lossless):');
  const markers = [
    'public/target/gula aren.png',
    'public/target/kolang kaling.png',
    'public/target/kopi gempol.png',
    'public/target/susu kambing.png',
  ];
  for (const f of markers) {
    const r = await optimizePNG(f);
    totalBefore += r.before;
    totalAfter += r.after;
  }

  // 2. Foto dusun (JPEG progressive + mozjpeg)
  console.log('\n🖼️  Foto Dusun (JPEG progressive):');
  const photos = [
    'src/assets/genting.jpg',
    'src/assets/Banjaran.jpg',
    'src/assets/truko.jpg',
    'src/assets/Metep.jpg',
    'src/assets/Bleder.jpg',
    'src/assets/Getas.jpg',
    'src/assets/Jolinggo.jpg',
    'src/assets/Mambang.jpg',
    'src/assets/Sekolotok.jpg',
  ];
  for (const f of photos) {
    const r = await optimizeJPEG(f);
    totalBefore += r.before;
    totalAfter += r.after;
  }

  // 3. Skybox (JPEG progressive + mozjpeg)
  console.log('\n🌄 Skybox (JPEG progressive):');
  {
    const r = await optimizeJPEG('public/forest360.jpg');
    totalBefore += r.before;
    totalAfter += r.after;
  }

  // 4. Logo PNG (lossless)
  console.log('\n🏷️  Logo (PNG lossless):');
  const logos = [
    'src/assets/logoppko.png',
    'src/assets/Logo.png',
  ];
  for (const f of logos) {
    const r = await optimizePNG(f);
    totalBefore += r.before;
    totalAfter += r.after;
  }

  // Ringkasan
  const saved = totalBefore - totalAfter;
  console.log('\n═══════════════════════════════════════');
  console.log(`📊 TOTAL SEBELUM : ${formatKB(totalBefore)} KB (${(totalBefore / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`📊 TOTAL SESUDAH : ${formatKB(totalAfter)} KB (${(totalAfter / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`💾 HEMAT         : ${formatKB(saved)} KB (${(saved / totalBefore * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════');
};

main().catch((err) => {
  console.error('Optimasi gagal:', err);
  process.exit(1);
});
