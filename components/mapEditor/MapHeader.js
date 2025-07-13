import React from 'react'
import { Panel } from 'reactflow'

/**
 * Map Header Component
 * Provides UI controls for map management (save, load, export, etc.)
 */
const MapHeader = ({
  currentMapName,
  setCurrentMapName,
  saveMap,
  loadMapById,
  deleteMap,
  exportToPNG,
  exportToJSON,
  importFromJSON,
  availableMaps,
  fetchAvailableMaps,
  loadMapId,
  setLoadMapId,
  mapModifiedAfterLoad,
  isLoading,
}) => {
  return (
    <Panel position="top-right" style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        {/* Map Name Input */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={currentMapName}
            onChange={(e) => setCurrentMapName(e.target.value)}
            placeholder="Enter map name"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          {mapModifiedAfterLoad && (
            <small style={{ color: '#f57c00', marginTop: '4px', display: 'block' }}>
              Map modified - Save your changes
            </small>
          )}
        </div>

        {/* Save/Load Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={saveMap}
            disabled={isLoading}
          >
            <span style={{ marginRight: '5px' }}>💾</span> Save Map
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={() => loadMapById(loadMapId)}
            disabled={!loadMapId || isLoading}
          >
            <span style={{ marginRight: '5px' }}>📂</span> Load Map
          </button>
        </div>

        {/* Map Selection */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <select
              value={loadMapId}
              onChange={(e) => setLoadMapId(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="">-- Select a map --</option>
              {availableMaps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name} ({new Date(map.updatedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
            <button
              style={{
                padding: '8px 12px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
              }}
              onClick={fetchAvailableMaps}
              disabled={isLoading}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Import/Export Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={exportToPNG}
            disabled={isLoading}
          >
            <span style={{ marginRight: '5px' }}>🖼️</span> Export PNG
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={exportToJSON}
            disabled={isLoading}
          >
            <span style={{ marginRight: '5px' }}>📤</span> Export JSON
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={importFromJSON}
            disabled={isLoading}
          >
            <span style={{ marginRight: '5px' }}>📥</span> Import JSON
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              color: '#c62828',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={deleteMap}
            disabled={!currentMapName || isLoading}
          >
            <span style={{ marginRight: '5px' }}>🗑️</span> Delete Map
          </button>
        </div>
      </div>
    </Panel>
  )
}

export default MapHeader
