/**
 * compile-targets.js
 *
 * Mengkompilasi 4 gambar marker PNG (public/target/*.png) menjadi file
 * targets.mind yang dibutuhkan MindAR untuk image tracking.
 *
 * Pendekatan: pure-JS (tanpa node-canvas / native build).
 *  - Decode PNG menggunakan pngjs (pure JS)
 *  - Gunakan Detector + CPU kernels bawaan mind-ar dengan backend CPU tfjs
 *  - Encode hasil dengan @msgpack/msgpack, format sama dengan offline-compiler
 *
 * Usage:
 *   node scripts/compile-targets.js
 *
 * Output: public/targets.mind
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import * as tf from '@tensorflow/tfjs';
import * as msgpack from '@msgpack/msgpack';
import { Detector } from '../node_modules/mind-ar/src/image-target/detector/detector.js';
import { buildImageList, buildTrackingImageList } from '../node_modules/mind-ar/src/image-target/image-list.js';
import { build as hierarchicalClusteringBuild } from '../node_modules/mind-ar/src/image-target/matching/hierarchical-clustering.js';
import { extractTrackingFeatures } from '../node_modules/mind-ar/src/image-target/tracker/extract-utils.js';
// Registrasi CPU kernels (pure JS) agar Detector bisa jalan di backend cpu
import '../node_modules/mind-ar/src/image-target/detector/kernels/cpu/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const targetDir = join(projectRoot, 'public', 'target');
const outputPath = join(projectRoot, 'public', 'targets.mind');

const CURRENT_VERSION = 2;

// Ekstrak matching features (mirror compiler-base.js)
const _extractMatchingFeatures = async (imageList, doneCallback) => {
  const keyframes = [];
  for (let i = 0; i < imageList.length; i++) {
    const image = imageList[i];
    const detector = new Detector(image.width, image.height);

    await tf.nextFrame();
    tf.tidy(() => {
      const inputT = tf.tensor(image.data, [image.data.length], 'float32').reshape([image.height, image.width]);
      const { featurePoints: ps } = detector.detect(inputT);

      const maximaPoints = ps.filter((p) => p.maxima);
      const minimaPoints = ps.filter((p) => !p.maxima);
      const maximaPointsCluster = hierarchicalClusteringBuild({ points: maximaPoints });
      const minimaPointsCluster = hierarchicalClusteringBuild({ points: minimaPoints });

      keyframes.push({
        maximaPoints,
        minimaPoints,
        maximaPointsCluster,
        minimaPointsCluster,
        width: image.width,
        height: image.height,
        scale: image.scale
      });
      doneCallback(i);
    });
  }
  return keyframes;
};

// Decode PNG -> {data: greyscale Uint8Array, width, height}
const decodePngGrey = (filePath) => {
  const png = PNG.sync.read(readFileSync(filePath));
  const { width, height, data } = png;
  const grey = new Uint8Array(width * height);
  for (let i = 0; i < grey.length; i++) {
    const offset = i * 4;
    grey[i] = Math.floor((data[offset] + data[offset + 1] + data[offset + 2]) / 3);
  }
  return { data: grey, width, height };
};

const main = async () => {
  try {
    // Pastikan backend CPU di-registrasi & dipakai
    await tf.setBackend('cpu');
    await tf.ready();
  } catch (e) {
    console.error('Gagal menginisialisasi backend CPU tfjs:', e.message);
    process.exit(1);
  }

  const pngFiles = [
    'gula aren.png',
    'kolang kaling.png',
    'kopi gempol.png',
    'susu kambing.png',
  ];

  // Urutan anchor harus sesuai dengan index anchor di ARProduk.jsx:
  //   0 = Kopi Gempol, 1 = Susu Kambing, 2 = Kolang Kaling, dst
  // Karena ARProduk hanya memakai index 0,1,2, kita urutkan agar
  // index 0 = Kopi Gempol, 1 = Susu Kambing, 2 = Kolang Kaling.
  const ordered = [
    'kopi gempol.png',   // index 0
    'susu kambing.png',  // index 1
    'kolang kaling.png', // index 2
    'gula aren.png',     // index 3
  ];

  const images = [];
  for (const f of ordered) {
    const p = join(targetDir, f);
    if (!existsSync(p)) {
      console.error(`File tidak ditemukan: ${p}`);
      process.exit(1);
    }
    images.push(decodePngGrey(p));
  }

  console.log(`Mengkompilasi ${images.length} target...`);

  const data = [];
  const percentPerImage = 50.0 / images.length;
  let percent = 0.0;

  // Phase 1: matching data (50%)
  for (let i = 0; i < images.length; i++) {
    const targetImage = images[i];
    const imageList = buildImageList(targetImage);
    const percentPerAction = percentPerImage / imageList.length;
    const matchingData = await _extractMatchingFeatures(imageList, () => {
      percent += percentPerAction;
      process.stdout.write(`\rMatching target ${i + 1}/${images.length} ... ${Math.floor(percent * 2)}%`);
    });
    data.push({
      targetImage,
      imageList,
      matchingData
    });
  }

  // Siapkan tracking image list
  for (let i = 0; i < images.length; i++) {
    data[i].trackingImageList = buildTrackingImageList(images[i]);
  }

  // Phase 2: tracking data (50% -> 100%)
  const trackingDataList = [];
  const percentPerImageTrack = 50.0 / images.length;
  percent = 50.0;
  for (let i = 0; i < images.length; i++) {
    const trackingImageList = data[i].trackingImageList;
    const percentPerAction = percentPerImageTrack / trackingImageList.length;
    const list = [];
    for (let j = 0; j < trackingImageList.length; j++) {
      const featureSet = extractTrackingFeatures([trackingImageList[j]], () => {});
      list.push(featureSet[0]);
      percent += percentPerAction;
      process.stdout.write(`\rTracking target ${i + 1}/${images.length} ... ${Math.floor(percent)}%`);
    }
    trackingDataList.push(list);
  }

  process.stdout.write('\n');

  for (let i = 0; i < images.length; i++) {
    data[i].trackingData = trackingDataList[i];
  }

  // exportData() format (sama seperti CompilerBase.exportData)
  const dataList = [];
  for (let i = 0; i < data.length; i++) {
    dataList.push({
      targetImage: {
        width: data[i].targetImage.width,
        height: data[i].targetImage.height,
      },
      trackingData: data[i].trackingData,
      matchingData: data[i].matchingData
    });
  }
  const buffer = msgpack.encode({ v: CURRENT_VERSION, dataList });

  writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`Selesai! File berhasil dibuat: ${outputPath}`);
  console.log(`Ukuran: ${(buffer.byteLength / 1024).toFixed(1)} KB`);
};

main().catch((err) => {
  console.error('Kompilasi gagal:', err);
  process.exit(1);
});
