import { useState } from 'react'

export default function ControlPanel({
  meshNames,
  meshSettings,
  onSettingsChange,
  turfLineSettings,
  onTurfLineSettingsChange,
  environmentSettings,
  onEnvironmentSettingsChange,
  onLogSettings,
  onClose
}) {
  const [expandedMeshes, setExpandedMeshes] = useState({})
  const [turfLinesExpanded, setTurfLinesExpanded] = useState(false)
  const [environmentExpanded, setEnvironmentExpanded] = useState(false)

  const toggleMeshExpanded = (meshName) => {
    setExpandedMeshes(prev => ({
      ...prev,
      [meshName]: !prev[meshName]
    }))
  }

  const toggleVisibility = (meshName) => {
    onSettingsChange(meshName, {
      ...meshSettings[meshName],
      visible: !meshSettings[meshName].visible
    })
  }

  const changeColor = (meshName, color) => {
    onSettingsChange(meshName, {
      ...meshSettings[meshName],
      color: color
    })
  }

  const changeMaterialProperty = (meshName, property, value) => {
    onSettingsChange(meshName, {
      ...meshSettings[meshName],
      [property]: value
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
      {/* Header with close button */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-white">Paddle Configuration</h2>
            <span className="text-xs text-indigo-200 font-medium">
              {meshNames.length} {meshNames.length === 1 ? 'mesh' : 'meshes'} detected
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              title="Close Panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-indigo-100">
            Control all scene components
          </p>
          <button
            onClick={onLogSettings}
            className="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors font-medium text-sm flex items-center gap-2"
            title="Log settings to console"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Log
          </button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">

        <div className="space-y-2">
          {/* Environment Control */}
          <div className="border-2 border-purple-300 rounded-lg overflow-hidden bg-purple-50">
            <div className="flex items-center justify-between p-3 bg-purple-100 hover:bg-purple-150 transition-colors">
              <button
                onClick={() => setEnvironmentExpanded(!environmentExpanded)}
                className="flex-1 text-left font-bold text-purple-900 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                HDR Environment
              </button>

              <button
                onClick={() => onEnvironmentSettingsChange({
                  ...environmentSettings,
                  enabled: !environmentSettings.enabled
                })}
                className={`ml-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${environmentSettings.enabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
              >
                {environmentSettings.enabled ? 'Enabled' : 'Disabled'}
              </button>

              <button
                onClick={() => setEnvironmentExpanded(!environmentExpanded)}
                className="ml-2 text-purple-700 hover:text-purple-900"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${environmentExpanded ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {environmentExpanded && (
              <div className="p-3 bg-white border-t border-purple-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preset
                </label>
                <select
                  value={environmentSettings.preset}
                  onChange={(e) => onEnvironmentSettingsChange({ ...environmentSettings, preset: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="sunset">Sunset</option>
                  <option value="dawn">Dawn</option>
                  <option value="night">Night</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="forest">Forest</option>
                  <option value="apartment">Apartment</option>
                  <option value="studio">Studio</option>
                  <option value="city">City</option>
                  <option value="park">Park</option>
                  <option value="lobby">Lobby</option>
                </select>
              </div>
            )}
          </div>

          {/* Turf Lines Control */}
          <div className="border-2 border-blue-300 rounded-lg overflow-hidden bg-blue-50">
            <div className="flex items-center justify-between p-3 bg-blue-100 hover:bg-blue-150 transition-colors">
              <button
                onClick={() => setTurfLinesExpanded(!turfLinesExpanded)}
                className="flex-1 text-left font-bold text-blue-900 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Turf Lines
              </button>

              <button
                onClick={() => onTurfLineSettingsChange({
                  ...turfLineSettings,
                  visible: !turfLineSettings.visible
                })}
                className={`ml-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${turfLineSettings.visible
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
              >
                {turfLineSettings.visible ? 'Visible' : 'Hidden'}
              </button>

              <button
                onClick={() => setTurfLinesExpanded(!turfLinesExpanded)}
                className="ml-2 text-blue-700 hover:text-blue-900"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${turfLinesExpanded ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {turfLinesExpanded && (
              <div className="p-3 bg-white border-t border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Colour
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['#ffffff', '#ffeb3b', '#ff9800', '#2196f3', '#4caf50', '#9c27b0', '#f44336', '#000000'].map((color) => (
                    <button
                      key={color}
                      onClick={() => onTurfLineSettingsChange({ ...turfLineSettings, color })}
                      className={`w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${turfLineSettings.color === color ? 'border-gray-800 ring-2 ring-offset-2 ring-blue-400' : 'border-gray-300'
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Colour
                  </label>
                  <input
                    type="color"
                    value={turfLineSettings.color}
                    onChange={(e) => onTurfLineSettingsChange({ ...turfLineSettings, color: e.target.value })}
                    className="w-full h-10 rounded-md cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300 my-4"></div>

          {/* Mesh Controls Section Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Scene Meshes
              <span className="text-sm font-normal text-gray-600">({meshNames.length})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Configure individual mesh properties</p>
          </div>

          {/* Mesh Controls */}
          {meshNames.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No meshes detected yet</p>
              <p className="text-xs mt-1">Loading model...</p>
            </div>
          ) : (
            meshNames.map((meshName) => {
              const settings = meshSettings[meshName]
              const isExpanded = expandedMeshes[meshName]

              return (
                <div key={meshName} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <button
                      onClick={() => toggleMeshExpanded(meshName)}
                      className="flex-1 text-left font-medium text-gray-700 truncate"
                      title={meshName}
                    >
                      {meshName}
                    </button>

                    <button
                      onClick={() => toggleVisibility(meshName)}
                      className={`ml-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${settings.visible
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                        }`}
                    >
                      {settings.visible ? 'Visible' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => toggleMeshExpanded(meshName)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-3 bg-white border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colour
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#ffffff', '#333333'].map((color) => (
                          <button
                            key={color}
                            onClick={() => changeColor(meshName, color)}
                            className={`w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${settings.color === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                              }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Colour
                        </label>
                        <input
                          type="color"
                          value={settings.color || '#ffffff'}
                          onChange={(e) => changeColor(meshName, e.target.value)}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </div>

                      {/* Material Properties */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Material Properties</h4>

                        {/* Metalness */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-gray-600">Metalness</label>
                            <span className="text-xs text-gray-500">{(settings.metalness || 0).toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.metalness || 0}
                            onChange={(e) => changeMaterialProperty(meshName, 'metalness', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        {/* Roughness */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-gray-600">Roughness</label>
                            <span className="text-xs text-gray-500">{(settings.roughness || 1).toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.roughness || 1}
                            onChange={(e) => changeMaterialProperty(meshName, 'roughness', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        {/* Opacity */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-gray-600">Opacity</label>
                            <span className="text-xs text-gray-500">{(settings.opacity || 1).toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.opacity || 1}
                            onChange={(e) => changeMaterialProperty(meshName, 'opacity', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

