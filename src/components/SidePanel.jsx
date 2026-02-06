import { useState, useEffect } from 'react'

function SidePanel({ meshSettings, onMeshSettingsChange, onCameraMove, onGetQuote, onConfigurationChange }) {
  const [selectedView, setSelectedView] = useState('default')
  const [selectedColor, setSelectedColor] = useState('black')
  const [selectedTurfColor, setSelectedTurfColor] = useState('default')
  const [selectedGlassColor, setSelectedGlassColor] = useState('clear')

  const trackColors = [
    { id: 'blue', name: 'Blue', color: '#0000FF' },
    { id: 'white', name: 'white', color: '#FFFFFF' },
    { id: 'lightgray', name: 'Light Gray', color: '#BEBEBE' },
    { id: 'darkgray', name: 'Dark Gray', color: '#696969' },
    { id: 'black', name: 'Black', color: '#000000' }
  ]

  const turfColors = [
    { id: 'default', name: 'Classic', color: '#0000ff' },
    { id: 'green', name: 'Green', color: '#6c935c' },
    { id: 'lime', name: 'Lime', color: '#c6ed2c' },
    { id: 'brown', name: 'Brown', color: '#993300' },
  ]

  const glassColors = [
    { id: 'clear', name: 'Clear', color: '#ffffff' },
    { id: 'blue', name: 'Blue Tint', color: '#87CEEB' },
    { id: 'green', name: 'Green Tint', color: '#90EE90' },
    { id: 'smoke', name: 'Smoke Gray', color: '#708090' }
  ]

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId)
    const color = trackColors.find(c => c.id === colorId).color

    // Notify parent of configuration change
    if (onConfigurationChange) {
      onConfigurationChange(prev => ({ ...prev, trackColor: colorId }))
    }

    // Update MetalFrame, Mesh, and Frame meshes
    if (meshSettings['Net001_1']) {
      onMeshSettingsChange('Net001_1', { ...meshSettings['Net001_1'], color })
    }
    if (meshSettings['MetalFrame']) {
      onMeshSettingsChange('MetalFrame', { ...meshSettings['MetalFrame'], color })
    }
    if (meshSettings['MetalFrame_01']) {
      onMeshSettingsChange('MetalFrame_01', { ...meshSettings['MetalFrame_01'], color })
    }
    if (meshSettings['MetalFrame_02']) {
      onMeshSettingsChange('MetalFrame_02', { ...meshSettings['MetalFrame_02'], color })
    }
    if (meshSettings['Mesh']) {
      onMeshSettingsChange('Mesh', { ...meshSettings['Mesh'], color })
    }
    if (meshSettings['Frame']) {
      onMeshSettingsChange('Frame', { ...meshSettings['Frame'], color })
    }
    if (meshSettings['Frame001']) {
      onMeshSettingsChange('Frame001', { ...meshSettings['Frame001'], color })
    }
    if (meshSettings['Frame002']) {
      onMeshSettingsChange('Frame002', { ...meshSettings['Frame002'], color })
    }

    // Update all cornerbar, empty, and reja meshes with the same color
    Object.keys(meshSettings).forEach(meshName => {
      const lowerName = meshName.toLowerCase()
      if (lowerName.includes('cornerbar') || lowerName.includes('empty') || lowerName.includes('reja')) {
        onMeshSettingsChange(meshName, { ...meshSettings[meshName], color })
      }
    })
  }

  const handleTurfColorChange = (colorId) => {
    setSelectedTurfColor(colorId)
    const color = turfColors.find(c => c.id === colorId).color

    // Notify parent of configuration change
    if (onConfigurationChange) {
      onConfigurationChange(prev => ({ ...prev, turfColor: colorId }))
    }

    // Update Turf mesh
    if (meshSettings['Turf']) {
      onMeshSettingsChange('Turf', { ...meshSettings['Turf'], color })
    }
  }

  const handleGlassColorChange = (colorId) => {
    setSelectedGlassColor(colorId)
    const color = glassColors.find(c => c.id === colorId).color

    // Notify parent of configuration change
    if (onConfigurationChange) {
      onConfigurationChange(prev => ({ ...prev, glassTint: colorId }))
    }

    // Update GlassWalls mesh
    if (meshSettings['GlassWalls']) {
      onMeshSettingsChange('GlassWalls', { ...meshSettings['GlassWalls'], color })
    }
  }

  const handleViewChange = (view) => {
    setSelectedView(view)

    // Notify parent of configuration change
    if (onConfigurationChange) {
      onConfigurationChange(prev => ({ ...prev, viewType: view }))
    }

    // Disable Net, MetalFrame, Frame, and Mesh for panoramic view, enable cornerbars, empty, and reja meshes
    if (view === 'panoramic') {
      if (meshSettings['Frame001']) {
        onMeshSettingsChange('Frame001', { ...meshSettings['Frame001'], visible: false })
      }
      if (meshSettings['Frame002']) {
        onMeshSettingsChange('Frame002', { ...meshSettings['Frame002'], visible: false })
      }
      if (meshSettings['MetalFrame_02']) {
        onMeshSettingsChange('MetalFrame_02', { ...meshSettings['MetalFrame_02'], visible: false })
      }

      // Enable all cornerbar, empty, and reja meshes in panoramic view
      Object.keys(meshSettings).forEach(meshName => {
        const lowerName = meshName.toLowerCase()
        if (lowerName.includes('cornerbar') || lowerName.includes('empty')) {
          onMeshSettingsChange(meshName, { ...meshSettings[meshName], visible: true })
        }
      })
    } else {
      // Enable Net, MetalFrame, Frame, and Mesh back for default view, hide cornerbars, empty, and reja meshes
      if (meshSettings['Frame001']) {
        onMeshSettingsChange('Frame001', { ...meshSettings['Frame001'], visible: true })
      }
      if (meshSettings['Frame002']) {
        onMeshSettingsChange('Frame002', { ...meshSettings['Frame002'], visible: true })
      }
      if (meshSettings['MetalFrame_02']) {
        onMeshSettingsChange('MetalFrame_02', { ...meshSettings['MetalFrame_02'], visible: true })
      }

      // Hide all cornerbar, empty, and reja meshes in default view
      Object.keys(meshSettings).forEach(meshName => {
        const lowerName = meshName.toLowerCase()
        if (lowerName.includes('cornerbar') || lowerName.includes('empty') || lowerName.includes('reja')) {
          onMeshSettingsChange(meshName, { ...meshSettings[meshName], visible: false })
        }
      })
    }
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-80 flex flex-col z-50 bg-white shadow-lg">
      {/* Content */}
      <div className="flex flex-col flex-1 py-6 px-6 overflow-y-auto">
        {/* Logo Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <img
              src="/logo.webp"
              alt="PADEL Brand"
              className="max-w-full h-auto"
              style={{ maxHeight: '60px' }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 text-center">Configure Your Padel Court</h2>
        </div>

        {/* All Options Displayed */}
        <div className="space-y-6">
          {/* View Type */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">View Type</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewChange('default')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all border ${selectedView === 'default'
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
              >
                Classic
              </button>
              <button
                onClick={() => handleViewChange('panoramic')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all border ${selectedView === 'panoramic'
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
              >
                Panoramic
              </button>
            </div>
          </div>

          {/* Track Colour */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Track Colour</p>
            <div className="flex flex-wrap gap-2">
              {trackColors.map((colorOption) => (
                <button
                  key={colorOption.id}
                  onClick={() => handleColorChange(colorOption.id)}
                  className={`relative w-8 h-8 rounded-full transition-all border-2 ${selectedColor === colorOption.id
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110 border-blue-500'
                    : 'border-gray-300 hover:shadow-md hover:scale-105'
                    }`}
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.name}
                >
                  {selectedColor === colorOption.id && (
                    <svg
                      className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Turf Colour */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Turf Colour</p>
            <div className="flex flex-wrap gap-2">
              {turfColors.map((colorOption) => (
                <button
                  key={colorOption.id}
                  onClick={() => handleTurfColorChange(colorOption.id)}
                  className={`relative w-8 h-8 rounded-full transition-all border-2 ${selectedTurfColor === colorOption.id
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110 border-blue-500'
                    : 'border-gray-300 hover:shadow-md hover:scale-105'
                    }`}
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.name}
                >
                  {selectedTurfColor === colorOption.id && (
                    <svg
                      className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Glass Tint */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Glass Tint</p>
            <div className="flex flex-wrap gap-2">
              {glassColors.map((colorOption) => (
                <button
                  key={colorOption.id}
                  onClick={() => handleGlassColorChange(colorOption.id)}
                  className={`relative w-8 h-8 rounded-full transition-all border-2 ${selectedGlassColor === colorOption.id
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110 border-blue-500'
                    : 'border-gray-300 hover:shadow-md hover:scale-105'
                    }`}
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.name}
                >
                  {selectedGlassColor === colorOption.id && (
                    <svg
                      className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex-none px-4 pb-4 w-full bg-white border-t border-gray-200">
        {/* Get Quote Button */}
        <div className="pt-4">
          <button
            onClick={onGetQuote}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            GET QUOTE
          </button>
        </div>
      </div>
    </div>
  )
}

export default SidePanel
