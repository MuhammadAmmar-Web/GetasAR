const fs = require('fs');
const data = fs.readFileSync('public/mapsgardu.glb');
const chunkLength = data.readUInt32LE(12);
const jsonString = data.toString('utf8', 20, 20 + chunkLength);
fs.writeFileSync('gardu_meta.json', jsonString);
