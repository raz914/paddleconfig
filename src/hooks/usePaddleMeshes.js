import { useState, useCallback } from 'react'

// Predefined default settings for known meshes
const defaultSettings = {
  "Turf": {
    visible: true,
    color: "#fffff",
    // metalness: 0,
    // roughness: 0.69,
    // opacity: 1
  },
  "MetalFrame": {
    visible: true,
    color: "#333333",
    metalness: 0.69,
    roughness: 1,
    opacity: 1
  },
  "Mesh": {
    visible: true,
    color: "#333333",
    metalness: 0.69,
    roughness: 1,
    opacity: 1
  },
  "GlassWalls": {
    visible: true,
    color: "#ffffff",
    metalness: 0.05,
    roughness: 0.83,
    opacity: 0.27
  },
  "Frame": {
    visible: true,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "Empty_Mesh": {
    visible: false,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "Empty_Mesh001": {
    visible: false,
    color:  "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "cornerBar": {
    visible: false,
    color:  "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1},
    "cornerBar001": {
      visible: false,
      color:  "#333333",
      metalness: 0.32,
      roughness: 0.86,
      opacity: 1
    },
    "cornerBar002": {
      visible: false,
      color:  "#333333",
      metalness: 0.32,
      roughness: 0.86,
      opacity: 1
    },
    "cornerBar003": {
      visible: false,
      color:  "#333333",
      metalness: 0.32,
      roughness: 0.86,
      opacity: 1
    },
  "RejaD001": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD002": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD003": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD004": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD005": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD006": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "RejaD007": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "GrapaC": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC001": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC002": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC003": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC004": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC005": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "Escuadra&Tornillos": {
    visible: true,
    color: "#ffffff",
    metalness: 0.5,
    roughness: 0.5,
    opacity: 1
  },
  "cornerBar": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "cornerBar001": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "cornerBar002": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "cornerBar003": {
    visible: false,
    color: "#000000",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "GrapaC007": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC008": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC009": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC010": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC011": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "GrapaC012": {
    visible: true,
    color: "#404040",
    metalness: 0.8,
    roughness: 0.4,
    opacity: 1
  },
  "Net001": {
    visible: true,
    color: "#ffffff",
    metalness: 0.5,
    roughness: 0.5,
    opacity: 0.8
  },
  "Net001_1": {
    visible: true,
    color: "#333333",
    
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
   
  },
  "Net_1": {
    visible: true,
    metalness: 0,
    roughness: 0.04,
    opacity: 0.82
  },
  "Net_2": {
    visible: false,
    metalness: 0.41,
    roughness: 0.32,
    opacity: 0.52
  },
  "Turf": {
    visible: true,
    color: "#45b7d1",
    metalness: 0,
    roughness: 0.69,
    opacity: 1
  },
  "Frame001": {
    visible: true,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "Frame002": {
    visible: true,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "Escuadra&Tornillos": {
    visible: false,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "MetalFrame_01": {
    visible: true,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  },
  "MetalFrame_02": {
    visible: true,
    color: "#333333",
    metalness: 0.32,
    roughness: 0.86,
    opacity: 1
  }
}

// Default settings for newly discovered meshes
const getDefaultMeshSettings = (meshName) => {
  // Check if we have predefined settings
  if (defaultSettings[meshName]) {
    return defaultSettings[meshName]
  }
  
  // Special handling for cornerbar meshes - use Frame settings but invisible by default
  if (meshName.toLowerCase().includes('cornerbar')) {
    return {
      visible: false, // Hidden by default, only visible in panoramic view
      color: "#000000", // Default black to match Frame
      metalness: 0.32,
      roughness: 0.86,
      opacity: 1
    }
  }
  
  // Special handling for empty meshes - same as cornerbar (panoramic view only)
  if (meshName.toLowerCase().includes('empty')) {
    return {
      visible: false, // Hidden by default, only visible in panoramic view
      color: "#000000", // Default black to match Frame
      metalness: 0.32,
      roughness: 0.86,
      opacity: 1
    }
  }
  
  // Special handling for reja meshes - same as cornerbar (panoramic view only)
  if (meshName.toLowerCase().includes('reja')) {
    return {
      visible: false, // Hidden by default, only visible in panoramic view
      color: "#000000", // Default black to match Frame
      metalness: 0.32,
      roughness: 0.86,
      opacity: 1
    }
  }
  
  // Special handling for grapaC meshes - metallic dark gray
  if (meshName.toLowerCase().includes('grapac')) {
    return {
      visible: true,
      color: "#404040", // Dark gray
      metalness: 0.8,
      roughness: 0.4,
      opacity: 1
    }
  }
  
  // Return generic defaults for unknown meshes
  return {
    visible: true,
    color: "#ffffff",
    metalness: 0.5,
    roughness: 0.5,
    opacity: 1
  }
}

export function usePaddleMeshes() {
  const [meshNames, setMeshNames] = useState([])
  const [meshSettings, setMeshSettings] = useState({})

  const updateMeshSettings = (meshName, newSettings) => {
    setMeshSettings(prev => ({
      ...prev,
      [meshName]: newSettings
    }))
  }

  const handleMeshesDiscovered = useCallback((discoveredMeshNames) => {
    // Update mesh names
    setMeshNames(discoveredMeshNames)
    
    // Initialize settings for all discovered meshes
    const newSettings = {}
    const cornerbarMeshes = []
    const emptyMeshes = []
    const rejaMeshes = []
    const grapaCMeshes = []
    
    discoveredMeshNames.forEach(meshName => {
      newSettings[meshName] = getDefaultMeshSettings(meshName)
      
      // Track special meshes for logging
      if (meshName.toLowerCase().includes('cornerbar')) {
        cornerbarMeshes.push(meshName)
      }
      if (meshName.toLowerCase().includes('empty')) {
        emptyMeshes.push(meshName)
      }
      if (meshName.toLowerCase().includes('reja')) {
        rejaMeshes.push(meshName)
      }
      if (meshName.toLowerCase().includes('grapac')) {
        grapaCMeshes.push(meshName)
      }
    })
    
    setMeshSettings(newSettings)
    
    // Log discovered meshes to console
    console.log('=== Discovered Meshes in Scene ===')
    console.log('Total meshes found:', discoveredMeshNames.length)
    console.log('Mesh names:', discoveredMeshNames)
    if (cornerbarMeshes.length > 0) {
      console.log('Cornerbar meshes (panoramic view only):', cornerbarMeshes)
    }
    if (emptyMeshes.length > 0) {
      console.log('Empty meshes (panoramic view only):', emptyMeshes)
    }
    if (rejaMeshes.length > 0) {
      console.log('Reja meshes (panoramic view only):', rejaMeshes)
    }
    if (grapaCMeshes.length > 0) {
      console.log('GrapaC meshes (metallic dark gray):', grapaCMeshes)
    }
    console.log('==================================')
  }, [])

  const logSettings = () => {
    console.log('=== Paddle Configuration Settings ===')
    console.log(JSON.stringify(meshSettings, null, 2))
    console.log('=====================================')
  }

  return {
    meshNames,
    meshSettings,
    updateMeshSettings,
    handleMeshesDiscovered,
    logSettings
  }
}

