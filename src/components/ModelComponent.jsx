import React from 'react';
import { useGLTF } from '@react-three/drei';

function Model({ onMarkerClick }) {
  const { scene } = useGLTF('/mapsgardu.glb');

  const resolvePoiKey = (object) => {
    let node = object;
    while (node) {
      if (node.name) {
        if (node.name.includes('Pendopo')) return 'Pendopo';
        const match = node.name.match(/Poin.*?(\d+)/);
        if (match) {
          // Normalise ke format "Poin.001", "Poin.002", dst.
          const num = parseInt(match[1], 10);
          return `Poin.${String(num).padStart(3, '0')}`;
        }
      }
      node = node.parent;
    }
    return null;
  };

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        const poiKey = resolvePoiKey(e.object);
        if (poiKey) onMarkerClick(poiKey);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        const poiKey = resolvePoiKey(e.object);
        if (poiKey) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

export default Model;
