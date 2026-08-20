import React from 'react';
import {
  Globe,
  ScanLine,
  Box,
  Pointer,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Zap,
  Clock,
  ShieldCheck,
  QrCode,
  Sparkles
} from 'lucide-react';
import logoppko from '../../assets/logoppko.png';

const steps = [
  {
    icon: Globe,
    title: 'Buka Website',
    desc: 'Buka website AR melalui browser di perangkat Anda (disarankan menggunakan Google Chrome).'
  },
  {
    icon: ScanLine,
    title: 'Scan Marker / QR',
    desc: 'Arahkan kamera ke marker atau QR yang tersedia. Pastikan marker terlihat jelas di layar.'
  },
  {
    icon: Box,
    title: 'Objek 3D Muncul',
    desc: 'Setelah berhasil dipindai, objek 3D akan muncul secara otomatis di layar Anda.'
  },
  {
    icon: Pointer,
    title: 'Interaksi',
    desc: 'Gunakan sentuhan jari untuk memutar, memperbesar, atau melihat objek dari berbagai sudut.'
  }
];

const tips = [
  'Pastikan pencahayaan cukup saat melakukan scan.',
  'Jaga jarak ideal antara kamera dan marker (± 20-40 cm).',
  'Gunakan permukaan datar untuk menempatkan marker.',
  'Pastikan koneksi internet stabil untuk performa optimal.'
];

const Panduan = () => {
  return (
    <main className="grow bg-slate-50/80 relative pt-20 pb-20 md:pt-10 md:pb-10 min-h-screen overflow-y-auto hide-scrollbar font-sans">

      {/* Decorative Gradient Backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="w-[90%] max-w-[1200px] mx-auto relative z-10 flex flex-col gap-12 md:gap-16">

        {/* ===== Hero Section ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8 pt-6 md:pt-0">

          {/* Text Content */}
          <div className="flex-1 max-w-xl text-center md:text-left z-10 flex flex-col items-center md:items-start">
            <img src={logoppko} alt="Logo PPKO" loading="lazy" className="h-8 md:h-10 mb-6 object-contain" />
            <span className="text-blue-600 font-bold text-[11px] tracking-widest uppercase mb-4 block">PANDUAN</span>
            <h1 className="text-4xl md:text-[3rem] font-extrabold text-slate-900 leading-[1.1] mb-5 md:mb-3 tracking-tight">
              Panduan <br className="hidden md:block" />
              <span className="text-blue-600">Penggunaan</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-sm leading-relaxed mb-8 md:mb-5 max-w-md">
              Ikuti langkah-langkah mudah berikut untuk menggunakan aplikasi web AR kami dan nikmati pengalaman interaktif di dunia nyata.
            </p>

            {/* Badges */}
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
                <Zap size={14} className="text-blue-500" /> Mudah
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
                <Clock size={14} className="text-blue-500" /> Cepat
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
                <ShieldCheck size={14} className="text-blue-500" /> Aman
              </div>
            </div>
          </div>

          {/* Illustration Content */}
          <div className="shrink-0 relative mt-10 md:mt-0">
            {/* Phone Mockup */}
            <div className="relative w-[220px] md:w-[180px] h-[460px] md:h-[380px] bg-slate-900 rounded-[2.5rem] md:rounded-[2rem] p-2 md:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform rotate-0 md:rotate-[8deg] z-10 border-4 border-slate-800">
              {/* screen */}
              <div className="w-full h-full bg-blue-50/50 rounded-[2rem] md:rounded-[1.5rem] relative overflow-hidden flex flex-col items-center justify-center border-4 border-slate-800 bg-white">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-5 md:h-5 bg-slate-900 rounded-b-xl z-20"></div>

                {/* Scanner Brackets */}
                <div className="absolute top-[25%] left-8 right-8 bottom-[25%] md:left-4 md:right-4 opacity-80">
                  <div className="absolute -top-1 -left-1 w-6 h-6 md:w-4 md:h-4 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 md:w-4 md:h-4 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 md:w-4 md:h-4 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-4 md:h-4 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>

                {/* 3D Object Illustration */}
                <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                  <div className="transform -translate-y-8 md:-translate-y-4 animate-bounce" style={{ animationDuration: '3s' }}>
                    {/* 3D Cube using CSS */}
                    <div className="relative w-20 h-20 md:w-16 md:h-16">
                      <div className="absolute inset-0 bg-blue-600 rounded-xl md:rounded-lg transform rotate-45 scale-y-[0.6] shadow-2xl"></div>
                      <div className="absolute inset-0 bg-blue-400 rounded-xl md:rounded-lg transform rotate-45 scale-y-[0.6] -translate-y-4 md:-translate-y-3"></div>
                      <div className="absolute inset-0 bg-blue-500 rounded-xl md:rounded-lg transform rotate-45 scale-y-[0.6] translate-y-4 md:translate-y-3 opacity-30 blur-xl"></div>
                    </div>
                  </div>
                  <div className="absolute top-[55%] md:top-[60%]">
                    <QrCode size={70} className="md:w-16 md:h-16 text-slate-800 transform rotate-x-[60deg] rotate-z-45 opacity-30 blur-[1px]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Background elements for phone */}
            <div className="absolute top-1/4 -left-10 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center transform -rotate-12 animate-pulse hidden md:flex">
              <Box size={24} className="text-blue-500" />
            </div>
            <div className="absolute bottom-1/4 -right-8 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform rotate-12">
              <Sparkles size={18} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* ===== Steps Section ===== */}
        <div>
          {/* Section Title */}
          <div className="text-center mb-10 md:mb-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
              <span className="flex md:hidden gap-1.5 text-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
              </span>
              <span>Langkah <span className="text-blue-600 relative">Penggunaan
                <div className="hidden md:block absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full"></div>
              </span></span>
              <span className="flex md:hidden gap-1.5 text-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
              </span>
            </h2>
          </div>

          {/* Cards Container */}
          <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-4 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex flex-row md:flex-col items-center md:items-center p-4 md:p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all duration-300 gap-4 md:gap-3 text-left md:text-center z-10">

                  {/* Desktop Number Badge */}
                  <div className="hidden md:flex absolute -top-3 -left-3 w-7 h-7 bg-blue-600 text-white rounded-full items-center justify-center text-xs font-bold shadow-lg shadow-blue-600/30">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 md:w-12 md:h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50 group-hover:scale-105 transition-transform duration-300">
                    <Icon size={28} className="md:w-6 md:h-6 stroke-[1.5]" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-800 text-[15px] md:text-[14px] mb-1 md:mb-1">{step.title}</h3>
                    <p className="text-slate-500 text-[13px] md:text-[12px] leading-relaxed md:leading-[1.4]">
                      {step.desc}
                    </p>
                  </div>

                  {/* Mobile Right Badge & Chevron */}
                  <div className="flex md:hidden items-center gap-3 shrink-0">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <ChevronRight size={18} className="text-blue-500" />
                  </div>
                </div>
              );
            })}

            {/* Desktop Connectors */}
            {steps.map((_, index) => (
              index < steps.length - 1 && (
                <div key={`connector-${index}`} className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center z-20 bg-white rounded-full border border-slate-100 shadow-sm text-slate-300" style={{ left: `calc(${(index + 1) * 25}% - 16px)` }}>
                  <ChevronRight size={16} />
                </div>
              )
            ))}
          </div>
        </div>

        {/* ===== Tips Section ===== */}
        <div className="bg-blue-50 rounded-2xl md:rounded-2xl p-6 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-6 border border-blue-100/50 relative overflow-hidden">

          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

          {/* Tips Title */}
          <div className="flex items-center gap-4 shrink-0 relative z-10 w-full md:w-auto pb-4 md:pb-0 border-b md:border-b-0 border-blue-100 md:border-r md:pr-6">
            <div className="w-12 h-12 md:w-12 md:h-12 rounded-full border-2 border-blue-200 bg-transparent flex items-center justify-center text-blue-600 shrink-0">
              <Lightbulb size={24} className="md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col md:block">
              <h3 className="font-bold text-slate-800 text-lg md:text-base">Tips Pengalaman</h3>
              <h3 className="font-bold text-blue-600 text-lg md:text-base">Terbaik</h3>
            </div>
          </div>

          {/* Tips List */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 w-full relative z-10">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-white">
                  <CheckCircle2 size={12} strokeWidth={3} />
                </div>
                <span className="text-[13px] md:text-[12px] text-slate-600 leading-relaxed font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Panduan;
