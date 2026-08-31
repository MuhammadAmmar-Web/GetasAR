import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { ScanLine, X, MapPin, Clock, Map as MapIcon, Info, HelpCircle, Hand } from 'lucide-react';

// POI Images
import genting from './assets/genting.jpg';
import truko from './assets/truko.jpg';
import bleder from './assets/Bleder.jpg';
import getas from './assets/Getas.jpg';
import mambang from './assets/Mambang.jpg';
import seklotok from './assets/Sekolotok.jpg';
import jolinggo from './assets/Jolinggo.jpg';
import banjaran from './assets/Banjaran.jpg';
import metep from './assets/Metep.jpg';

const poiData = {
  "Pendopo": { title: "Dusun Genting", category: "Wisata Tubing", hours: "08.00 - 16.00 WIB", location: "Dusun Genting, Desa Getas", shortDesc: "Wisata susur sungai menggunakan ban dalam dengan pemandangan pedesaan yang asri.", longDesc: ["Tubing Genting menawarkan pengalaman wisata air susur sungai yang seru menggunakan ban dalam (tube). Jalur tubing ini melintasi sungai dengan air yang jernih dan arus yang bervariasi, sangat cocok untuk menguji adrenalin Anda.", "Selama pengarungan, pengunjung akan dimanjakan dengan pemandangan tebing sungai yang eksotis, pepohonan rindang, dan suasana alam yang masih sangat alami.", "Keamanan pengunjung terjamin dengan adanya pemandu lokal yang berpengalaman serta fasilitas perlengkapan standar seperti helm dan pelampung. Fasilitas bilas dan warung makan juga tersedia di sekitar area finish."], image: genting },
  "Poin001": { title: "Dusun Banjaran", category: "Gerbang Desa", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Berperan strategis sebagai gerbang penghubung utama ke wilayah Desa Getas.", longDesc: ["Dusun Banjaran berlokasi strategis di pintu masuk wilayah, menjadikannya sebagai gerbang utama dan jalur penghubung penting antara Desa Getas dengan daerah-daerah luar di sekitarnya.", "Karena posisinya yang strategis tersebut, mobilitas masyarakat dan roda ekonomi di dusun ini terbilang cukup dinamis, menjadikannya titik perlintasan utama bagi warga maupun pengunjung."], image: banjaran },
  "Poin002": { title: "Dusun Metep", category: "Lanskap Alam", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Kawasan persawahan yang subur dengan sistem irigasi alami yang asri.", longDesc: ["Dusun Metep menyuguhkan bentang alam berupa hamparan sawah yang sangat hijau dan asri. Keistimewaan dusun ini terletak pada sistem irigasi alaminya yang sangat terjaga kelestariannya.", "Aliran air dari mata air pegunungan langsung mengairi lahan-lahan pertanian warga, menjadikan Dusun Metep sebagai salah satu lumbung pangan lokal yang produktif sekaligus menyuguhkan lanskap pemandangan yang indah."], image: metep },
  "Poin003": { title: "Dusun Bleder", category: "Kawasan Hijau", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Kawasan hijau yang didominasi oleh area perkebunan yang sejuk dan tenang.", longDesc: ["Dusun Bleder adalah representasi kawasan hijau di Desa Getas. Wilayah ini didominasi oleh area perkebunan yang rimbun, memberikan suasana yang sejuk, tenang, serta udara yang sangat segar bebas polusi.", "Masyarakat Dusun Bleder mengelola berbagai tanaman perkebunan yang menjadi sumber penghidupan utama, sekaligus bertindak sebagai penjaga keseimbangan ekosistem alam di sekitar tempat tinggal mereka."], image: bleder },
  "Poin004": { title: "Dusun Sanggar", category: "Komoditas Kopi", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Sentra komoditas penghasil biji kopi pilihan jenis Robusta dan Excelsa.", longDesc: ["Bagi para pecinta kopi, Dusun Sanggar adalah tempat yang istimewa. Kondisi geografis dan ketinggian dusun ini sangat ideal untuk perkebunan kopi, khususnya untuk budidaya kopi jenis Robusta dan Excelsa.", "Kopi dari Dusun Sanggar memiliki cita rasa dan aroma khas yang kuat. Proses pasca-panen yang dilakukan oleh petani lokal secara tekun menghasilkan biji kopi berkualitas tinggi yang siap dipasarkan."], image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  "Poin005": { title: "Dusun Getas", category: "Pusat Pemerintahan", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Merupakan pusat pemerintahan desa dan sentra penghasil madu hutan alami.", longDesc: ["Sebagai induk pemerintahan, Dusun Getas menjadi pusat administrasi dan kegiatan kemasyarakatan dari seluruh wilayah desa. Fasilitas-fasilitas utama desa sebagian besar terpusat di kawasan ini.", "Selain peran administratifnya yang penting, Dusun Getas juga sangat terkenal sebagai basis penghasil madu hutan alami. Para pencari madu mengumpulkan madu murni dari kawasan hutan sekitar yang dipercaya memiliki khasiat tinggi bagi kesehatan."], image: getas },
  "Poin006": { title: "Dusun Truko", category: "Budaya & Peternakan", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Terkenal dengan pengelolaan peternakan modern dan kesenian Kuda Lumping.", longDesc: ["Dusun Truko memadukan kemajuan ekonomi peternakan dan kelestarian budaya tradisional dengan sangat baik. Di sektor ekonomi, dusun ini dikelola dengan peternakan yang mulai mengadopsi standar modern.", "Di sisi lain, Dusun Truko sangat teguh memegang tradisi kesenian daerah, khususnya kesenian Kuda Lumping. Kelompok kesenian di dusun ini secara rutin mengadakan pementasan dan regenerasi untuk melestarikan budaya."], image: truko },
  "Poin007": { title: "Dusun Jolinggo", category: "Sentra Perkebunan", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Dikenal secara luas sebagai pusat penghasil dan pengolahan kolang kaling.", longDesc: ["Dusun Jolinggo merupakan sentra utama pengolahan dan penghasil kolang kaling di wilayah ini. Memanfaatkan melimpahnya pohon aren di sekitar dusun, masyarakat mengolah buah aren menjadi kolang kaling bernilai ekonomis tinggi.", "Proses pengolahan kolang kaling di Dusun Jolinggo masih banyak dilakukan dengan cara tradisional untuk mempertahankan kualitas, tekstur, dan cita rasa alami yang menjadikannya sebagai komoditas unggulan."], image: jolinggo },
  "Poin008": { title: "Dusun Mambang", category: "Pertanian & Sejarah", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Menyimpan sejarah perpaduan kebudayaan pertanian masa lampau dan penyebaran agama Islam.", longDesc: ["Dusun Mambang dikenal sebagai wilayah yang kaya akan catatan Sejarah Pertanian dan perkembangan Islam. Jejak-jejak penyebaran agama di dusun ini berakulturasi dengan budaya agraris masyarakat setempat secara harmonis.", "Pertanian di Dusun Mambang bukan hanya sekadar mata pencaharian, tetapi juga bagian dari nilai-nilai filosofis kehidupan masyarakat yang terus dijaga kelestariannya secara turun-temurun."], image: mambang },
  "Poin009": { title: "Dusun Skolotok", category: "Sejarah & Religi", hours: "08.00 - 16.00 WIB", location: "Desa Getas", shortDesc: "Terkenal dengan sejarah religi dan tradisi 'Takir' yang kental dipertahankan warga.", longDesc: ["Dusun Skolotok memiliki keunikan yang kuat pada nilai-nilai sejarah dan religius masyarakatnya. Salah satu tradisi yang masih sangat dilestarikan adalah tradisi Takir.", "Tradisi ini merupakan warisan leluhur yang sarat akan makna spiritual dan kebersamaan warga. Dalam setiap acara adat atau keagamaan, warga saling bahu membahu menyiapkan wadah takir, yang menjadi simbol rasa syukur dan kerukunan antar sesama."], image: seklotok }
};

const ARFallback = ({ setActiveTab }) => {
  const containerRef = useRef(null);
  const startedRef = useRef(false);

  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isMarkerFound, setIsMarkerFound] = useState(false);
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem('arFallbackHasSeenGuide'));
  const [showAbout, setShowAbout] = useState(false);

  // Menyimpan ref HTML buttons agar bisa diupdate posisinya tanpa re-render React (demi performa 60fps)
  const markerRefs = useRef({});

  useEffect(() => {
    if (!containerRef.current) return;
    if (startedRef.current) return;
    startedRef.current = true;

    // Inisialisasi MindAR dengan Filter Penstabil (Smooth Tracking)
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: containerRef.current,
      imageTargetSrc: "/targets.mind",
      uiLoading: "no",
      uiScanning: "no",
      filterMinCF: 0.0001, // Semakin kecil, semakin stabil (mengurangi getaran)
      filterBeta: 0.001,   // Semakin kecil, semakin lambat/stabil
    });

    const { renderer, scene, camera } = mindarThree;

    // Setup Loaders (KTX2, DRACO, Meshopt)
    const ktx2Loader = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const glbLoader = new GLTFLoader();
    glbLoader.setKTX2Loader(ktx2Loader);
    glbLoader.setDRACOLoader(dracoLoader);

    MeshoptDecoder.ready.then(() => {
      glbLoader.setMeshoptDecoder(MeshoptDecoder);
    });

    // Index 4 adalah target map-marker.png
    const anchorMap = mindarThree.addAnchor(4);

    // Group utama AR (dikelola oleh MindAR)
    const group = new THREE.Group();
    anchorMap.group.add(group);

    // Group konten (untuk animasi hologram tanpa diganggu MindAR)
    const contentGroup = new THREE.Group();
    group.add(contentGroup);

    // Tambahkan Pencahayaan agar model tidak gelap gulita
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x4a5a3a, 0.8);
    scene.add(hemisphereLight);

    const poiMeshes = {};

    anchorMap.onTargetFound = () => {
      setIsMarkerFound(true);
    };
    anchorMap.onTargetLost = () => {
      setIsMarkerFound(false);
      // Sembunyikan semua HTML marker saat target hilang
      Object.values(markerRefs.current).forEach((el) => {
        if (el) el.style.display = 'none';
      });
    };

    // DEBUG: Tambahkan Kotak Merah untuk memastikan tracking gambar bekerja meskipun peta gagal dimuat
    const debugBox = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    debugBox.position.set(0, 0, 0);
    contentGroup.add(debugBox);

    // Muat 3D Map Model
    let loadedModel = null;
    glbLoader.load("/mapsgardu.glb", (gltf) => {
      console.log("Peta 3D berhasil dimuat!", gltf);
      // Hapus kotak debug merah setelah peta sukses dimuat
      contentGroup.remove(debugBox);

      const model = gltf.scene;
      loadedModel = model; // Simpan referensi untuk animasi

      // Gunakan skala 0.1 agar tidak terlalu besar
      model.scale.set(0.05, 0.05, 0.05);

      // Putar 90 derajat sumbu X agar peta (yang di file asli rata di bidang X-Z,
      // dengan tinggi bangunan di sumbu Y) rebah pas di bidang X-Y target MindAR,
      // dengan tinggi bangunan menghadap ke sumbu Z (keluar dari kertas / ke arah kamera)
      model.rotation.set(Math.PI / 2, 0, 0);
      model.position.set(0, 0, 0);

      contentGroup.add(model);

      // ── FIX POSISI ──────────────────────────────────────────────
      // File mapsgardu.glb punya bounding box yang TIDAK center di origin.
      // Tanpa koreksi, peta akan tergeser dari tengah marker dan sedikit
      // "melayang" di atas kertas alih-alih menempel rata.
      // Hitung ulang bounding box SETELAH rotasi & scale diterapkan,
      // lalu geser model supaya center di X/Y dan alasnya pas di Z=0.
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      model.position.x -= center.x;   // center-kan sumbu X (kiri-kanan marker)
      model.position.y -= center.y;   // center-kan sumbu Y (atas-bawah marker, masih dalam bidang kertas)
      model.position.z -= box.min.z;  // tempelkan alas model persis di permukaan kertas (Z=0)
      model.updateMatrixWorld(true);  // wajib refresh matrix setelah posisi berubah, sebelum dipakai di bawah
      // ─────────────────────────────────────────────────────────────

      // ── FIX HOTSPOT / POI ───────────────────────────────────────
      // Node POI di GLB ini pakai format "Poin001" s/d "Poin009" (TANPA titik) dan
      // "Pendopo". "Curve012"/"Curve014_x" adalah jalur/path — bukan POI, diabaikan.
      // "Cube002_x" adalah detail arsitektur Pendopo — otomatis ketemu lewat parent.
      const findPoiGroup = (node) => {
        let current = node;
        do {
          if (current.name === 'Pendopo') return { key: 'Pendopo', groupNode: current };
          const match = current.name && current.name.match(/^Poin(\d+)$/);
          // PENTING: key HARUS "Poin001" (tanpa titik) supaya cocok dengan
          // key di poiData dan dengan markerRefs.current[key] di HTML overlay.
          if (match) return { key: `Poin${match[1].padStart(3, '0')}`, groupNode: current };
          current = current.parent;
        } while (current);
        return null;
      };

      const poiGroups = [];
      model.traverse((node) => {
        if (!node.isMesh) return;
        const found = findPoiGroup(node);
        if (found && !poiGroups.includes(found.groupNode)) {
          poiGroups.push(found.groupNode);
        }
      });

      poiGroups.forEach((groupNode) => {
        const found = findPoiGroup(groupNode);
        if (!found || poiMeshes[found.key]) return;

        // Hitung posisi WORLD dari bounding box grup utuh (bukan cuma 1 sub-mesh),
        // supaya pin jatuh di tengah objek — penting untuk "Pendopo" yang tersusun
        // dari banyak sub-mesh (dinding, atap, dll).
        const worldBox = new THREE.Box3().setFromObject(groupNode);
        const worldCenter = worldBox.getCenter(new THREE.Vector3());

        // PENTING: markerRef di-parent ke `model` (BUKAN ke `scene`), dan posisi
        // world dikonversi dulu ke local space `model` lewat worldToLocal().
        // Dengan begitu markerRef ikut bergerak setiap frame mengikuti transform
        // anchor MindAR (saat kertas/kamera digerakkan) — bukan beku di posisi
        // statis saat model pertama kali dimuat.
        const localCenter = model.worldToLocal(worldCenter.clone());

        const markerRef = new THREE.Object3D();
        markerRef.position.copy(localCenter);

        model.add(markerRef);
        poiMeshes[found.key] = markerRef;
      });

      console.log('POI berhasil dipetakan:', Object.keys(poiMeshes));
      const missing = Object.keys(poiData).filter((k) => !poiMeshes[k]);
      if (missing.length > 0) {
        console.warn('⚠️ POI berikut TIDAK ditemukan di model 3D:', missing);
      }
      // ─────────────────────────────────────────────────────────────

      // Cari koordinat asli setiap dusun dari dalam file 3D
    }, undefined, (error) => {
      console.error("Gagal memuat peta 3D mapsgardu.glb:", error);
      alert("Error: Peta 3D gagal dimuat. Cek console untuk detailnya.");
    });

    let isUnmounted = false;
    const tempV = new THREE.Vector3();

    const startAR = async () => {
      try {
        await mindarThree.start();
        if (isUnmounted) {
          mindarThree.stop();
          return;
        }
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);

          // Update posisi HTML POI buttons mengikuti 3D Mesh
          if (anchorMap.group.visible) {
            Object.entries(poiMeshes).forEach(([key, mesh]) => {
              const element = markerRefs.current[key];
              if (!element) return;

              mesh.getWorldPosition(tempV);
              tempV.project(camera);

              if (tempV.z <= 1) {
                const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                element.style.display = 'flex';
              } else {
                element.style.display = 'none';
              }
            });
          }
        });
      } catch (err) {
        console.error("MindAR gagal jalan:", err);
      }
    };
    startAR();

    return () => {
      isUnmounted = true;
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
      mindarThree.stop();

      setTimeout(() => {
        const overlay = document.querySelector('.mindar-ui-overlay');
        if (overlay) overlay.remove();
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
          if (!v.src || v.src === '') {
            const stream = v.srcObject;
            if (stream && stream.getTracks) stream.getTracks().forEach(track => track.stop());
            v.remove();
          }
        });
      }, 100);
    };
  }, []);

  const handleMarkerClick = useCallback((key) => {
    const data = poiData[key];
    if (!data) return;
    setSelectedPoi({ key, ...data });
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

      {/* Tombol Info Tambahan */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex gap-3">
        <button
          onClick={() => { setShowAbout(true); setShowGuide(false); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/20 shadow-lg text-xs md:text-sm cursor-pointer"
        >
          <Info size={16} /> <span className="font-medium">Tentang</span>
        </button>
        <button
          onClick={() => { setShowGuide(true); setShowAbout(false); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/20 shadow-lg text-xs md:text-sm cursor-pointer"
        >
          <HelpCircle size={16} /> <span className="font-medium">Panduan</span>
        </button>
      </div>

      {/* Viewport AR Kamera */}
      <div id="ar-container" ref={containerRef} className="absolute inset-0 w-full h-full z-0">
        <style>
          {`
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

      {/* Overlay POI HTML Markers (Kotak Transparan / Invisible Hitbox) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {Object.entries(poiData).map(([key, data]) => (
          <button
            key={key}
            ref={(el) => (markerRefs.current[key] = el)}
            onClick={(e) => { e.stopPropagation(); handleMarkerClick(key); }}
            className="group absolute hidden flex-col items-center justify-center z-30 pointer-events-auto w-16 h-16 cursor-pointer opacity-0"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {/* Tombol 100% transparan, area klik tetap aktif */}
          </button>
        ))}
      </div>

      {/* Overlay UI Glass Panel (Garis Scanner) */}
      {!isMarkerFound && !showGuide && !showAbout && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
          <style>
            {`
              @keyframes scan { 0% { top: 5%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 95%; opacity: 0; } }
              .animate-scan-line { animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
            `}
          </style>

          {/* Area Scanner */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 mt-12 md:mt-0">
            <div className="absolute w-10 h-10 border-4 border-blue-500 top-0 left-0 border-r-0 border-b-0 rounded-tl-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute w-10 h-10 border-4 border-blue-500 top-0 right-0 border-l-0 border-b-0 rounded-tr-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute w-10 h-10 border-4 border-blue-500 bottom-0 left-0 border-r-0 border-t-0 rounded-bl-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute w-10 h-10 border-4 border-blue-500 bottom-0 right-0 border-l-0 border-t-0 rounded-br-[12px] shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
            <div className="absolute left-2 right-2 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-scan-line"></div>
          </div>

          {/* Info Panel Bawah */}
          <div className="glass-panel p-5 md:p-6 text-center w-full max-w-sm rounded-2xl backdrop-blur-md bg-white/90 border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.05)] pointer-events-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <ScanLine size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg md:text-xl text-slate-900 font-bold m-0 text-left">Pindai Peta Kertas</h2>
            </div>
            <p className="text-[13px] md:text-sm text-slate-600 m-0 text-left leading-relaxed">
              Arahkan kamera ke penanda gambar untuk menampilkan peta 3D Desa Getas di dunia nyata.
            </p>
          </div>
        </div>
      )}

      {/* ─────────────── POI Detail Card ─────────────── */}
      {selectedPoi && !showDetail && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2 w-[90%] max-w-[320px] z-30 animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          <div className="rounded-2xl bg-white/97 backdrop-blur-xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="w-full h-36 bg-cover bg-center relative" style={{ backgroundImage: `url('${selectedPoi.image}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <button
                onClick={() => setSelectedPoi(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{selectedPoi.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedPoi.category}</p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-600 mb-4 line-clamp-2">{selectedPoi.shortDesc}</p>

              <div className="flex flex-col gap-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <MapIcon size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-400 w-16 shrink-0">Lokasi</span>
                  <span className="text-slate-700 font-medium">{selectedPoi.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-400 w-16 shrink-0">Jam Buka</span>
                  <span className="text-slate-700 font-medium">{selectedPoi.hours}</span>
                </div>
              </div>

              <button
                onClick={() => setShowDetail(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-600/25"
              >
                Lihat Detail →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── Long Detail Modal ─────────────── */}
      {showDetail && selectedPoi && (
        <div
          className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 md:h-64 shrink-0 bg-slate-200">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${selectedPoi.image}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <button
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <MapPin size={16} />
                <span className="font-semibold text-sm">{selectedPoi.location}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{selectedPoi.title}</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold">{selectedPoi.category}</span>
                <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border border-slate-100">
                  <Clock size={12} /> {selectedPoi.hours}
                </span>
              </div>
              <div className="text-slate-600 text-[15px] leading-relaxed flex flex-col gap-4">
                {selectedPoi.longDesc.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── Guide Modal ─────────────── */}
      {showGuide && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-slate-30/30 backdrop-blur-md pointer-events-auto">
          <div className="glass-panel relative w-full max-w-[400px] p-8 flex flex-col items-center text-center shadow-xl border border-slate-200 bg-white animate-in fade-in zoom-in-95 duration-300">

            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <HelpCircle size={32} className="text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Cara Menjelajahi Peta AR </h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Jelajahi potensi desa secara interaktif dengan teknologi Augmented Reality
            </p>

            <div className="flex flex-col gap-6 w-full text-left mb-8">
              {[
                { icon: ScanLine, title: 'Temukan Gambar Penanda', desc: 'Cari dan temukan gambar penanda khusus yang telah dipasang di area tempat wisata.' },
                { icon: MapPin, title: 'Pindai Penanda', desc: 'Arahkan kamera HP ke gambar penanda secara perlahan hingga peta muncul' },
                { icon: Hand, title: 'Jelajahi Potensi', desc: 'Setelah peta 3D muncul, ketuk obejek 3D yang muncul untuk melihat informasi potensi setiap Dusun.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm mb-1">{title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowGuide(false);
                localStorage.setItem('arFallbackHasSeenGuide', 'true');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Mulai Jelajah
            </button>
          </div>
        </div>
      )}

      {/* ─────────────── About Modal ─────────────── */}
      {showAbout && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-slate-30/30 backdrop-blur-md pointer-events-auto">
          <div className="glass-panel relative w-full max-w-[400px] p-8 flex flex-col items-center text-center shadow-xl border border-slate-200 bg-white animate-in fade-in zoom-in-95 duration-300">

            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <Info size={32} className="text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tentang Aplikasi</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Visualisasi AR Peta Desa Getas.
            </p>

            <div className="flex flex-col gap-4 text-left w-full mb-6">
              <p className="text-slate-600 text-xs leading-relaxed">
                <strong className="text-slate-900">Getas AR Peta (Image Tracking)</strong> adalah sistem visualisasi berbasis teknologi <span className="text-blue-600 font-semibold">Augmented Reality (AR)</span> yang memetakan batas wilayah dan potensi setiap Dusun secara langsung dari web browser.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3 text-xs w-full">
                {[
                  ['Karya', 'PPK ORMAWA BEM FIK UDINUS'],
                  ['Program', 'GARDU'],
                  ['Versi', '1.0.0 (MindAR-Three)'],
                  ['Tech Stack', 'MindAR, Three.js, React'],
                  ['Tahun', '2026'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-start border-b border-slate-100 last:border-0 pb-1.5 last:pb-0 gap-2">
                    <span className="text-slate-500 font-semibold shrink-0">{label}</span>
                    <span className="text-slate-800 font-bold text-right leading-tight">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAbout(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ARFallback;