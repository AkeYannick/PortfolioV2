import { useCallback, useState } from 'react'
import './App.css'
import RouterPage from './Router/Router'
import DemarragePage from './pages/DemarragePage'
import Scene3D from './components/Scene3D'

function App() {
  // Le site se monte quand le rideau de la page de chargement commence à se lever,
  // ainsi les animations d'entrée (Hero, Reveal...) se jouent devant l'utilisateur.
  const [siteVisible, setSiteVisible] = useState(false)
  const [splashActif, setSplashActif] = useState(true)

  const afficherSite = useCallback(() => setSiteVisible(true), [])
  const retirerSplash = useCallback(() => setSplashActif(false), [])

  return (
    <div className='relative w-full h-full bg-abyss overflow-x-clip'>
      {/* Globe 3D connecté (avec la Côte d'Ivoire au centre) derrière tout le contenu */}
      <Scene3D className="fixed inset-0 z-0 pointer-events-none" ivoryCoast />
      <div className="relative z-10">
        {siteVisible && <RouterPage/>}
      </div>
      {splashActif && <DemarragePage onExitStart={afficherSite} onFinish={retirerSplash}/>}
    </div>
  )
}

export default App
