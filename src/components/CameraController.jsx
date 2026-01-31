import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export default function CameraController({ targetPosition, onAnimationComplete }) {
  const { camera, controls } = useThree()

  useEffect(() => {
    if (!targetPosition) return

    const startPosition = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    }

    const duration = 1000 // 1 second animation
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      // Interpolate position
      camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress
      camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress
      camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress

      // Update controls target if available
      if (controls) {
        controls.update()
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else if (onAnimationComplete) {
        onAnimationComplete()
      }
    }

    animate()
  }, [targetPosition, camera, controls, onAnimationComplete])

  return null
}

