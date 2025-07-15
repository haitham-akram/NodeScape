import React, { useState } from 'react'
import { Panel } from 'reactflow'

/**
 * Compact Map Controls Component
 * Provides a clean, minimal UI for node operations
 */
const MapControls = ({
  addNode,
  linkSelectedNodes,
  linkAllNodes,
  smartLinkNodes,
  autoConnectEnabled,
  setAutoConnectEnabled,
  selectedNodes = [],
  deleteSelectedNodes,
  deleteSelectedEdges,
  selectedEdges = [],
  selectedEdgeType,
  setSelectedEdgeType,
  alignNodes,
  distributeNodes,
  autoLayout,
  darkMode,
  // Undo/Redo functionality
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  // Panel toggles
  onToggleNodeLibrary,
  onToggleTemplates,
  // Execution controls
  executeWorkflow,
  stopExecution,
  resetExecution,
  stepExecution,
  isExecuting = false,
  executionSpeed,
  setExecutionSpeed,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showExecution, setShowExecution] = useState(false)

  const buttonStyle = {
    padding: '6px 8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
    minWidth: '32px',
    justifyContent: 'center',
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    background: darkMode ? '#4CAF50' : '#e8f5e8',
    color: darkMode ? 'white' : '#2e7d2e',
    border: `1px solid ${darkMode ? '#4CAF50' : '#a5d6a7'}`,
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: darkMode ? '#333' : '#f5f5f5',
    color: darkMode ? '#ccc' : '#666',
    border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    background: darkMode ? '#222' : '#f5f5f5',
    color: darkMode ? '#555' : '#ccc',
    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    cursor: 'not-allowed',
    opacity: 0.5,
  }

  const executionButtonStyle = {
    ...buttonStyle,
    background: isExecuting ? '#ff4444' : darkMode ? '#2196F3' : '#e3f2fd',
    color: isExecuting ? 'white' : darkMode ? 'white' : '#1976d2',
    border: `1px solid ${isExecuting ? '#ff4444' : darkMode ? '#2196F3' : '#90caf9'}`,
  }

  return (
    <>
      {/* Main Compact Toolbar */}
      <Panel
        position="top-left"
        style={{
          padding: '8px',
          background: darkMode ? 'rgba(40,40,40,0.95)' : 'rgba(255,255,255,0.95)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Quick Add Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              paddingRight: '8px',
              borderRight: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
            }}
          >
            <button onClick={() => addNode('default')} style={primaryButtonStyle} title="Add Node (N)">
              ➕
            </button>
            <button onClick={() => addNode('input')} style={secondaryButtonStyle} title="Add Input">
              📥
            </button>
            <button onClick={() => addNode('output')} style={secondaryButtonStyle} title="Add Output">
              📤
            </button>
          </div>

          {/* Undo/Redo */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              paddingRight: '8px',
              borderRight: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
            }}
          >
            <button
              onClick={onUndo}
              disabled={!canUndo}
              style={canUndo ? secondaryButtonStyle : disabledButtonStyle}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              style={canRedo ? secondaryButtonStyle : disabledButtonStyle}
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>

          {/* Execution Controls */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              paddingRight: '8px',
              borderRight: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
            }}
          >
            <button
              onClick={isExecuting ? stopExecution : executeWorkflow}
              style={executionButtonStyle}
              title={isExecuting ? 'Stop Execution' : 'Run Workflow (F5)'}
            >
              {isExecuting ? '⏹️' : '▶️'}
            </button>
            <button onClick={resetExecution} style={secondaryButtonStyle} title="Reset">
              🔄
            </button>
          </div>

          {/* Toggle Buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={showAdvanced ? primaryButtonStyle : secondaryButtonStyle}
              title="More Tools"
            >
              ⚙️
            </button>
            <button
              onClick={() => setShowExecution(!showExecution)}
              style={showExecution ? primaryButtonStyle : secondaryButtonStyle}
              title="Execution Settings"
            >
              ⚡
            </button>
            <button onClick={onToggleNodeLibrary} style={secondaryButtonStyle} title="Node Library">
              📚
            </button>
          </div>
        </div>
      </Panel>

      {/* Advanced Tools Panel */}
      {showAdvanced && (
        <Panel
          position="top-left"
          style={{
            marginTop: '60px',
            padding: '8px',
            background: darkMode ? 'rgba(40,40,40,0.95)' : 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 'bold', color: darkMode ? '#ccc' : '#666', marginBottom: '4px' }}
            >
              CONNECTION TOOLS
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={linkSelectedNodes}
                disabled={selectedNodes.length < 2}
                style={selectedNodes.length >= 2 ? primaryButtonStyle : disabledButtonStyle}
                title={`Link Selected (${selectedNodes.length})`}
              >
                🔗 Link Selected
              </button>
              <button onClick={linkAllNodes} style={secondaryButtonStyle} title="Link All Nodes">
                🔄 Link All
              </button>
            </div>
            <button onClick={smartLinkNodes} style={primaryButtonStyle} title="Smart Link Nodes">
              🧠 Smart Link
            </button>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: darkMode ? '#ccc' : '#666',
                marginTop: '8px',
                marginBottom: '4px',
              }}
            >
              LAYOUT TOOLS
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={alignNodes}
                disabled={selectedNodes.length < 2}
                style={selectedNodes.length >= 2 ? secondaryButtonStyle : disabledButtonStyle}
                title="Align Selected"
              >
                📐 Align
              </button>
              <button
                onClick={distributeNodes}
                disabled={selectedNodes.length < 3}
                style={selectedNodes.length >= 3 ? secondaryButtonStyle : disabledButtonStyle}
                title="Distribute Selected"
              >
                📏 Distribute
              </button>
              <button onClick={autoLayout} style={primaryButtonStyle} title="Auto Layout">
                🎯 Auto Layout
              </button>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                marginTop: '8px',
                color: darkMode ? '#ccc' : '#666',
              }}
            >
              <input
                type="checkbox"
                checked={autoConnectEnabled}
                onChange={(e) => setAutoConnectEnabled(e.target.checked)}
              />
              Auto-Connect
            </label>
          </div>
        </Panel>
      )}

      {/* Execution Settings Panel */}
      {showExecution && (
        <Panel
          position="top-left"
          style={{
            marginTop: '60px',
            marginLeft: showAdvanced ? '220px' : '0px',
            padding: '8px',
            background: darkMode ? 'rgba(40,40,40,0.95)' : 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
            <div
              style={{ fontSize: '11px', fontWeight: 'bold', color: darkMode ? '#ccc' : '#666', marginBottom: '4px' }}
            >
              EXECUTION CONTROLS
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={stepExecution} style={secondaryButtonStyle} title="Step Through">
                ⏭️ Step
              </button>
              <button onClick={onToggleTemplates} style={secondaryButtonStyle} title="Templates">
                🎨 Templates
              </button>
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: darkMode ? '#ccc' : '#666',
                marginTop: '4px',
                marginBottom: '4px',
              }}
            >
              SPEED CONTROL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: darkMode ? '#ccc' : '#666', minWidth: '30px' }}>
                {executionSpeed}ms
              </span>
              <input
                type="range"
                min="100"
                max="3000"
                step="100"
                value={executionSpeed}
                onChange={(e) => setExecutionSpeed(parseInt(e.target.value))}
                style={{
                  flex: 1,
                  height: '4px',
                  background: darkMode ? '#555' : '#ddd',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>

            {selectedNodes.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: darkMode ? '#ccc' : '#666',
                    marginTop: '8px',
                    marginBottom: '4px',
                  }}
                >
                  SELECTED ({selectedNodes.length})
                </div>
                <button
                  onClick={deleteSelectedNodes}
                  style={{
                    ...buttonStyle,
                    background: '#ffebee',
                    color: '#c62828',
                    border: '1px solid #ef9a9a',
                  }}
                  title="Delete Selected"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </Panel>
      )}
    </>
  )
}

export default MapControls
