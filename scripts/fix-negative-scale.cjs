/**
 * fix-negative-scale.cjs
 *
 * Converts mapsgardu.glb to mapsgardu_ios.glb for iOS AR / Quick Look / Scene Viewer compatibility:
 * 1. Decompresses Draco mesh compression (if present) to standard glTF buffers.
 * 2. Bakes negative scale into vertex positions, normals, and inverts triangle winding order.
 * 3. Converts WebP textures to standard PNG (with alpha) or JPEG (without alpha) for universal iOS compatibility.
 * 4. Removes KHR_materials_unlit and ensures standard PBR metallic-roughness.
 * 5. Removes vendor extensions not supported by iOS Quick Look.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { NodeIO } = require('@gltf-transform/core');
const {
  KHRDracoMeshCompression,
  EXTTextureWebP,
  KHRMaterialsUnlit,
  KHRTextureBasisu,
  EXTMeshoptCompression
} = require('@gltf-transform/extensions');
const { prune, dedup } = require('@gltf-transform/functions');
const draco3d = require('draco3dgltf');

const INPUT_GLB = path.resolve(__dirname, '../public/mapsgardu.glb');
const OUTPUT_GLB = path.resolve(__dirname, '../public/mapsgardu_ios.glb');

async function main() {
  console.log('📂 Reading input model:', INPUT_GLB);
  if (!fs.existsSync(INPUT_GLB)) {
    throw new Error(`Input file not found: ${INPUT_GLB}`);
  }
  const inputStat = fs.statSync(INPUT_GLB);
  console.log(`   File size: ${(inputStat.size / 1024).toFixed(1)} KB`);

  // 1. Initialize NodeIO with decoder modules
  const io = new NodeIO()
    .registerExtensions([
      KHRDracoMeshCompression,
      EXTTextureWebP,
      KHRMaterialsUnlit,
      KHRTextureBasisu,
      EXTMeshoptCompression
    ])
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule()
    });

  const doc = await io.read(INPUT_GLB);
  const root = doc.getRoot();

  console.log(`   Nodes: ${root.listNodes().length}, Meshes: ${root.listMeshes().length}, Materials: ${root.listMaterials().length}, Textures: ${root.listTextures().length}\n`);

  // 2. Bake negative scale into geometry
  console.log('══ STEP 1: Bake negative scale into geometry ══');
  let fixedCount = 0;
  for (const node of root.listNodes()) {
    const scale = node.getScale();
    if (!scale || !scale.some(s => s < 0)) continue;

    const sx = Math.sign(scale[0]);
    const sy = Math.sign(scale[1]);
    const sz = Math.sign(scale[2]);
    const det = sx * sy * sz;

    const mesh = node.getMesh();
    if (mesh) {
      console.log(`   Fixing node "${node.getName() || 'Unnamed'}" (scale: [${scale.map(v => v.toFixed(3))}])`);
      for (const prim of mesh.listPrimitives()) {
        const posAcc = prim.getAttribute('POSITION');
        if (posAcc) {
          const arr = posAcc.getArray();
          for (let i = 0; i < arr.length; i += 3) {
            arr[i] *= sx;
            arr[i + 1] *= sy;
            arr[i + 2] *= sz;
          }
          posAcc.setArray(arr);
        }

        const normAcc = prim.getAttribute('NORMAL');
        if (normAcc) {
          const arr = normAcc.getArray();
          for (let i = 0; i < arr.length; i += 3) {
            arr[i] *= sx;
            arr[i + 1] *= sy;
            arr[i + 2] *= sz;
          }
          normAcc.setArray(arr);
        }

        // If negative determinant, flip triangle winding order
        const idxAcc = prim.getIndices();
        if (det < 0 && idxAcc) {
          const arr = idxAcc.getArray();
          for (let i = 0; i < arr.length; i += 3) {
            const tmp = arr[i + 1];
            arr[i + 1] = arr[i + 2];
            arr[i + 2] = tmp;
          }
          idxAcc.setArray(arr);
        }
      }
      fixedCount++;
    }

    // Set scale to positive values
    node.setScale([Math.abs(scale[0]), Math.abs(scale[1]), Math.abs(scale[2])]);
  }
  console.log(`   ✅ Fixed ${fixedCount} mesh nodes with negative scale.\n`);

  // 3. Convert WebP textures to standard PNG/JPEG
  console.log('══ STEP 2: Convert WebP textures to PNG/JPEG ══');
  const textures = root.listTextures();
  for (const tex of textures) {
    const mime = tex.getMimeType();
    const rawImage = tex.getImage();
    if (!rawImage || rawImage.length === 0) continue;

    if (mime === 'image/webp' || !mime) {
      const meta = await sharp(rawImage).metadata();
      let convertedBuf;
      let targetMime;

      if (meta.hasAlpha) {
        convertedBuf = await sharp(rawImage).png({ quality: 90 }).toBuffer();
        targetMime = 'image/png';
      } else {
        convertedBuf = await sharp(rawImage).jpeg({ quality: 90 }).toBuffer();
        targetMime = 'image/jpeg';
      }

      tex.setImage(convertedBuf);
      tex.setMimeType(targetMime);
      console.log(`   Converted "${tex.getName() || 'texture'}" from ${meta.format} to ${targetMime} (${(convertedBuf.length / 1024).toFixed(1)} KB)`);
    }
  }
  console.log('   ✅ Textures converted.\n');

  // 4. Clean up unlit materials
  console.log('══ STEP 3: Ensure standard PBR materials ══');
  let unlitCount = 0;
  for (const mat of root.listMaterials()) {
    const unlitExt = mat.getExtension('KHR_materials_unlit');
    if (unlitExt) {
      mat.setExtension('KHR_materials_unlit', null);
      if (mat.getRoughnessFactor() === undefined || mat.getRoughnessFactor() === null) {
        mat.setRoughnessFactor(1.0);
      }
      if (mat.getMetallicFactor() === undefined || mat.getMetallicFactor() === null) {
        mat.setMetallicFactor(0.0);
      }
      unlitCount++;
    }
  }
  console.log(`   ✅ Processed ${unlitCount} unlit materials.\n`);

  // 5. Remove unsupported extensions
  console.log('══ STEP 4: Remove Draco & WebP extensions for iOS Quick Look ══');
  const extensionsToDispose = ['KHR_draco_mesh_compression', 'EXT_texture_webp', 'KHR_materials_unlit'];
  for (const ext of root.listExtensionsUsed()) {
    if (extensionsToDispose.includes(ext.extensionName)) {
      ext.dispose();
    }
  }
  for (const ext of root.listExtensionsRequired()) {
    if (extensionsToDispose.includes(ext.extensionName)) {
      ext.dispose();
    }
  }

  // Run dedup & prune to keep GLB lean
  await doc.transform(prune(), dedup());

  // 6. Write output binary
  console.log('\n══ STEP 5: Writing iOS-compatible GLB ══');
  const outputBuffer = await io.writeBinary(doc);
  fs.writeFileSync(OUTPUT_GLB, outputBuffer);

  console.log(`\n🎉 Successfully generated ${OUTPUT_GLB}`);
  console.log(`   Input size : ${(inputStat.size / 1024).toFixed(1)} KB`);
  console.log(`   Output size: ${(outputBuffer.length / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(err => {
  console.error('❌ Error processing GLB:', err);
  process.exit(1);
});
