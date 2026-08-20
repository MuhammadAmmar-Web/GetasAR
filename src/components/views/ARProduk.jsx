import React, { useEffect, useRef, useState } from 'react';
import 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';
import { ScanLine, X } from 'lucide-react';

const ARProduk = ({ setActiveTab }) => {
  const containerRef = useRef(null);
  const startedRef = useRef(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Guard agar kamera/MindAR hanya start satu kali
    if (startedRef.current) return;
    startedRef.current = true;

    // Inisialisasi MindAR
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: containerRef.current,
      imageTargetSrc: '/targets.mind',
      uiLoading: 'no',
      uiScanning: 'no',
    });

    const { renderer } = mindarThree;

    // Helper untuk membuat Video Texture di Three.js
    const createVideoOverlay = (videoPath) => {
      // 1. Buat elemen HTML Video (tanpa src — video hanya diunduh saat marker dipindai)
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true; // WAJIB muted agar autoplay di HP/browser berjalan lancar
      video.playsInline = true; // WAJIB untuk iOS / Safari
      video.setAttribute('playsinline', '');
      video.preload = 'none'; // Hindari mengunduh 7,7MB video sebelum benar-benar dipindai

      // 2. Masukkan video ke dalam VideoTexture Three.js
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace; // Warna benar di three.js modern
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // 3. Tandai texture perlu update saat video mulai diputar
      video.addEventListener('playing', () => {
        texture.needsUpdate = true;
      });

      // PlaneGeometry dengan rasio 16:9 (lebar 1, tinggi 0.5625)
      const geometry = new THREE.PlaneGeometry(1, 0.5625);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);

      const play = () => {
        if (!video.getAttribute('src')) {
          video.src = videoPath;
          video.load();
        }
        const promise = video.play();
        if (promise) promise.catch(() => {});
      };

      return { mesh, video, texture, play };
    };

    // --- Index 0: Kopi Gempol ---
    const anchorKopi = mindarThree.addAnchor(0);
    const kopi = createVideoOverlay('/video/kopigempol.mp4');
    anchorKopi.group.add(kopi.mesh);

    anchorKopi.onTargetFound = () => {
      setActiveProduct('Kopi Gempol');
      kopi.play(); // Putar video saat QR terdeteksi
    };
    anchorKopi.onTargetLost = () => {
      setActiveProduct(null);
      kopi.video.pause(); // Hentikan video saat QR hilang
    };

    // --- Index 1: Susu Kambing ---
    const anchorSusu = mindarThree.addAnchor(1);
    const susu = createVideoOverlay('/video/susu%20kambing.mp4');
    anchorSusu.group.add(susu.mesh);

    anchorSusu.onTargetFound = () => {
      setActiveProduct('Susu Kambing');
      susu.play();
    };
    anchorSusu.onTargetLost = () => {
      setActiveProduct(null);
      susu.video.pause();
    };

    // --- Index 2: Kolang Kaling ---
    const anchorKolang = mindarThree.addAnchor(2);
    const kolang = createVideoOverlay('/video/kolang%20kaling.mp4');
    anchorKolang.group.add(kolang.mesh);

    anchorKolang.onTargetFound = () => {
      setActiveProduct('Kolang Kaling');
      kolang.play();
    };
    anchorKolang.onTargetLost = () => {
      setActiveProduct(null);
      kolang.video.pause();
    };

    // --- Index 3: Gula Aren ---
    const anchorGulaAren = mindarThree.addAnchor(3);
    const gulaAren = createVideoOverlay('/video/gula%20aren.mp4');
    anchorGulaAren.group.add(gulaAren.mesh);

    anchorGulaAren.onTargetFound = () => {
      setActiveProduct('Gula Aren');
      gulaAren.play();
    };
    anchorGulaAren.onTargetLost = () => {
      setActiveProduct(null);
      gulaAren.video.pause();
    };

    let isUnmounted = false;

    // Jalankan MindAR Engine
    const startAR = async () => {
      try {
        await mindarThree.start();
        if (isUnmounted) {
          mindarThree.stop();
          return;
        }
        renderer.setAnimationLoop(() => {
          renderer.render(mindarThree.scene, mindarThree.camera);
        });
      } catch (err) {
        console.error("MindAR gagal jalan:", err);
      }
    };
    startAR();

    // Cleanup saat komponen ditutup/pindah halaman
    return () => {
      isUnmounted = true;
      kopi.video.pause();
      susu.video.pause();
      kolang.video.pause();
      gulaAren.video.pause();
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
      mindarThree.stop();

      // Bersihkan sisa elemen DOM MindAR jika tersangkut
      setTimeout(() => {
        const overlay = document.querySelector('.mindar-ui-overlay');
        if (overlay) overlay.remove();

        // Hapus elemen video background dari body jika masih ada
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
          // MindAR video feed is usually appended to body or container
          if (!v.src || v.src === '') {
            // Stop stream
            const stream = v.srcObject;
            if (stream && stream.getTracks) {
              stream.getTracks().forEach(track => track.stop());
            }
            v.remove();
          }
        });
      }, 100);
    };
  }, []);

  return (
    <main className="fixed inset-0 z-[100] flex justify-center items-center bg-black w-screen h-screen overflow-hidden">
      {/* Tombol Back */}
      <button 
        onClick={() => setActiveTab('peta-desa')}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 border border-white/20 shadow-lg transition-all"
      >
        <X size={20} />
      </button>

      {/* Viewport AR Kamera */}
      <div id="ar-container" ref={containerRef} className="absolute inset-0 w-full h-full z-0">
        <style>
          {`
            /* Force MindAR video and canvas to completely fill the screen without black borders */
            #ar-container video,
            #ar-container canvas {
              width: 100vw !important;
              height: 100vh !important;
              object-fit: cover !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              margin: 0 !important;
              transform: none !important;
            }
          `}
        </style>
      </div>

      {/* Overlay UI Glass Panel */}
      {!activeProduct && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
          <style>
            {`
              @keyframes scan {
                0% { top: 5%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 95%; opacity: 0; }
              }
              .animate-scan-line {
                animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}
          </style>

          {/* Area Scanner */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 mt-12 md:mt-0">
            {/* Sudut Brackets */}
            <div className="absolute w-10 h-10 border-4 border-blue-500 top-0 left-0 border-r-0 border-b-0 rounded-tl-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute w-10 h-10 border-4 border-blue-500 top-0 right-0 border-l-0 border-b-0 rounded-tr-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute w-10 h-10 border-4 border-blue-500 bottom-0 left-0 border-r-0 border-t-0 rounded-bl-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute w-10 h-10 border-4 border-blue-500 bottom-0 right-0 border-l-0 border-t-0 rounded-br-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>

            {/* Animasi Garis Scan */}
            <div className="absolute left-2 right-2 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-scan-line"></div>
          </div>

          {/* Info Panel Bawah */}
          <div className="glass-panel p-5 md:p-6 text-center w-full max-w-sm rounded-2xl backdrop-blur-md bg-card/90 border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.05)] pointer-events-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <ScanLine size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg md:text-xl text-slate-900 font-bold m-0 text-left">Scan QR Produk</h2>
            </div>
            <p className="text-[13px] md:text-sm text-slate-600 m-0 text-left leading-relaxed">
              Arahkan kamera pas ke dalam kotak agar otomatis memutar video penjelasan dari produk UMKM Desa Getas.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default ARProduk;