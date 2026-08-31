import React from 'react';
import { 
  ShoppingBag, 
  FileText, 
  ScanLine, 
  Mountain, 
  Smartphone, 
  Box, 
  Pointer, 
  Target,
  Code,
  Globe,
  Monitor,
  Layout,
  QrCode,
  MapPin,
  Camera,
  Info,
  ChevronLeft
} from 'lucide-react';
import logoppko from '../../assets/logoppko.png';

const features = [
  {
    icon: ShoppingBag,
    title: 'Produk UMKM',
    desc: 'Kenali produk unggulan Desa Getas seperti kopi, susu kambing, gula aren, dan kolang-kaling melalui objek 3D interaktif.'
  },
  {
    icon: FileText,
    title: 'Informasi Produk',
    desc: 'Dapatkan informasi lengkap mengenai produk secara lebih menarik melalui visualisasi digital.'
  },
  {
    icon: ScanLine,
    title: 'Pengalaman AR Interaktif',
    desc: 'Scan marker menggunakan kamera untuk melihat objek 3D dan berinteraksi dengannya secara langsung.'
  },
  {
    icon: Mountain,
    title: 'Potensi Desa Getas',
    desc: 'Jelajahi potensi wisata, budaya, dan keunggulan lokal Desa Getas melalui pengalaman digital yang lebih informatif.'
  }
];

const miniSteps = [
  { icon: ScanLine, num: 1, title: 'Scan Marker', desc: 'Arahkan kamera ke marker / QR.' },
  { icon: Smartphone, num: 2, title: 'Deteksi Kamera', desc: 'Sistem deteksi secara otomatis.' },
  { icon: Box, num: 3, title: 'Objek 3D Muncul', desc: 'Objek muncul di layar Anda.' },
  { icon: Pointer, num: 4, title: 'Interaksi', desc: 'Putar & jelajahi objek 3D.' }
];

const technologies = [
  { icon: Code, name: 'AR.js' },
  { icon: Layout, name: 'A-Frame' },
  { icon: Monitor, name: 'WebGL' },
  { icon: Globe, name: 'JavaScript' },
  { icon: QrCode, name: 'Marker-Based AR', colSpan: true }
];

const Tentang = () => {
  return (
    <main className="grow bg-white relative pt-20 pb-20 md:pt-10 md:pb-10 min-h-screen overflow-y-auto hide-scrollbar font-sans">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="w-[90%] max-w-[1200px] mx-auto relative z-10 flex flex-col gap-12 md:gap-16">
        
        {/* ===== HERO SECTION ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 pt-4">
          
          {/* Text Content */}
          <div className="flex-1 max-w-xl z-10">
            <img src={logoppko} alt="Logo PPKO" loading="lazy" className="h-8 md:h-10 mb-6 object-contain" />
            <span className="text-blue-600 font-bold text-[11px] tracking-widest uppercase mb-4 block">TENTANG APLIKASI</span>
            <h1 className="text-4xl md:text-[3.25rem] font-extrabold text-slate-900 leading-[1.1] mb-6">
              Kenali Potensi <br/> <span className="text-blue-600">Desa Getas</span> <br/> melalui <span className="text-blue-600">AR</span>
            </h1>
            <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-8 max-w-md">
              Website AR yang menghadirkan informasi produk UMKM dan potensi Desa Wisata Getas melalui pengalaman Augmented Reality yang interaktif dan menarik.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Box size={24} />
              </div>
              <div>
                <p className="text-[13px] text-slate-600 font-medium mb-1">Dikembangkan dalam program GARDU:</p>
                <p className="text-[14px] text-blue-700 font-bold leading-tight">Genting Agro-Edu Eco Experience.</p>
              </div>
            </div>
          </div>

          {/* Phone Mockup Illustration */}
          <div className="shrink-0 relative w-full max-w-[320px] md:max-w-[400px] flex justify-center items-center">
            {/* Background Circle */}
            <div className="absolute inset-0 bg-blue-50 rounded-full scale-110 md:scale-125 z-0"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-[20%] left-[-10%] w-12 h-12 bg-blue-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-blue-600 shadow-lg transform -rotate-12 z-20 animate-pulse hidden md:flex">
              <Box size={24} />
            </div>
            <div className="absolute bottom-[25%] left-[-5%] w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg transform rotate-6 z-20 hidden md:flex">
              <MapPin size={20} />
            </div>
            <div className="absolute top-[40%] right-[-10%] w-8 h-8 border-4 border-blue-200 rounded-full z-20 hidden md:block"></div>
            <div className="absolute top-[10%] right-[10%] text-blue-300 z-20 hidden md:block">✦</div>
            <div className="absolute bottom-[10%] right-[20%] text-blue-400 z-20 hidden md:block">✦</div>

            {/* Phone Body */}
            <div className="relative w-[240px] md:w-[260px] h-[480px] md:h-[540px] bg-slate-800 rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform -rotate-6 md:-rotate-[8deg] z-10 border-4 border-slate-700">
               {/* Screen */}
               <div className="w-full h-full bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col border-2 border-slate-900">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-6 bg-black rounded-full z-30"></div>
                  
                  {/* Header UI */}
                  <div className="absolute top-10 left-4 right-4 flex justify-between items-center z-20">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                      <ChevronLeft size={18} />
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                      AR
                    </div>
                  </div>

                  {/* 3D Scene Area */}
                  <div className="flex-1 relative bg-gradient-to-b from-blue-900/40 to-slate-900 flex flex-col items-center justify-center pt-10">
                     
                     {/* 3D Coffee Bag */}
                     <div className="relative w-[110px] h-[160px] bg-gradient-to-b from-[#2d1b11] to-[#1a0e07] rounded-md shadow-2xl flex flex-col items-center pt-8 border-t-[6px] border-b-[6px] border-[#3d271a] transform z-10 animate-bounce" style={{animationDuration: '3s'}}>
                        {/* Bag Design */}
                        <div className="w-full text-center px-2">
                          <div className="w-4 h-1 bg-[#d4a373] mx-auto rounded-full mb-3 opacity-50"></div>
                          <div className="text-[#d4a373] font-bold text-sm tracking-widest leading-none">KOPI</div>
                          <div className="text-white font-black text-[22px] tracking-tighter leading-none mb-1">GEMPOL</div>
                          <div className="text-[7px] text-[#d4a373]">100% ARABICA</div>
                        </div>
                        {/* Beans decorative */}
                        <div className="absolute bottom-4 left-3 w-3 h-2 bg-[#4a2e1b] rounded-[50%] transform rotate-45"></div>
                        <div className="absolute bottom-6 right-3 w-2 h-2 bg-[#4a2e1b] rounded-[50%] transform -rotate-12"></div>
                     </div>
                     
                     {/* QR Perspective Base */}
                     <div className="absolute top-[65%]">
                       <QrCode size={130} className="text-white transform rotate-x-[65deg] rotate-z-45 opacity-60" />
                     </div>
                  </div>

                  {/* Bottom UI Actions */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                      <Box size={18} />
                    </div>
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white">
                      <Camera size={22} />
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                      <Info size={18} />
                    </div>
                  </div>

               </div>
            </div>
          </div>
        </div>

        {/* ===== WHAT YOU CAN FIND SECTION ===== */}
        <div className="pt-4">
          <h2 className="text-center text-xl md:text-2xl font-bold text-slate-900 mb-8">
            Apa yang bisa kamu temukan?
            <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mt-2"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-[15px] mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== BOTTOM 3 COLUMNS SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-10">
          
          {/* Cara Kerja AR */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
             <h3 className="font-bold text-slate-800 text-[15px] text-center mb-6">Cara Kerja AR</h3>
             <div className="flex justify-between items-start relative px-2">
                {/* Dashed line */}
                <div className="absolute top-5 left-8 right-8 h-[2px] bg-slate-200 border-t-2 border-dashed border-blue-200 z-0"></div>
                
                {miniSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center text-center z-10 w-16 relative">
                      <div className="w-10 h-10 bg-white border border-blue-100 rounded-[10px] flex items-center justify-center text-blue-600 mb-2 shadow-sm">
                         <Icon size={18} />
                      </div>
                      <div className="absolute -top-1.5 -left-1.5 w-[18px] h-[18px] bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm">
                         {step.num}
                      </div>
                      <h4 className="font-bold text-slate-800 text-[10px] leading-[1.2] mb-1">{step.title}</h4>
                      <p className="text-slate-500 text-[8px] leading-[1.3]">{step.desc}</p>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Tujuan */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-center">
            <h3 className="font-bold text-slate-800 text-[15px] text-center mb-6">Tujuan</h3>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white border border-blue-100 rounded-[10px] flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <Target size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-[13px] mb-1">Membawa Potensi Lokal ke Dunia Digital</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  AR Web dikembangkan sebagai bagian dari program PPKO untuk membantu memperkenalkan produk dan potensi Desa Getas dengan cara yang lebih interaktif, visual, dan mudah diakses.
                </p>
              </div>
            </div>
          </div>

          {/* Teknologi */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 text-[15px] text-center mb-6">Teknologi yang Digunakan</h3>
            <div className="grid grid-cols-2 gap-3">
              {technologies.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <div key={idx} className={`flex items-center gap-2.5 bg-white border border-blue-100/50 rounded-lg py-2 px-3 shadow-sm ${tech.colSpan ? 'col-span-2 justify-center' : ''}`}>
                    <Icon size={14} className="text-blue-500" />
                    <span className="text-slate-700 text-[11px] font-semibold">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Tentang;
