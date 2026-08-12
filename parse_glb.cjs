const fs = require('fs');

function parseGLB(path) {
  const data = fs.readFileSync(path);
  const magic = data.toString('utf8', 0, 4);
  if (magic !== 'glTF') throw new Error('Not a GLB');
  
  const version = data.readUInt32LE(4);
  const length = data.readUInt32LE(8);
  
  const chunkLength = data.readUInt32LE(12);
  const chunkType = data.toString('utf8', 16, 20);
  
  if (chunkType !== 'JSON') throw new Error('First chunk not JSON');
  
  const jsonString = data.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonString);
  
  const nodes = json.nodes.map(n => n.name).filter(Boolean);
  console.log('Nodes found:');
  console.log(nodes.join('\n'));
}

parseGLB('d:/KULIAH/WebAR/public/mapsgardu.glb');
