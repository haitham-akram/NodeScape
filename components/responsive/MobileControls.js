import React from 'react'
import { Panel } from 'reactflow'
import { useMobileDetection } from './MobileDetection'

/**
 * Mobile Controls Component
 * Provides touch-optimized controls for mobile devices
 */
const MobileControls = ({
  addNode,
  deleteSelectedNodes,
  deleteSelectedEdges,
  selectedNodes = [],
  selectedEdges = [],
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  darkMode,
  onToggleNodeLibrary,
  onToggleTemplates,
  onToggleCommandPalette,
  executeWorkflow,
  stopExecution,
  isExecuting,
  onSettings,
}) => {
  const { isMobile, isTablet, touchDevice } = useMobileDetection()

  // Don't render if not on mobile/tablet
  if (!isMobile && !isTablet && !touchDevice) {
    return null
  }

  const buttonStyle = {
    padding: '12px',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px',
    minHeight: '48px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    background: darkMode ? '#4CAF50' : '#2196F3',
    color: 'white',
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: darkMode ? '#333' : '#fff',
    color: darkMode ? '#ccc' : '#666',
    border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
  }

  const dangerButtonStyle = {
    ...buttonStyle,
    background: '#f44336',
    color: 'white',
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    background: darkMode ? '#222' : '#f5f5f5',
    color: darkMode ? '#555' : '#ccc',
    cursor: 'not-allowed',
    opacity: 0.5,
  }

  return (
    <>
      {/* Primary Actions - Bottom Center */}
      <Panel
        position="bottom-center"
        style={{
          padding: '12px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        {/* Add Node */}
        <button onClick={() => addNode('default')} style={primaryButtonStyle} title="Add Node">
          ➕
        </button>

        {/* Execute/Stop */}
        <button
          onClick={isExecuting ? stopExecution : executeWorkflow}
          style={isExecuting ? dangerButtonStyle : primaryButtonStyle}
          title={isExecuting ? 'Stop Execution' : 'Run Workflow'}
        >
          {isExecuting ? '⏹️' : '▶️'}
        </button>

        {/* Command Palette */}
        <button onClick={onToggleCommandPalette} style={secondaryButtonStyle} title="Command Palette">
          🎯
        </button>

        {/* Settings */}
        <button onClick={onSettings} style={secondaryButtonStyle} title="Settings">
          ⚙️
        </button>
      </Panel>

      {/* Secondary Actions - Bottom Left */}
      <Panel
        position="bottom-left"
        style={{
          padding: '12px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-start',
        }}
      >
        {/* Undo/Redo */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={canUndo ? secondaryButtonStyle : disabledButtonStyle}
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={canRedo ? secondaryButtonStyle : disabledButtonStyle}
            title="Redo"
          >
            ↷
          </button>
        </div>

        {/* Delete Selected Items */}
        {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
          <button
            onClick={() => {
              deleteSelectedNodes()
              deleteSelectedEdges()
            }}
            style={dangerButtonStyle}
            title={`Delete Selected (${selectedNodes.length + selectedEdges.length})`}
          >
            🗑️
          </button>
        )}
      </Panel>

      {/* Tool Access - Bottom Right */}
      <Panel
        position="bottom-right"
        style={{
          padding: '12px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end',
        }}
      >
        {/* Node Library */}
        <button onClick={onToggleNodeLibrary} style={secondaryButtonStyle} title="Node Library">
          📚
        </button>

        {/* Templates */}
        <button onClick={onToggleTemplates} style={secondaryButtonStyle} title="Templates">
          🎨
        </button>
      </Panel>
    </>
  )
}

export default MobileControls
