import { useRef, useEffect, useState } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function PaddleModel({ meshSettings, onLoaded, onMeshesDiscovered }) {
  const group = useRef()
  const { scene } = useGLTF('/paddleModel/paddle-compressed.glb')
  const { camera } = useThree()
  const [clonedScene, setClonedScene] = useState(null)

  // Turf textures (color, normal, roughness/AO)
  const turfTextures = useTexture({
    map: '/texture/CespedLight_d.jpg',
    normalMap: '/texture/Cesped_n.jpg',
    roughnessMap: '/texture/CespedBN_d.jpg',
  })

  // Ensure textures tile nicely on the turf
  if (turfTextures) {
    Object.values(turfTextures).forEach((tex) => {
      if (!tex) return
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(64, 64) // Increased density for more detailed grass
    })
  }

  useEffect(() => {
    // Center camera on model
    camera.position.set(10, 10, 17)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useEffect(() => {
    if (!scene) return

    // Clone the scene to avoid modifying the cached original
    const cloned = scene.clone(true)

    // Discover all mesh names in the scene
    const discoveredMeshes = []

    // Clone materials for each mesh so they can be modified independently
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.castShadow = true
        child.receiveShadow = true

        // Collect mesh names for control panel
        if (child.name) {
          discoveredMeshes.push(child.name)
        }
      }
    })

    // Report discovered meshes to parent component
    if (onMeshesDiscovered && discoveredMeshes.length > 0) {
      onMeshesDiscovered(discoveredMeshes)
    }

    setClonedScene(cloned)
  }, [scene, onMeshesDiscovered])

  const hasReportedLoaded = useRef(false)

  useEffect(() => {
    if (!clonedScene) return

    // Apply settings to all meshes in the cloned model
    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return

      const meshName = child.name
      const settings = meshSettings[meshName]

      // Apply user visibility / color
      if (settings) {
        child.visible = settings.visible
        if (settings.color) {
          child.material.color.set(settings.color)
        }

        // Apply material properties
        if (settings.metalness !== undefined) {
          child.material.metalness = settings.metalness
        }
        if (settings.roughness !== undefined) {
          child.material.roughness = settings.roughness
        }
        if (settings.opacity !== undefined) {
          child.material.opacity = settings.opacity
          child.material.transparent = settings.opacity < 1
        }
      }

      // Disable shadow casting for transparent glass walls
      if (meshName && meshName.toLowerCase().includes('glass')) {
        child.castShadow = false
        // console.log('aaaaaa Net001_1', child.material)

      }


      // Apply turf textures only to the turf mesh
      if (meshName && meshName.toLowerCase().includes('turf') && turfTextures) {
        child.material.map = turfTextures.map
        child.material.normalMap = turfTextures.normalMap
        child.material.aoMap = turfTextures.roughnessMap
        child.material.envMapIntensity = 0.5 // Less reflective grass
        // child.material.color.set(settings.color)

        child.material.needsUpdate = true
      } else if (settings) {
        // Ensure non-turf meshes still update correctly
        child.material.needsUpdate = true
      }
    })

    // Once we have a cloned scene and textures processed, consider the model loaded
    if (!hasReportedLoaded.current) {
      hasReportedLoaded.current = true
      if (onLoaded) {
        onLoaded()
      }
    }
  }, [clonedScene, meshSettings, turfTextures, onLoaded])

  if (!clonedScene) return null

  return <primitive ref={group} object={clonedScene} />
}

// Preload the model
useGLTF.preload('/paddleModel/paddle-compressed.glb')

