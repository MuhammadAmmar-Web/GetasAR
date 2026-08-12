import React, { useEffect } from 'react';
import logo from '../../assets/logo.png';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Simulasi loading singkat agar tidak memblokir akses kamera terlalu lama
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-50 flex flex-col items-center justify-center z-[100]">
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <div className="w-[100px] h-[100px] mb-8 relative animate-pulse">
          <img src={logo} alt="GETAS AR Logo" className="w-full h-full object-contain" />
        </div>
        
        {/* Loading Spinner & Text */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-900 font-bold tracking-wide">Memuat Pengalaman AR...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
