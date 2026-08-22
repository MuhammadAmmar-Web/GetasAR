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

const nodes = gltf.nodes;
const getChildrenNames = (node) => {
    if (!node.children) return '';
    return node.children.map(i => nodes[i].name || `unnamed_${i}`).join(', ');
};

nodes.forEach((node, index) => {
  if (node.name && (node.name.toLowerCase().includes('gula') || node.name.toLowerCase().includes('kamb') || node.name.includes('Poin') || node.name.includes('Pendopo') || node.name.includes('Material') || node.name.includes('Cylinder') || node.name.includes('Cube'))) {
    console.log(`Node ${index}: ${node.name} | Children: [${getChildrenNames(node)}]`);
  }
});

console.log("\nFull Tree:");
function printTree(nodeIdx, indent) {
    const node = nodes[nodeIdx];
    console.log(indent + (node.name || `unnamed_${nodeIdx}`));
    if (node.children) {
        node.children.forEach(c => printTree(c, indent + "  "));
    }
}
gltf.scenes[gltf.scene || 0].nodes.forEach(n => printTree(n, ""));
