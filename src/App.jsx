import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import ARProduk from './components/views/ARProduk'
import Panduan from './components/views/Panduan'
import Tentang from './components/views/Tentang'
import LoadingScreen from './components/views/LoadingScreen'
import OnboardingPopup from './components/views/OnboardingPopup'

function App() {
  const [activeTab, setActiveTab] = useState('peta-desa')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // App Flow States
  const [isAppReady, setIsAppReady] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  const renderContent = () => {
    const props = { isMobileMenuOpen, setIsMobileMenuOpen, setActiveTab }
    switch (activeTab) {
      case 'peta-desa':
        return <MainContent {...props} />
      case 'ar-produk':
        return <ARProduk {...props} />
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
    <>
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
        {renderContent()}
      </div>
    </>
  )
}

export default App