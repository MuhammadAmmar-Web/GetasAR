const fs = require('fs');
const data = fs.readFileSync('public/mapsgardu.glb', 'latin1');
const matches = [...data.matchAll(/"name":"([^"]+)"/g)].map(m => m[1]);
console.log([...new Set(matches)]);
