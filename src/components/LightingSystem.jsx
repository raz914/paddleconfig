import { useEffect } from 'react'

function LightingSystem({ isNightMode }) {
  useEffect(() => {
    console.log('Night mode:', isNightMode)
  }, [isNightMode])

  if (isNightMode) {
    return (
      <>
        {/* Ambient light for overall scene illumination */}
        <ambientLight intensity={0.8} />
        
        {/* Spotlight from top-front-left corner */}
        <pointLight
          position={[-7, 6, 5]}
          intensity={150}
          angle={0.3}
          penumbra={0.5}
          // castShadow
          // shadow-mapSize-width={2048}
          // shadow-mapSize-height={2048}
          // shadow-camera-far={50}
          // shadow-bias={-0.0001}
          color="#fae5c8"
        />

        
        {/* Spotlight from top-front-right corner */}
        <pointLight
          position={[7, 6, 4]}
          intensity={150}
          angle={0.8}
          penumbra={0.5}
          // castShadow
          color="#fae5c8"
        />
rgb(255, 244, 228)
        {/* Spotlight from top-back-left corner */}
        <pointLight
          position={[7, 5, -4]}
          intensity={120}
          angle={0.6}
          penumbra={0.5}
          color="#fae5c8"
        />
#fae5c8
        {/* Spotlight from top-back-right corner */}
        <pointLight
          position={[-7, 5, -4]}
          intensity={120}
          angle={0.6}
          penumbra={0.5}
          color="#faf8f3"
        />

        {/* Subtle fill light to prevent too dark shadows */}
        <pointLight position={[0, 8, 0]} intensity={8} color="#4a5568" />
      </>
    )
  }

  // Day mode lighting (existing setup)
  return (
    <>
      <ambientLight intensity={5} />
      
      {/* Main shadow casting light */}
      <directionalLight 
        position={[3, 15, 5]} 
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 3, 0]} intensity={0.3} />
    </>
  )
}

export default LightingSystem

