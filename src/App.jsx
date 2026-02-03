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
          isNightMode={isNightMode}
          onNightModeToggle={() => setIsNightMode(!isNightMode)}
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

      {/* Floating Toggle Button */}
      {<button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-6 left-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Toggle Control Panel"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isPanelOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isPanelOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          )}
        </svg>
      </button>}

      {/* Floating Control Panel */}

      <div className={`fixed top-6 left-6 z-40 transition-all duration-300 ${isPanelOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'
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
      </div>

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

