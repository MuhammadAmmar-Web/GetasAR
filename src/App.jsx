import { useState, Suspense, lazy, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import LoadingScreen from './components/views/LoadingScreen'
import OnboardingPopup from './components/views/OnboardingPopup'
import ErrorBoundary from './components/ErrorBoundary'

// Code splitting per tab — three/mind-ar/model-viewer hanya diunduh
// saat tab terkait dibuka, bukan di load awal.
const MainContent = lazy(() => import('./components/MainContent'))
const ARProduk = lazy(() => import('./components/views/ARProduk'))
const ARFallback = lazy(() => import('./ar-fallback.jsx'))
const Panduan = lazy(() => import('./components/views/Panduan'))
const Tentang = lazy(() => import('./components/views/Tentang'))

function ViewFallback() {
  return (
    <main className="grow relative bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </main>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('peta-desa')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // App Flow States
  const [isAppReady, setIsAppReady] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  // Preload chunk tab default (Peta Desa) paralel dengan LoadingScreen
  useEffect(() => {
    import('./components/MainContent')
  }, [])

  const renderContent = () => {
    const props = { isMobileMenuOpen, setIsMobileMenuOpen, setActiveTab }
    switch (activeTab) {
      case 'peta-desa':
        return <MainContent {...props} />
      case 'ar-produk':
        return <ARProduk {...props} />
      case 'peta-3d':
        return <ARFallback {...props} />
      case 'panduan':
        return <Panduan {...props} />
      case 'tentang':
        return <Tentang {...props} />
      default:
        return <MainContent {...props} />
    }
  }

  if (!isAppReady) {
    return <LoadingScreen onComplete={() => setIsAppReady(true)} />
  }

  return (
    <ErrorBoundary>
      {!hasSeenOnboarding && (
        <OnboardingPopup onStart={() => setHasSeenOnboarding(true)} />
      )}

      <div className="flex w-screen h-screen relative overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isMobileMenuOpen} 
          setIsOpen={setIsMobileMenuOpen} 
        />
        <Suspense fallback={<ViewFallback />}>
          {renderContent()}
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App