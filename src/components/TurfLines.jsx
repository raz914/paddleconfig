import { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function TurfLines({ visible = true, color = '#ffffff' }) {
  const { scene } = useGLTF('/paddleModel/paddle-compressed.glb')
  const [turfDimensions, setTurfDimensions] = useState(null)
  const groupRef = useRef()

  useEffect(() => {
    if (!scene) return

    // Find the turf mesh to get its dimensions and position
    let turfMesh = null
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes('turf')) {
        turfMesh = child
      }
    })

    if (turfMesh) {
      // Get bounding box of the turf
      const boundingBox = new THREE.Box3().setFromObject(turfMesh)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      boundingBox.getSize(size)
      boundingBox.getCenter(center)

      setTurfDimensions({
        width: size.x,
        length: size.z,
        height: size.y,
        centerX: center.x,
        centerY: center.y,
        centerZ: center.z,
      })
    }
  }, [scene])

  if (!turfDimensions || !visible) return null

  const { width, length, centerX, centerY, centerZ } = turfDimensions
  const lineWidth = 0.05 // Width of the lines (5cm standard for paddle courts)
  const lineHeight = 0.016 // Height to sit slightly above turf (prevents z-fighting)

  return (
    <group ref={groupRef}>
      {/* Center line (lengthwise) */}
      {/* <mesh position={[centerX, centerY + lineHeight, centerZ]}>
        <boxGeometry args={[lineWidth, lineHeight, length]} />
        <meshStandardMaterial color={color} />
      </mesh> */}

      <mesh position={[centerX - 7, centerY + lineHeight, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[lineWidth, lineHeight, length - 2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[centerX + 7, centerY + lineHeight, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[lineWidth, lineHeight, length - 2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Service line 1 (divides court into thirds - closer to one end) */}
      {/* <mesh position={[centerX, centerY + lineHeight, centerZ - length / 3]}>
        <boxGeometry args={[lineWidth, lineHeight, lineWidth]} />
        <meshStandardMaterial color={color} />
      </mesh> */}

      {/* Service line 2 (middle service line) */}
      <mesh position={[centerX, centerY + lineHeight, centerZ + 0.023]} castShadow receiveShadow>
        <boxGeometry args={[width - 7, lineHeight, lineWidth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Service line 3 (divides court into thirds - closer to other end) */}
      {/* <mesh position={[centerX, centerY + lineHeight, centerZ + length / 3]}>
        <boxGeometry args={[width, lineHeight, lineWidth]} />
        <meshStandardMaterial color={color} />
      </mesh> */}
    </group>
  )
}

