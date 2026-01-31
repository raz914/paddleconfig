import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export default function DebugHelper() {
  const { camera, scene, gl } = useThree()

  useEffect(() => {
    // Expose Three.js objects to window for debugging
    window.app = {
      camera,
      scene,
      renderer: gl,
      // Helper function to log camera position
      getCameraPosition: () => {
        console.log('Camera Position:', {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        })
        return camera.position
      },
      // Helper function to set camera position
      setCameraPosition: (x, y, z) => {
        camera.position.set(x, y, z)
        camera.lookAt(0, 0, 0)
        console.log('Camera position updated to:', { x, y, z })
      }
    }

    console.log('🎮 Debug Helper Active!')
    console.log('📷 Access camera: window.app.camera')
    console.log('🎬 Access scene: window.app.scene')
    console.log('🖥️ Access renderer: window.app.renderer')
    console.log('📍 Get camera position: window.app.getCameraPosition()')
    console.log('📌 Set camera position: window.app.setCameraPosition(x, y, z)')

    return () => {
      // Cleanup on unmount
      delete window.app
    }
  }, [camera, scene, gl])

  return null // This component doesn't render anything
}

