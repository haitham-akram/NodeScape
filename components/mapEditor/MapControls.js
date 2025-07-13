import React from 'react'
import { Panel } from 'reactflow'

/**
 * Map Controls Component
 * Provides UI controls for adding nodes, linking nodes, and other operations
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
}) => {
  return (
    <Panel position="top-left" style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            style={{
              padding: '8px 12px',
              background: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={() => addNode('default')}
          >
            <span style={{ marginRight: '5px' }}>➕</span> Add Node
          </button>
          <button
            style={{
              padding: '8px 12px',
              background: '#e8f5e9',
              border: '1px solid #a5d6a7',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={() => addNode('input')}
          >
            <span style={{ marginRight: '5px' }}>📥</span> Add Input
          </button>
          <button
            style={{
              padding: '8px 12px',
              background: '#fff3e0',
              border: '1px solid #ffcc80',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={() => addNode('output')}
          >
            <span style={{ marginRight: '5px' }}>📤</span> Add Output
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            style={{
              padding: '8px 12px',
              background: selectedNodes.length >= 2 ? '#e0f7fa' : '#f5f5f5',
              border: '1px solid #b2ebf2',
              borderRadius: '4px',
              cursor: selectedNodes.length >= 2 ? 'pointer' : 'not-allowed',
              opacity: selectedNodes.length >= 2 ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={() => linkSelectedNodes(selectedNodes)}
            disabled={selectedNodes.length < 2}
          >
            <span style={{ marginRight: '5px' }}>🔗</span> Link Selected ({selectedNodes.length})
          </button>
          <button
            style={{
              padding: '8px 12px',
              background: '#f3e5f5',
              border: '1px solid #e1bee7',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={linkAllNodes}
          >
            <span style={{ marginRight: '5px' }}>🔄</span> Link All
          </button>
          <button
            style={{
              padding: '8px 12px',
              background: '#ede7f6',
              border: '1px solid #d1c4e9',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={smartLinkNodes}
          >
            <span style={{ marginRight: '5px' }}>🧠</span> Smart Link
          </button>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              background: '#f5f5f5',
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
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

        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedNodes.length > 0 && (
            <button
              style={{
                padding: '8px 12px',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
              }}
              onClick={deleteSelectedNodes}
            >
              <span style={{ marginRight: '5px' }}>🗑️</span> Delete Nodes ({selectedNodes.length})
            </button>
          )}

          {selectedEdges.length > 0 && (
            <button
              style={{
                padding: '8px 12px',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
              }}
              onClick={deleteSelectedEdges}
            >
              <span style={{ marginRight: '5px' }}>✂️</span> Delete Edges ({selectedEdges.length})
            </button>
          )}
        </div>

        {/* Undo/Redo Controls */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            style={{
              padding: '8px 12px',
              background: canUndo ? '#fff3e0' : '#f5f5f5',
              border: '1px solid #ffcc80',
              borderRadius: '4px',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              opacity: canUndo ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <span style={{ marginRight: '5px' }}>↶</span> Undo
          </button>
          <button
            style={{
              padding: '8px 12px',
              background: canRedo ? '#e8f5e9' : '#f5f5f5',
              border: '1px solid #a5d6a7',
              borderRadius: '4px',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              opacity: canRedo ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <span style={{ marginRight: '5px' }}>↷</span> Redo
          </button>
        </div>

        {/* Panel Toggle Controls */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            style={{
              padding: '8px 12px',
              background: '#f3e5f5',
              border: '1px solid #e1bee7',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={onToggleNodeLibrary}
            title="Toggle Node Library"
          >
            <span style={{ marginRight: '5px' }}>📚</span> Library
          </button>
          <button
            style={{
              padding: '8px 12px',
              background: '#e1f5fe',
              border: '1px solid #81d4fa',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            onClick={onToggleTemplates}
            title="Toggle Templates"
          >
            <span style={{ marginRight: '5px' }}>🎨</span> Templates
          </button>
        </div>
      </div>
    </Panel>
  )
}

export default MapControls
