const fs = require('fs');

const buffer = fs.readFileSync('public/mapsgardu.glb');
const magic = buffer.readUInt32LE(0);
if (magic !== 0x46546C67) {
  console.log('Not a valid GLB file');
  process.exit(1);
}

const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.readUInt32LE(16);

if (jsonChunkType !== 0x4E4F534A) {
  console.log('First chunk is not JSON');
  process.exit(1);
}

const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonString);

gltf.nodes.forEach((node, index) => {
  if (node.name) {
    console.log(`Node ${index}: ${node.name}`);
  }
});
