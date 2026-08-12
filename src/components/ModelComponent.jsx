import React from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

function Model({ onMarkerClick }) {
  const { gl } = useThree();
  const { scene } = useGLTF('/mapsgardu.glb', undefined, undefined, (loader) => {
    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath('https://unpkg.com/three@0.185.1/examples/jsm/libs/basis/')
      .detectSupport(gl);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

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
