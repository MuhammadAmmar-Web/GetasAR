import React, { useState, Suspense, useRef, lazy, useEffect, useCallback } from 'react';
import '@google/model-viewer';
import {
  ScanLine,
  Map as MapIcon, X, MapPin, Clock, Info, List
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import LazyBackground from './LazyBackground';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import logoppko from '../assets/logoppko.png';
import genting from '../assets/genting.jpg';
import truko from '../assets/truko.jpg';

// Lazy import di MODULE SCOPE — mencegah model reload saat state berubah
const LazyModel = lazy(() => import('./ModelComponent'));
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
        {progress.toFixed(0)} % loaded
      </div>
    </Html>
  );
}


const poiData = {
  "Pendopo": {
    title: "Dusun Genting",
    category: "Wisata Tubing",
    hours: "08.00 - 16.00 WIB",
    location: "Dusun Genting, Desa Getas",
    shortDesc: "Wisata susur sungai menggunakan ban dalam dengan pemandangan pedesaan yang asri.",
    longDesc: [
      "Tubing Genting menawarkan pengalaman wisata air susur sungai yang seru menggunakan ban dalam (tube). Jalur tubing ini melintasi sungai dengan air yang jernih dan arus yang bervariasi, sangat cocok untuk menguji adrenalin Anda.",
      "Selama pengarungan, pengunjung akan dimanjakan dengan pemandangan tebing sungai yang eksotis, pepohonan rindang, dan suasana alam yang masih sangat alami.",
      "Keamanan pengunjung terjamin dengan adanya pemandu lokal yang berpengalaman serta fasilitas perlengkapan standar seperti helm dan pelampung. Fasilitas bilas dan warung makan juga tersedia di sekitar area finish."
    ],
    image: genting
  },
  "Poin.001": {
    title: "Dusun Skolotok",
    category: "Sejarah & Religi",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Terkenal dengan sejarah religi dan tradisi 'Takir' yang kental dipertahankan warga.",
    longDesc: [
      "Dusun Skolotok memiliki keunikan yang kuat pada nilai-nilai sejarah dan religius masyarakatnya. Salah satu tradisi yang masih sangat dilestarikan adalah tradisi Takir.",
      "Tradisi ini merupakan warisan leluhur yang sarat akan makna spiritual dan kebersamaan warga. Dalam setiap acara adat atau keagamaan, warga saling bahu membahu menyiapkan wadah takir, yang menjadi simbol rasa syukur dan kerukunan antar sesama."
    ],
    image: "https://images.unsplash.com/photo-1542314831-c6a4d14eb8a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.002": {
    title: "Dusun Mambang",
    category: "Pertanian & Sejarah",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Menyimpan sejarah perpaduan kebudayaan pertanian masa lampau dan penyebaran agama Islam.",
    longDesc: [
      "Dusun Mambang dikenal sebagai wilayah yang kaya akan catatan Sejarah Pertanian dan perkembangan Islam. Jejak-jejak penyebaran agama di dusun ini berakulturasi dengan budaya agraris masyarakat setempat secara harmonis.",
      "Pertanian di Dusun Mambang bukan hanya sekadar mata pencaharian, tetapi juga bagian dari nilai-nilai filosofis kehidupan masyarakat yang terus dijaga kelestariannya secara turun-temurun."
    ],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.003": {
    title: "Dusun Jolinggo",
    category: "Sentra Perkebunan",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Dikenal secara luas sebagai pusat penghasil dan pengolahan kolang kaling.",
    longDesc: [
      "Dusun Jolinggo merupakan sentra utama pengolahan dan penghasil kolang kaling di wilayah ini. Memanfaatkan melimpahnya pohon aren di sekitar dusun, masyarakat mengolah buah aren menjadi kolang kaling bernilai ekonomis tinggi.",
      "Proses pengolahan kolang kaling di Dusun Jolinggo masih banyak dilakukan dengan cara tradisional untuk mempertahankan kualitas, tekstur, dan cita rasa alami yang menjadikannya sebagai komoditas unggulan."
    ],
    image: "https://images.unsplash.com/photo-1605557202138-7d8b51d5c317?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.004": {
    title: "Dusun Metep",
    category: "Lanskap Alam",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Kawasan persawahan yang subur dengan sistem irigasi alami yang asri.",
    longDesc: [
      "Dusun Metep menyuguhkan bentang alam berupa hamparan sawah yang sangat hijau dan asri. Keistimewaan dusun ini terletak pada sistem irigasi alaminya yang sangat terjaga kelestariannya.",
      "Aliran air dari mata air pegunungan langsung mengairi lahan-lahan pertanian warga, menjadikan Dusun Metep sebagai salah satu lumbung pangan lokal yang produktif sekaligus menyuguhkan lanskap pemandangan yang indah."
    ],
    image: "https://images.unsplash.com/photo-1590494496228-21d1b54c0e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.005": {
    title: "Dusun Getas",
    category: "Pusat Pemerintahan",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Merupakan pusat pemerintahan desa dan sentra penghasil madu hutan alami.",
    longDesc: [
      "Sebagai induk pemerintahan, Dusun Getas menjadi pusat administrasi dan kegiatan kemasyarakatan dari seluruh wilayah desa. Fasilitas-fasilitas utama desa sebagian besar terpusat di kawasan ini.",
      "Selain peran administratifnya yang penting, Dusun Getas juga sangat terkenal sebagai basis penghasil madu hutan alami. Para pencari madu mengumpulkan madu murni dari kawasan hutan sekitar yang dipercaya memiliki khasiat tinggi bagi kesehatan."
    ],
    image: "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.006": {
    title: "Dusun Getas",
    category: "Pusat Pemerintahan",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Merupakan pusat pemerintahan desa dan sentra penghasil madu hutan alami.",
    longDesc: [
      "Sebagai induk pemerintahan, Dusun Getas menjadi pusat administrasi dan kegiatan kemasyarakatan dari seluruh wilayah desa. Fasilitas-fasilitas utama desa sebagian besar terpusat di kawasan ini.",
      "Selain peran administratifnya yang penting, Dusun Getas juga sangat terkenal sebagai basis penghasil madu hutan alami. Para pencari madu mengumpulkan madu murni dari kawasan hutan sekitar yang dipercaya memiliki khasiat tinggi bagi kesehatan."
    ],
    image: "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.007": {
    title: "Dusun Jolinggo",
    category: "Sentra Perkebunan",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Dikenal secara luas sebagai pusat penghasil dan pengolahan kolang kaling.",
    longDesc: [
      "Dusun Jolinggo merupakan sentra utama pengolahan dan penghasil kolang kaling di wilayah ini. Memanfaatkan melimpahnya pohon aren di sekitar dusun, masyarakat mengolah buah aren menjadi kolang kaling bernilai ekonomis tinggi.",
      "Proses pengolahan kolang kaling di Dusun Jolinggo masih banyak dilakukan dengan cara tradisional untuk mempertahankan kualitas, tekstur, dan cita rasa alami yang menjadikannya sebagai komoditas unggulan."
    ],
    image: "https://images.unsplash.com/photo-1605557202138-7d8b51d5c317?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.008": {
    title: "Dusun Sanggar",
    category: "Komoditas Kopi",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Sentra komoditas penghasil biji kopi pilihan jenis Robusta dan Excelsa.",
    longDesc: [
      "Bagi para pecinta kopi, Dusun Sanggar adalah tempat yang istimewa. Kondisi geografis dan ketinggian dusun ini sangat ideal untuk perkebunan kopi, khususnya untuk budidaya kopi jenis Robusta dan Excelsa.",
      "Kopi dari Dusun Sanggar memiliki cita rasa dan aroma khas yang kuat. Proses pasca-panen yang dilakukan oleh petani lokal secara tekun menghasilkan biji kopi berkualitas tinggi yang siap dipasarkan."
    ],
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  "Poin.009": {
    title: "Dusun Banjaran",
    category: "Gerbang Desa",
    hours: "08.00 - 16.00 WIB",
    location: "Desa Getas",
    shortDesc: "Berperan strategis sebagai gerbang penghubung utama ke wilayah Desa Getas.",
    longDesc: [
      "Dusun Banjaran berlokasi strategis di pintu masuk wilayah, menjadikannya sebagai gerbang utama dan jalur penghubung penting antara Desa Getas dengan daerah-daerah luar di sekitarnya.",
      "Karena posisinya yang strategis tersebut, mobilitas masyarakat dan pergerakan roda ekonomi di dusun ini terbilang cukup dinamis, menjadikannya titik perlintasan utama bagi warga maupun pengunjung."
    ],
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
};

const MainContent = () => {
  const [showCard, setShowCard] = useState(false);
  const [showLongDetail, setShowLongDetail] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isARActive, setIsARActive] = useState(false);
  const [arSidebarOpen, setArSidebarOpen] = useState(true);
  const [arSelectedPoi, setArSelectedPoi] = useState(null);
  const modelViewerRef = useRef(null);

  const handleMarkerClick = useCallback((poiKey) => {
    const data = poiData[poiKey];
    if (!data) return;
    setSelectedPoi(data);
    setShowCard(true);
    setShowLongDetail(false);
  }, []);

  const activeData = selectedPoi || null;

  // Dengarkan event ar-status dari model-viewer
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    const handleARStatus = (e) => {
      if (e.detail.status === 'session-started') {
        setIsARActive(true);
        setArSidebarOpen(true);
        setArSelectedPoi(null);
      } else if (e.detail.status === 'not-presenting') {
        setIsARActive(false);
        setArSelectedPoi(null);
      }
    };
    mv.addEventListener('ar-status', handleARStatus);
    return () => mv.removeEventListener('ar-status', handleARStatus);
  }, []);

  const handleARClick = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  return (
    <main className="grow relative bg-slate-900 overflow-hidden flex justify-center items-center pt-14 md:pt-0 pb-20 md:pb-0">
      {/* Hidden Model Viewer for AR */}
      <model-viewer
        ref={modelViewerRef}
        src="/mapsgardu.glb"
        meshopt-decoder="https://unpkg.com/meshoptimizer/meshopt_decoder.js"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      ></model-viewer>

      {/* 3D Model Viewer */}
      <div className="absolute inset-0 z-[1]">
        <Canvas camera={{ position: [0, 25, 50], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          <Suspense fallback={<Loader />}>
            <LazyModel onMarkerClick={handleMarkerClick} />
            <Environment preset="forest" background blur={0} />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        </Canvas>
      </div>

      {/* Top Left Logo PPKO */}
      <div className="absolute top-20 md:top-6 left-4 md:left-12 z-20 pointer-events-none">
        <img src={logoppko} alt="Logo PPKO" loading="lazy" className="h-8 md:h-15 object-contain drop-shadow-md bg-white/50 backdrop-blur-sm p-1.5 rounded-lg border border-white/50" />
      </div>

      {/* Top Right AR Button - Responsif Mobile & Desktop */}

      <button
        onClick={handleARClick}
        className="absolute top-20 md:top-6 right-4 md:right-6 flex items-center gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full z-20 bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-all border border-slate-200 cursor-pointer"
      >
        <ScanLine size={18} className="text-slate-800" />
        <span className="text-[12px] md:text-[13px] font-bold text-slate-900">Lihat di ruang Anda</span>
      </button>

      {/* Detail Card (3D viewer) */}
      {showCard && activeData && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2 w-[90%] max-w-[320px] p-5 rounded-2xl glass-panel bg-white/95 backdrop-blur-xl shadow-2xl z-30">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 m-0 mb-0.5">{activeData.title}</h3>
                <p className="text-xs text-slate-500 m-0">{activeData.category}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={() => setShowCard(false)}>
              <X size={18} />
            </button>
          </div>

          <LazyBackground image={activeData.image} className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-200" />

          <p className="text-[13px] leading-relaxed text-slate-700 mb-5">
            {activeData.shortDesc}
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-start gap-3 text-xs">
              <MapIcon size={14} className="text-slate-400 mt-0.5" />
              <span className="text-slate-500 min-w-[100px]">Kategori</span>
              <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">{activeData.category}</span>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <Clock size={14} className="text-slate-400 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 min-w-[100px]">Jam Operasional</span>
                <span className="text-slate-900 font-medium leading-snug">{activeData.hours}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <MapPin size={14} className="text-slate-400 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 min-w-[100px]">Lokasi</span>
                <span className="text-slate-900 font-medium leading-snug">{activeData.location}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowCard(false);
              setShowLongDetail(true);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Lihat Detail <span>→</span>
          </button>
        </div>
      )}

      {/* Long Detail Modal */}
      {showLongDetail && activeData && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
            {/* Header Image */}
            <div className="relative h-48 md:h-64 shrink-0 bg-slate-200">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${activeData.image}')` }}></div>
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 transition-colors"
                onClick={() => setShowLongDetail(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <MapPin size={18} />
                <span className="font-semibold text-sm">{activeData.location}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{activeData.title}</h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold">{activeData.category}</span>
                <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border border-slate-100">
                  <Clock size={14} /> {activeData.hours}
                </span>
              </div>

              <div className="prose prose-slate max-w-none text-slate-600 text-[15px]">
                {activeData.longDesc.map((paragraph, idx) => (
                  <p key={idx} className={idx === activeData.longDesc.length - 1 ? "leading-relaxed" : "leading-relaxed mb-4"}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tooltip */}
      {showTooltip && (
        <div className="hidden md:flex absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 items-center gap-3 px-4 py-2.5 rounded-[20px] text-xs text-slate-700 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 z-20 w-[90%] md:w-auto justify-center">
          <Info size={16} className="text-blue-500 shrink-0" />
          <span className="truncate font-medium">Geser untuk memutar peta 3D, scroll untuk zoom</span>
          <button className="flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0" onClick={() => setShowTooltip(false)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ===== AR OVERLAY ===== */}
      {isARActive && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Sidebar kiri — daftar dusun */}
          {arSidebarOpen && (
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: '220px',
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(16px)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column',
              padding: '16px 0',
              overflowY: 'auto',
              pointerEvents: 'all',
            }}>
              <div style={{ padding: '0 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Peta Desa Getas</p>
                <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '700', margin: '4px 0 0' }}>Pilih Dusun</p>
              </div>
              <div style={{ padding: '8px 0', flex: 1 }}>
                {Object.entries(poiData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setArSelectedPoi(arSelectedPoi?.key === key ? null : { key, ...data })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '10px 16px',
                      background: arSelectedPoi?.key === key ? 'rgba(59,130,246,0.25)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      borderLeft: arSelectedPoi?.key === key ? '3px solid #3b82f6' : '3px solid transparent',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (arSelectedPoi?.key !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { if (arSelectedPoi?.key !== key) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'rgba(59,130,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <MapPin size={14} color="#60a5fa" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: '600', margin: 0 }}>{data.title}</p>
                      <p style={{ color: '#64748b', fontSize: '10px', margin: '2px 0 0' }}>{data.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggle sidebar button */}
          <button
            onClick={() => setArSidebarOpen(v => !v)}
            style={{
              position: 'absolute', top: '50%', left: arSidebarOpen ? '220px' : '0',
              transform: 'translateY(-50%)',
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderLeft: 'none',
              borderRadius: '0 8px 8px 0',
              padding: '10px 6px',
              cursor: 'pointer',
              pointerEvents: 'all',
              transition: 'left 0.2s',
            }}
          >
            <List size={16} color="#94a3b8" />
          </button>

          {/* Detail card dusun yang dipilih di AR */}
          {arSelectedPoi && (
            <div style={{
              position: 'absolute',
              right: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '280px',
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              pointerEvents: 'all',
            }}>
              {/* Image */}
              <div style={{ height: '140px', backgroundImage: `url(${arSelectedPoi.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <button
                  onClick={() => setArSelectedPoi(null)}
                  style={{
                    position: 'absolute', top: '10px', right: '10px',
                    width: '32px', height: '32px',
                    background: 'rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(8px)',
                    border: 'none', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} color="white" />
                </button>
              </div>
              {/* Content */}
              <div style={{ padding: '16px' }}>
                <p style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '700', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{arSelectedPoi.category}</p>
                <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: '800', margin: '0 0 8px' }}>{arSelectedPoi.title}</h3>
                <p style={{ color: '#475569', fontSize: '12px', lineHeight: 1.6, margin: '0 0 12px' }}>{arSelectedPoi.shortDesc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} color="#94a3b8" />
                  <span style={{ color: '#64748b', fontSize: '11px' }}>{arSelectedPoi.hours}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MainContent;