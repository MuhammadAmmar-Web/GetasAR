import { Map, Box, HelpCircle, Info, ExternalLink } from 'lucide-react';
import logo from '../assets/Logo.png';

const mainNav = [
  { id: 'peta-desa', label: 'AR Peta Desa', sub: 'Scan QR Peta', icon: Map },
  { id: 'ar-produk', label: 'AR Produk', sub: 'Scan QR Produk', icon: Box },
];

const guideNav = [
  { id: 'panduan', label: 'Cara Penggunaan', icon: HelpCircle },
  { id: 'tentang', label: 'Tentang AR', icon: Info },
];

const allNav = [...mainNav, ...guideNav];

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false); // Close on mobile after selection
  };

  return (
    <>
      {/* ===== MOBILE TOP NAVBAR ===== */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-sidebar/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-sm font-bold text-slate-900 m-0">GETAS AR</h1>
            <p className="text-[9px] text-slate-500 tracking-widest m-0">AUGMENTED REALITY</p>
          </div>
        </div>
        <a
          href="https://pesonagetas.com"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <ExternalLink size={12} />
          Website
        </a>
      </header>

      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 px-3 pb-3 pt-1">
        <div className="glass-panel bg-card/95 backdrop-blur-xl rounded-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.05)] border border-slate-200 px-2 py-2 flex items-center justify-between">
          {allNav.map(({ id, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className="group relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-colors"
              >
                {/* Active pill background */}
                <span
                  className={`absolute inset-x-1 inset-y-0 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-blue-500/10 ring-1 ring-blue-500/30'
                    : 'bg-transparent'
                    }`}
                ></span>
                <span className="relative flex items-center justify-center">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                      ? 'bg-blue-500 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] scale-105'
                      : 'text-slate-400 group-hover:bg-slate-100 group-hover:text-blue-500'
                      }`}
                  >
                    <Icon size={18} />
                  </span>
                </span>
                <span
                  className={`relative mt-1 text-[10px] font-medium transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500 group-hover:text-blue-500'
                    }`}
                >
                  {id === 'peta-desa' ? 'Peta' : id === 'ar-produk' ? 'Produk' : id === 'panduan' ? 'Panduan' : 'Tentang'}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile top/bottom spacing handled by views; overlay only for legacy drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className={`hidden md:flex fixed md:static inset-y-0 left-0 w-[280px] h-screen bg-sidebar flex-col px-6 py-8 border-r border-slate-200 shrink-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-[50px] h-[50px] flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold tracking-wide m-0 text-slate-900 leading-tight">GETAS</h1>
            <p className="text-[10px] text-slate-500 tracking-wider mt-0.5">AUGMENTED REALITY</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-2 mb-10">
          {mainNav.map(({ id, label, sub, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline transition-colors duration-200 group ${isActive ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{label}</span>
                  <span className={`text-[11px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-400'}`}>{sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Guide Navigation */}
        <div className="flex flex-col gap-4 grow">
          <h2 className="text-[10px] font-bold text-slate-400 tracking-wider pl-4 m-0">PANDUAN</h2>
          <div className="flex flex-col gap-1">
            {guideNav.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 group ${isActive ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`} />
                  <span className="font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-auto flex flex-col gap-4">
          <a href="https://pesonagetas.com" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg no-underline text-slate-700 bg-white hover:bg-slate-50 text-[13px] transition-colors duration-200 font-semibold shadow-sm">
            <ExternalLink size={16} />
            Kunjungi Website
          </a>
          <div className="text-[11px] text-slate-400 text-left pl-4">&copy; 2026 TIM PPK Ormawa BEM FIK 2026 Udinus. Seluruh hak dilindungi.</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
