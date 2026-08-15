import React from 'react';
import { ScanLine, MapPin, Hand, X } from 'lucide-react';

const OnboardingPopup = ({ onStart }) => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-30/30 backdrop-blur-md flex flex-col items-center justify-center z-[90] p-6">
      <div className="glass-panel relative w-full max-w-[400px] p-8 flex flex-col items-center text-center shadow-xl border border-slate-200 bg-white">

        <button
          onClick={onStart}
          className="absolute top-3 right-3 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
          <ScanLine size={32} className="text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang di GETAS AR</h2>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          Jelajahi potensi dan keindahan Desa Getas melalui teknologi Augmented Reality yang interaktif.
        </p>

        <div className="flex flex-col gap-6 w-full text-left mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ScanLine size={20} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Arahkan Kamera</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Arahkan kamera perangkat Anda ke marker atau peta fisik Desa Getas.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Jelajahi Lokasi</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Pilih kategori atau klik ikon pin yang muncul untuk melihat detail informasi.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Hand size={20} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Navigasi Sentuh</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Gunakan menu di samping untuk berpindah antara AR Peta, Produk, dan Panduan.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/20"
        >
          Mulai Pengalaman AR
        </button>
      </div>
    </div>
  );
};

export default OnboardingPopup;
