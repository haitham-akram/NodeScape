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
  onToggleCommandPalette,
  onToggleThemes,
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
    background: 'var(--theme-surface)',
    color: 'var(--theme-text)',
    border: `1px solid var(--theme-border)`,
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'var(--theme-surface)',
    color: 'var(--theme-text-secondary)',
    border: `1px solid var(--theme-border)`,
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    background: 'var(--theme-surface-secondary)',
    color: 'var(--theme-text-muted)',
    border: `1px solid var(--theme-border)`,
    cursor: 'not-allowed',
    opacity: 0.5,
  }

  const executionButtonStyle = {
    ...buttonStyle,
    background: 'var(--theme-surface)',
    color: 'var(--theme-text)',
    border: `1px solid var(--theme-border)`,
  }

  return (
    <>
      {/* Main Compact Toolbar */}
      <Panel
        position="top-left"
        style={{
          padding: '8px',
          background: 'var(--theme-surface)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          border: `1px solid var(--theme-border)`,
          transition: 'all 0.3s ease',
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
              borderRight: `1px solid var(--theme-border)`,
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
              borderRight: `1px solid var(--theme-border)`,
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
              borderRight: `1px solid var(--theme-border)`,
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
              onClick={onToggleCommandPalette}
              style={secondaryButtonStyle}
              title="Command Palette (Ctrl+Shift+P)"
            >
              🎯
            </button>
            <button onClick={onToggleThemes} style={secondaryButtonStyle} title="Themes & Customization">
              🎨
            </button>
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
            background: 'var(--theme-surface)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: `1px solid var(--theme-border)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'var(--theme-text-secondary)',
                marginBottom: '4px',
              }}
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
                color: 'var(--theme-text-secondary)',
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

            {/* Command Palette Info */}
            <div
              style={{
                marginTop: '12px',
                padding: '8px',
                background: 'var(--theme-success-bg, rgba(76, 175, 80, 0.1))',
                border: `1px solid var(--theme-success)`,
                borderRadius: '4px',
                fontSize: '11px',
                color: 'var(--theme-success)',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>💡 Pro Tip</div>
              <div>
                Press{' '}
                <code
                  style={{
                    background: 'var(--theme-surface-secondary)',
                    padding: '1px 4px',
                    borderRadius: '2px',
                    fontSize: '10px',
                    color: 'var(--theme-text)',
                  }}
                >
                  Ctrl+Shift+P
                </code>{' '}
                or click 🎯 for Command Palette
              </div>
            </div>
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
            background: 'var(--theme-surface)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: `1px solid var(--theme-border)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'var(--theme-text-secondary)',
                marginBottom: '4px',
              }}
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
                color: 'var(--theme-text-secondary)',
                marginTop: '4px',
                marginBottom: '4px',
              }}
            >
              SPEED CONTROL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--theme-text-secondary)', minWidth: '30px' }}>
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
