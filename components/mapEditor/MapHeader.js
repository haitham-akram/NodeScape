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
    <Panel
      position="top-right"
      style={{
        padding: '10px',
        background: 'var(--theme-surface)',
        borderRadius: '8px',
        border: '1px solid var(--theme-border)',
        boxShadow: '0 4px 12px var(--theme-shadow)',
        color: 'var(--theme-text)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
      }}
    >
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
              border: '1px solid var(--theme-border)',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
          />
          {mapModifiedAfterLoad && (
            <small
              style={{
                color: 'var(--theme-warning)',
                marginTop: '4px',
                display: 'block',
                transition: 'color 0.3s ease',
              }}
            >
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
              background: 'var(--theme-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
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
              background: 'var(--theme-success)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
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
                border: `1px solid var(--theme-border)`,
                borderRadius: '4px',
                fontSize: '14px',
                background: 'var(--theme-bg)',
                color: 'var(--theme-text)',
                transition: 'all 0.2s ease',
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
                background: 'var(--theme-surface)',
                border: `1px solid var(--theme-border)`,
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: 'var(--theme-text)',
                transition: 'all 0.2s ease',
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
              background: 'var(--theme-surface)',
              border: `1px solid var(--theme-border)`,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              color: 'var(--theme-text)',
              transition: 'all 0.2s ease',
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
              background: 'var(--theme-surface)',
              border: `1px solid var(--theme-border)`,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              color: 'var(--theme-text)',
              transition: 'all 0.2s ease',
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
              background: 'var(--theme-surface)',
              border: `1px solid var(--theme-border)`,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              color: 'var(--theme-text)',
              transition: 'all 0.2s ease',
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
              background: 'var(--theme-error-bg)',
              border: `1px solid var(--theme-error)`,
              color: 'var(--theme-error)',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'all 0.2s ease',
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
