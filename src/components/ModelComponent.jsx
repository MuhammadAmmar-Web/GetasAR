import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import * as THREE from 'three';

function Model({ onMarkerClick, onCoordinatesLoaded }) {
  const gl = useThree((state) => state.gl);
  const ktx2Loader = useMemo(
    () => new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl),
    [gl]
  );
  // mapsgardu.glb memakai kompresi EXT_meshopt_compression + tekstur
  // KHR_texture_basisu (KTX2). Drei hanya menyetel MeshoptDecoder secara
  // default, jadi KTX2Loader perlu dilampirkan agar tekstur ter-decode.
  const { scene } = useGLTF('/mapsgardu.glb', true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader);
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

  useEffect(() => {
    if (!scene || !onCoordinatesLoaded) return;
    const coords = {};
    const box = new THREE.Box3();
    const center = new THREE.Vector3();

    scene.traverse((node) => {
      const key = resolvePoiKey(node);
      if (key && node.isMesh && !coords[key]) {
        box.setFromObject(node);
        box.getCenter(center);
        coords[key] = { x: center.x, y: center.y, z: center.z };
      }
    });
    
    // Kirim koordinat ke MainContent
    onCoordinatesLoaded(coords);
  }, [scene, onCoordinatesLoaded]);

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
