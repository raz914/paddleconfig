import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import PaddleModel from './components/PaddleModel'
import TurfLines from './components/TurfLines'
import ControlPanel from './components/ControlPanel'
import DebugHelper from './components/DebugHelper'
import SidePanel from './components/SidePanel'
import CameraController from './components/CameraController'
import LightingSystem from './components/LightingSystem'
import { usePaddleMeshes } from './hooks/usePaddleMeshes'
import LoadingScreen from './components/LoadingScreen'
import QuoteModal from './components/QuoteModal'

function App() {
  const { meshNames, meshSettings, updateMeshSettings, handleMeshesDiscovered, logSettings } = usePaddleMeshes()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [cameraTarget, setCameraTarget] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showCanvas, setShowCanvas] = useState(false)
  const [turfLineSettings, setTurfLineSettings] = useState({
    visible: true,
    color: '#ffffff'
  })
  const [environmentSettings, setEnvironmentSettings] = useState({
    enabled: false,
    preset: 'city',
    intensity: 1
  })
  const [isNightMode, setIsNightMode] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [currentConfiguration, setCurrentConfiguration] = useState({
    viewType: 'default',
    trackColor: 'black',
    turfColor: 'default',
    glassTint: 'clear'
  })

  const handleCameraMove = (position) => {
    setCameraTarget(position)
  }

  // Mount the Canvas on the next tick so the splash can paint first
  useEffect(() => {
    setShowCanvas(true)
  }, [])

  // Simple fake progress that advances until the model signals it's loaded
  useEffect(() => {
    if (isLoaded) {
      setLoadingProgress(100)
      return
    }

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Slowly advance to 90% while loading
        if (!isLoaded) {
          if (prev >= 90) return prev
          return prev + 3
        }
        // When loaded, jump to 100% and stop
        return 100
      })
    }, 120)

    return () => clearInterval(interval)
  }, [isLoaded])

  return (
    <div className="w-screen h-screen bg-gray-900 relative">
      {!isLoaded && <LoadingScreen progress={loadingProgress} />}

      {/* Side Panel (hidden while loading) */}
      {isLoaded && (
        <SidePanel
          meshSettings={meshSettings}
          onMeshSettingsChange={updateMeshSettings}
          onCameraMove={handleCameraMove}
          onGetQuote={() => setIsQuoteModalOpen(true)}
          onConfigurationChange={setCurrentConfiguration}
        />
      )}

      {/* Full Screen 3D Canvas */}
      {showCanvas && (
        <Canvas
          camera={{ position: [0, 10, 17], fov: 50 }}
          style={{ background: isNightMode ? 'black' : 'white' }}
          shadows
        >
          {/* Debug Helper - exposes scene/camera to window.app */}
          <DebugHelper />

          {/* Camera Controller - handles camera animations */}
          <CameraController
            targetPosition={cameraTarget}
            onAnimationComplete={() => setCameraTarget(null)}
          />

          {/* Environment & Lighting */}
          {environmentSettings.enabled && (
            <Environment
              preset={environmentSettings.preset}
              background={false}
            />
          )}

          {/* Dynamic Lighting System */}
          <LightingSystem isNightMode={isNightMode} />

          {/* White plane to receive shadows */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.01, 0]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial transparent opacity={0.3} />
          </mesh>

          {/* Paddle Model */}
          <PaddleModel
            meshSettings={meshSettings}
            onLoaded={() => setIsLoaded(true)}
            onMeshesDiscovered={handleMeshesDiscovered}
          />

          {/* Turf Lines */}
          <TurfLines visible={turfLineSettings.visible} color={turfLineSettings.color} />

          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={30}
          />
        </Canvas>
      )}

      {/* Floating Night/Day Mode Toggle */}
      <button
        onClick={() => setIsNightMode(!isNightMode)}
        className={`fixed top-6 left-6 z-50 inline-flex h-8 w-14 items-center rounded-full transition-all shadow-lg hover:shadow-xl ${isNightMode ? 'bg-gray-800' : 'bg-yellow-400'
          }`}
        title={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${isNightMode ? 'translate-x-8' : 'translate-x-1.5'
            }`}
        />
        {isNightMode ? (
          <svg
            className="absolute left-1.5 w-3.5 h-3.5 text-yellow-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg
            className="absolute right-1.5 w-3.5 h-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Floating Control Panel */}

      {/* <div className={`fixed top-6 left-6 z-40 transition-all duration-300 ${isPanelOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'
        } )}`}>


        <div className="w-96 max-h-[calc(100vh-3rem)] overflow-hidden">

          <ControlPanel
            meshNames={meshNames}
            meshSettings={meshSettings}
            onSettingsChange={updateMeshSettings}
            turfLineSettings={turfLineSettings}
            onTurfLineSettingsChange={setTurfLineSettings}
            environmentSettings={environmentSettings}
            onEnvironmentSettingsChange={setEnvironmentSettings}
            onLogSettings={logSettings}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
      </div> */}

      {/* Backdrop overlay when panel is open */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 backdrop-blur-sm"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        configuration={currentConfiguration}
      />
    </div>
  )
}

export default App

