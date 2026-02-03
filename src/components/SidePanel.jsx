import { useState, useEffect } from 'react'

function SidePanel({ meshSettings, onMeshSettingsChange, onCameraMove, isNightMode, onNightModeToggle, onGetQuote, onConfigurationChange }) {
  const [activeOption, setActiveOption] = useState(null)
  const [selectedView, setSelectedView] = useState('default')
  const [selectedColor, setSelectedColor] = useState('black')
  const [selectedTurfColor, setSelectedTurfColor] = useState('default')
  const [selectedGlassColor, setSelectedGlassColor] = useState('clear')

  const options = [
    {
      id: 'track',
      title: 'Track Type',
      label: 'Track'
    },
    {
      id: 'turf',
      title: 'Change turf color',
      label: 'Turf'
    },
    {
      id: 'glass',
      title: 'Glass',
      label: 'Glass Tint'
    }
  ]

  const trackColors = [
    { id: 'blue', name: 'Blue', color: '#0000FF' },
    // { id: 'red', name: 'Red', color: '#FF0000' },
    // { id: 'green', name: 'Green', color: '#008000' },
    // { id: 'orange', name: 'Orange', color: '#FF8C00' },
    { id: 'white', name: 'white', color: '#FFFFFF' },
    { id: 'lightgray', name: 'Light Gray', color: '#BEBEBE' },
    { id: 'darkgray', name: 'Dark Gray', color: '#696969' },
    { id: 'black', name: 'Black', color: '#000000' }
  ]

  const turfColors = [
    { id: 'default', name: 'Default', color: '#0000ff' },
    { id: 'green', name: 'Green', color: '#6c935c' },
    // { id: 'burgundy', name: 'Burgundy', color: '#7f1d1d' },
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
      console.log('Net001_1', color)
      onMeshSettingsChange('Net001_1', { ...meshSettings['Net001_1'], color })
    }
    if (meshSettings['MetalFrame']) {
      console.log('not Net001_01', color)

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

  // Apply default turf color on mount
  // useEffect(() => {
  //   if (meshSettings['Turf']) {
  //     const defaultColor = turfColors.find(c => c.id === 'default')?.color
  //     if (defaultColor) {
  //       onMeshSettingsChange('Turf', { ...meshSettings['Turf'], color: defaultColor })
  //     }
  //   }
  // },

  // []) // Empty dependency array - only run on mount

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
      // if (meshSettings['Frame']) {
      //   onMeshSettingsChange('Frame', { ...meshSettings['Frame'], visible: false })
      // }
      // if (meshSettings['Mesh']) {
      //   onMeshSettingsChange('Mesh', { ...meshSettings['Mesh'], visible: false })
      // }

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
    <div className="fixed right-0 top-0 h-screen w-64 flex flex-col z-50 bg-white/95 backdrop-blur-sm shadow-lg">
      {/* Content */}
      {/* Content */}
      <div className="flex flex-col flex-1 py-8 items-center px-6 overflow-y-auto">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <img
              src="/logo.webp"
              alt="PADEL Brand"
              className="max-w-full h-auto"
              style={{ maxHeight: '80px' }}
            />
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="flex flex-col gap-4 w-full">
          {!activeOption ? (
            // Main menu - show all options
            options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setActiveOption(option.id)
                  // Animate camera based on the option
                  if (onCameraMove) {
                    if (option.id === 'track') {
                      onCameraMove({
                        x: -17.834164801813916,
                        y: 5.8003925092503374,
                        z: 11.602676047220438
                      })
                    } else if (option.id === 'turf') {
                      onCameraMove({
                        x: 19.02075909729634,
                        y: 21.22027591011862,
                        z: 0.40076634221081003
                      })
                    } else if (option.id === 'glass') {
                      onCameraMove({
                        x: 13.692438598049998,
                        y: 3.5622502568879932,
                        z: -9.539795009446959
                      })
                    }
                  }
                }}
                className="group relative px-8 py-3 rounded-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                title={option.title}
              >
                {/* Text Label */}
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {option.label}
                  </span>
                </div>


              </button>
            ))
          ) : (
            // Sub-menu view
            <div className="space-y-4 animate-fadeIn">
              {/* Selected option header */}
              <div className="px-4 py-3 bg-blue-600 rounded-lg shadow-lg">
                <h3 className="text-sm font-semibold text-white text-center">
                  {options.find(opt => opt.id === activeOption)?.label}
                </h3>
              </div>

              {/* Track Type Sub-menu */}
              {activeOption === 'track' && (
                <div className="space-y-4 px-2">
                  {/* View Options */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 px-2">View Type</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewChange('default')}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all border ${selectedView === 'default'
                          ? 'bg-sky-100 text-black border-blue-500 border-2 shadow-md'
                          : 'bg-white text-black border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        Default
                      </button>
                      <button
                        onClick={() => handleViewChange('panoramic')}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all border ${selectedView === 'panoramic'
                          ? 'bg-sky-100 text-black border-blue-500 border-2 shadow-md'
                          : 'bg-white text-black border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        Panoramic
                      </button>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 px-2">Track Color</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {trackColors.map((colorOption) => (
                        <button
                          key={colorOption.id}
                          onClick={() => handleColorChange(colorOption.id)}
                          className={`relative w-8 h-8 rounded-full transition-all aspect-square p-0 flex items-center justify-center ${selectedColor === colorOption.id
                            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110'
                            : 'shadow-sm hover:shadow-md hover:scale-105'
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
                </div>
              )}

              {/* Turf Sub-menu */}
              {activeOption === 'turf' && (
                <div className="space-y-4 px-2">
                  {/* Turf Color Options */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 px-2">Turf Color</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {turfColors.map((colorOption) => (
                        <button
                          key={colorOption.id}
                          onClick={() => handleTurfColorChange(colorOption.id)}
                          className={`relative w-8 h-8 rounded-full transition-all aspect-square p-0 flex items-center justify-center ${selectedTurfColor === colorOption.id
                            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110'
                            : 'shadow-sm hover:shadow-md hover:scale-105'
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
                </div>
              )}

              {/* Glass Tint Sub-menu */}
              {activeOption === 'glass' && (
                <div className="space-y-4 px-2">
                  {/* Glass Color Options */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 px-2">Glass Tint</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {glassColors.map((colorOption) => (
                        <button
                          key={colorOption.id}
                          onClick={() => handleGlassColorChange(colorOption.id)}
                          className={`relative w-8 h-8 rounded-full transition-all aspect-square p-0 flex items-center justify-center border-2 border-gray-200 ${selectedGlassColor === colorOption.id
                            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110'
                            : 'shadow-sm hover:shadow-md hover:scale-105'
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
              )}

              {/* Back button */}
              <button
                onClick={() => setActiveOption(null)}
                className="w-full px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="flex-none px-2 pb-2 w-full bg-white/50 backdrop-blur-md">
        {/* Get Quote Button */}
        <div className="pt-2 px-1">
          <button
            onClick={onGetQuote}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Quote
          </button>
        </div>

        {/* Night/Day Mode Toggle - Bottom Center */}
        <div className="pt-3 flex justify-center w-full pb-2">
          <button
            onClick={onNightModeToggle}
            className={`relative w-8 h-8 rounded-full shadow-md transition-all duration-300 hover:scale-110 ${isNightMode
              ? 'bg-gray-900 hover:bg-gray-800'
              : 'bg-yellow-400 hover:bg-yellow-500'
              }`}
            title={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {isNightMode ? (
              // Moon icon for night mode
              <svg
                className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              // Sun icon for day mode
              <svg
                className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white animate-spin-slow"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SidePanel

