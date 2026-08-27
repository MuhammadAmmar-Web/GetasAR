/**
 * fix-ios-glb.cjs
 *
 * Comprehensive fix for iOS AR compatibility:
 * 1. Bake negative scale into geometry
 * 2. Flatten kambing hierarchy (bake all transforms into vertex data)
 * 3. Flatten FBX (gula aren) hierarchy
 * 4. Remove KHR_materials_unlit
 */

'use strict';

const fs = require('fs');
const path = require('path');

const INPUT_GLB  = path.resolve(__dirname, '../public/mapsgardu.glb');
const OUTPUT_GLB = path.resolve(__dirname, '../public/mapsgardu_ios.glb');

// ─── GLB parsing ──────────────────────────────────────────────
function parseGLB(buf) {
  if (buf.readUInt32LE(0) !== 0x46546C67) throw new Error('Not GLB');
  const version = buf.readUInt32LE(4);
  const jsonLength = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.toString('utf8', 20, 20 + jsonLength));
  const binOff = 20 + jsonLength;
  const binLen = buf.readUInt32LE(binOff);
  const binData = Buffer.from(buf.slice(binOff + 8, binOff + 8 + binLen));
  return { gltf, binData, version };
}

function writeGLB(gltf, binData, version) {
  let jb = Buffer.from(JSON.stringify(gltf), 'utf8');
  const jp = (4 - (jb.length % 4)) % 4;
  if (jp > 0) jb = Buffer.concat([jb, Buffer.alloc(jp, 0x20)]);
  const bp = (4 - (binData.length % 4)) % 4;
  const bd = bp > 0 ? Buffer.concat([binData, Buffer.alloc(bp, 0x00)]) : binData;
  const total = 12 + 8 + jb.length + 8 + bd.length;
  const out = Buffer.alloc(total);
  let o = 0;
  out.writeUInt32LE(0x46546C67, o); o += 4;
  out.writeUInt32LE(version, o); o += 4;
  out.writeUInt32LE(total, o); o += 4;
  out.writeUInt32LE(jb.length, o); o += 4;
  out.writeUInt32LE(0x4E4F534A, o); o += 4;
  jb.copy(out, o); o += jb.length;
  out.writeUInt32LE(bd.length, o); o += 4;
  out.writeUInt32LE(0x004E4942, o); o += 4;
  bd.copy(out, o);
  return out;
}

// ─── Accessor helpers ─────────────────────────────────────────
const COMP = { SCALAR:1, VEC2:2, VEC3:3, VEC4:4, MAT4:16 };

function readAcc(gltf, bin, idx) {
  const a = gltf.accessors[idx], bv = gltf.bufferViews[a.bufferView];
  const off = (bv.byteOffset||0)+(a.byteOffset||0);
  const cc = COMP[a.type], stride = bv.byteStride || (cc*4);
  const data = [];
  for (let i=0; i<a.count; i++) {
    const s = off + i*stride, t = [];
    for (let c=0; c<cc; c++) t.push(bin.readFloatLE(s+c*4));
    data.push(t);
  }
  return data;
}

function writeAcc(gltf, bin, idx, data) {
  const a = gltf.accessors[idx], bv = gltf.bufferViews[a.bufferView];
  const off = (bv.byteOffset||0)+(a.byteOffset||0);
  const cc = COMP[a.type], stride = bv.byteStride || (cc*4);
  for (let i=0; i<a.count; i++) {
    const s = off + i*stride;
    for (let c=0; c<cc; c++) bin.writeFloatLE(data[i][c], s+c*4);
  }
  if (a.min && a.max) {
    const min = Array(cc).fill(Infinity), max = Array(cc).fill(-Infinity);
    for (const t of data) for (let c=0; c<cc; c++) { if(t[c]<min[c])min[c]=t[c]; if(t[c]>max[c])max[c]=t[c]; }
    a.min = min; a.max = max;
  }
}

function readIdx(gltf, bin, idx) {
  const a = gltf.accessors[idx], bv = gltf.bufferViews[a.bufferView];
  const off = (bv.byteOffset||0)+(a.byteOffset||0), r = [];
  for (let i=0; i<a.count; i++) r.push(a.componentType===5123 ? bin.readUInt16LE(off+i*2) : bin.readUInt32LE(off+i*4));
  return r;
}

function writeIdx(gltf, bin, idx, data) {
  const a = gltf.accessors[idx], bv = gltf.bufferViews[a.bufferView];
  const off = (bv.byteOffset||0)+(a.byteOffset||0);
  for (let i=0; i<data.length; i++) {
    if (a.componentType===5123) bin.writeUInt16LE(data[i],off+i*2);
    else bin.writeUInt32LE(data[i],off+i*4);
  }
}

// ─── 3D math ─────────────────────────────────────────────────
function quatMul(a, b) {
  return [
    a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],
    a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],
    a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],
    a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2],
  ];
}

function quatRot(q, v) {
  const [qx,qy,qz,qw] = q, [vx,vy,vz] = v;
  const tx=2*(qy*vz-qz*vy), ty=2*(qz*vx-qx*vz), tz=2*(qx*vy-qy*vx);
  return [vx+qw*tx+(qy*tz-qz*ty), vy+qw*ty+(qz*tx-qx*tz), vz+qw*tz+(qx*ty-qy*tx)];
}

/**
 * Compute cumulative TRS from root node down to (but not including) a target mesh node.
 * Returns { translation, rotation, scale } accumulated along the path.
 */
function getWorldTransform(gltf, rootIdx, targetIdx) {
  const path = [];
  function dfs(idx, cur) {
    cur.push(idx);
    if (idx === targetIdx) { path.push(...cur); return true; }
    const n = gltf.nodes[idx];
    if (n.children) for (const c of n.children) if (dfs(c, cur)) return true;
    cur.pop();
    return false;
  }
  dfs(rootIdx, []);

  // Accumulate transforms for all nodes in path EXCEPT the target (the mesh node)
  let t = [0,0,0], r = [0,0,0,1], s = [1,1,1];
  
  for (const idx of path) {
    const n = gltf.nodes[idx];
    // Apply: first scale, then rotate, then translate
    // New position = parentRot * (parentScale * childT) + parentT
    const nt = n.translation || [0,0,0];
    const nr = n.rotation || [0,0,0,1];
    const ns = n.scale || [1,1,1];

    // Scale the translation by parent scale, rotate by parent rotation, add parent translation
    const scaledT = [nt[0]*s[0], nt[1]*s[1], nt[2]*s[2]];
    const rotatedT = quatRot(r, scaledT);
    t = [t[0]+rotatedT[0], t[1]+rotatedT[1], t[2]+rotatedT[2]];

    // Accumulate rotation
    r = quatMul(r, nr);

    // Accumulate scale
    s = [s[0]*ns[0], s[1]*ns[1], s[2]*ns[2]];
  }

  return { translation: t, rotation: r, scale: s };
}

/**
 * Apply a full TRS transform to a mesh's geometry.
 */
function bakeMeshTransform(gltf, binData, meshIdx, transform) {
  const { translation: t, rotation: r, scale: s } = transform;
  const mesh = gltf.meshes[meshIdx];
  const det = s[0]*s[1]*s[2];
  
  for (const prim of mesh.primitives) {
    if (prim.attributes.POSITION !== undefined) {
      const data = readAcc(gltf, binData, prim.attributes.POSITION);
      for (const p of data) {
        // Apply: scale → rotate → translate
        const scaled = [p[0]*s[0], p[1]*s[1], p[2]*s[2]];
        const rotated = quatRot(r, scaled);
        p[0] = rotated[0] + t[0];
        p[1] = rotated[1] + t[1];
        p[2] = rotated[2] + t[2];
      }
      writeAcc(gltf, binData, prim.attributes.POSITION, data);
    }
    if (prim.attributes.NORMAL !== undefined) {
      const data = readAcc(gltf, binData, prim.attributes.NORMAL);
      for (const n of data) {
        // Normals: apply scale sign + rotate (no translate)
        const sn = [n[0]*Math.sign(s[0]), n[1]*Math.sign(s[1]), n[2]*Math.sign(s[2])];
        const rotated = quatRot(r, sn);
        // Renormalize
        const len = Math.sqrt(rotated[0]**2+rotated[1]**2+rotated[2]**2) || 1;
        n[0] = rotated[0]/len; n[1] = rotated[1]/len; n[2] = rotated[2]/len;
      }
      writeAcc(gltf, binData, prim.attributes.NORMAL, data);
    }
    // Flip winding if determinant < 0
    if (det < 0 && prim.indices !== undefined) {
      const idx = readIdx(gltf, binData, prim.indices);
      for (let i=0; i<idx.length-2; i+=3) { const tmp=idx[i+1]; idx[i+1]=idx[i+2]; idx[i+2]=tmp; }
      writeIdx(gltf, binData, prim.indices, idx);
    }
  }
}

/**
 * Find all mesh nodes in a subtree.
 */
function collectMeshNodes(gltf, nodeIdx) {
  const result = [];
  const n = gltf.nodes[nodeIdx];
  if (n.mesh !== undefined) result.push(nodeIdx);
  if (n.children) for (const c of n.children) result.push(...collectMeshNodes(gltf, c));
  return result;
}

// ─── Main ─────────────────────────────────────────────────────
function main() {
  console.log('📂 Reading:', INPUT_GLB);
  const buf = fs.readFileSync(INPUT_GLB);
  const { gltf, binData, version } = parseGLB(buf);

  console.log(`   ${gltf.nodes.length} nodes, ${gltf.meshes.length} meshes, ${gltf.materials.length} materials\n`);

  // ═══ STEP 1: Fix negative scale nodes (with direct mesh) ═══
  console.log('══ STEP 1: Fix negative scale ══');
  gltf.nodes.forEach((node, i) => {
    if (!node.scale || !node.scale.some(s => s < 0)) return;
    const sx = Math.sign(node.scale[0]), sy = Math.sign(node.scale[1]), sz = Math.sign(node.scale[2]);
    const det = sx*sy*sz;

    if (node.mesh !== undefined) {
      const mesh = gltf.meshes[node.mesh];
      console.log(`   [${i}] "${node.name}" (${mesh.primitives.length} prims)`);
      for (const prim of mesh.primitives) {
        if (prim.attributes.POSITION !== undefined) {
          const d = readAcc(gltf, binData, prim.attributes.POSITION);
          for (const p of d) { p[0]*=sx; p[1]*=sy; p[2]*=sz; }
          writeAcc(gltf, binData, prim.attributes.POSITION, d);
        }
        if (prim.attributes.NORMAL !== undefined) {
          const d = readAcc(gltf, binData, prim.attributes.NORMAL);
          for (const n of d) { n[0]*=sx; n[1]*=sy; n[2]*=sz; }
          writeAcc(gltf, binData, prim.attributes.NORMAL, d);
        }
        if (det<0 && prim.indices!==undefined) {
          const idx = readIdx(gltf, binData, prim.indices);
          for (let t=0; t<idx.length-2; t+=3) { const tmp=idx[t+1]; idx[t+1]=idx[t+2]; idx[t+2]=tmp; }
          writeIdx(gltf, binData, prim.indices, idx);
        }
      }
    }
    node.scale = [Math.abs(node.scale[0]), Math.abs(node.scale[1]), Math.abs(node.scale[2])];
  });

  // ═══ STEP 2: Flatten kambing hierarchy ═══
  console.log('\n══ STEP 2: Flatten kambing hierarchy ══');
  const kambngIdx = gltf.nodes.findIndex(n => n.name === 'kambng');
  if (kambngIdx >= 0) {
    const meshNodes = collectMeshNodes(gltf, kambngIdx);
    console.log(`   Root: node ${kambngIdx}, mesh nodes: [${meshNodes}]`);
    
    for (const mnIdx of meshNodes) {
      const meshNode = gltf.nodes[mnIdx];
      // Compute world transform from kambng root down to AND including this mesh node
      const xform = getWorldTransform(gltf, kambngIdx, mnIdx);
      console.log(`   Baking [${mnIdx}] "${meshNode.name}" T:[${xform.translation.map(v=>v.toFixed(3))}] S:[${xform.scale.map(v=>v.toFixed(3))}]`);
      
      bakeMeshTransform(gltf, binData, meshNode.mesh, xform);
    }
    
    // Flatten: clear all transforms & children in subtree
    const clearSubtree = (idx) => {
      const n = gltf.nodes[idx];
      delete n.translation; delete n.rotation; delete n.scale;
      if (n.children) n.children.forEach(clearSubtree);
    };
    clearSubtree(kambngIdx);
    
    // Move mesh directly to kambng node and remove deep hierarchy
    if (meshNodes.length > 0) {
      const firstMeshNode = gltf.nodes[meshNodes[0]];
      // Position is now baked into geometry — only keep world translation of root
      console.log('   ✅ Kambing flattened');
    }
  }

  // ═══ STEP 3: Flatten FBX hierarchy (node 27 - gula aren container) ═══
  console.log('\n══ STEP 3: Flatten FBX (148acc43) hierarchy ══');
  const fbxIdx = gltf.nodes.findIndex(n => n.name && n.name.includes('148acc43'));
  if (fbxIdx >= 0) {
    const meshNodes = collectMeshNodes(gltf, fbxIdx);
    console.log(`   Root: node ${fbxIdx}, mesh nodes: [${meshNodes}]`);
    
    for (const mnIdx of meshNodes) {
      const meshNode = gltf.nodes[mnIdx];
      const xform = getWorldTransform(gltf, fbxIdx, mnIdx);
      console.log(`   Baking [${mnIdx}] "${meshNode.name}" T:[${xform.translation.map(v=>v.toFixed(3))}] S:[${xform.scale.map(v=>v.toFixed(3))}]`);
      
      bakeMeshTransform(gltf, binData, meshNode.mesh, xform);
    }
    
    const clearSubtree = (idx) => {
      const n = gltf.nodes[idx];
      delete n.translation; delete n.rotation; delete n.scale;
      if (n.children) n.children.forEach(clearSubtree);
    };
    clearSubtree(fbxIdx);
    console.log('   ✅ FBX flattened');
  }

  // ═══ STEP 4: Remove KHR_materials_unlit ═══
  console.log('\n══ STEP 4: Remove KHR_materials_unlit ══');
  let unlitCount = 0;
  for (const mat of gltf.materials) {
    if (mat.extensions?.KHR_materials_unlit) {
      delete mat.extensions.KHR_materials_unlit;
      if (Object.keys(mat.extensions).length === 0) delete mat.extensions;
      if (!mat.pbrMetallicRoughness) mat.pbrMetallicRoughness = {};
      mat.pbrMetallicRoughness.roughnessFactor = 1.0;
      mat.pbrMetallicRoughness.metallicFactor = 0.0;
      unlitCount++;
    }
  }
  const filterExt = (a) => (a||[]).filter(e => e !== 'KHR_materials_unlit');
  gltf.extensionsUsed = filterExt(gltf.extensionsUsed);
  gltf.extensionsRequired = filterExt(gltf.extensionsRequired);
  if (gltf.extensionsUsed?.length === 0) delete gltf.extensionsUsed;
  if (gltf.extensionsRequired?.length === 0) delete gltf.extensionsRequired;
  console.log(`   Removed from ${unlitCount} materials`);

  // ═══ STEP 5: Write ═══
  if (gltf.buffers?.[0]) gltf.buffers[0].byteLength = binData.length;
  
  const outBuf = writeGLB(gltf, binData, version);
  fs.writeFileSync(OUTPUT_GLB, outBuf);
  console.log(`\n✅ Done! ${(buf.length/1048576).toFixed(1)}MB → ${(outBuf.length/1048576).toFixed(1)}MB`);
}

main();
