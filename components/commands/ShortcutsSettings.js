import React, { useState } from 'react'
import { Panel } from 'reactflow'
import { useTheme } from '../../contexts/AdvancedThemeContext'

/**
 * Shortcuts Settings Component
 * Allows users to view and customize keyboard shortcuts
 */
const ShortcutsSettings = ({
  shortcuts = {},
  onSetCustomShortcut,
  onRemoveCustomShortcut,
  getFormattedShortcut,
  onClose,
}) => {
  const [editingShortcut, setEditingShortcut] = useState(null)
  const [newKeyCombo, setNewKeyCombo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { theme } = useTheme()

  // Group shortcuts by category
  const categorizedShortcuts = {
    Nodes: ['addNode', 'addInputNode', 'addOutputNode', 'deleteSelected'],
    Selection: ['selectAll', 'clearSelection'],
    Edit: ['undo', 'redo', 'copySelected', 'pasteNodes', 'duplicateSelected'],
    File: ['saveMap', 'saveAsMap', 'loadMap', 'exportMap', 'exportPNG', 'importMap'],
    View: ['fitView', 'resetZoom', 'zoomIn', 'zoomOut'],
    Execution: ['executeWorkflow', 'stopExecution', 'stepExecution', 'resetExecution'],
    Layout: ['autoLayout', 'alignNodes', 'distributeNodes'],
    Connection: ['linkSelected', 'linkAll', 'smartLink'],
    Panels: ['toggleNodeLibrary', 'toggleTemplates', 'toggleCommandPalette', 'openSettings'],
  }

  const actionLabels = {
    addNode: 'Add Node',
    addInputNode: 'Add Input Node',
    addOutputNode: 'Add Output Node',
    deleteSelected: 'Delete Selected',
    selectAll: 'Select All',
    clearSelection: 'Clear Selection',
    undo: 'Undo',
    redo: 'Redo',
    copySelected: 'Copy Selected',
    pasteNodes: 'Paste',
    duplicateSelected: 'Duplicate Selected',
    saveMap: 'Save Map',
    saveAsMap: 'Save As...',
    loadMap: 'Load Map',
    exportMap: 'Export JSON',
    exportPNG: 'Export PNG',
    importMap: 'Import JSON',
    fitView: 'Fit View',
    resetZoom: 'Reset Zoom',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    executeWorkflow: 'Execute Workflow',
    stopExecution: 'Stop Execution',
    stepExecution: 'Step Execution',
    resetExecution: 'Reset Execution',
    autoLayout: 'Auto Layout',
    alignNodes: 'Align Nodes',
    distributeNodes: 'Distribute Nodes',
    linkSelected: 'Link Selected',
    linkAll: 'Link All',
    smartLink: 'Smart Link',
    toggleNodeLibrary: 'Toggle Node Library',
    toggleTemplates: 'Toggle Templates',
    toggleCommandPalette: 'Toggle Command Palette',
    openSettings: 'Open Settings',
  }

  const getShortcutForAction = (action) => {
    for (const [key, shortcutAction] of Object.entries(shortcuts)) {
      if (shortcutAction === action) {
        return key
      }
    }
    return null
  }

  const handleKeyDown = (e) => {
    if (!editingShortcut) return

    e.preventDefault()
    const parts = []
    if (e.ctrlKey || e.metaKey) parts.push('ctrl')
    if (e.shiftKey) parts.push('shift')
    if (e.altKey) parts.push('alt')

    let key = e.key.toLowerCase()
    if (key === ' ') key = 'space'
    if (key === '+') key = 'plus'
    if (key === '-') key = 'minus'
    if (key === 'control' || key === 'shift' || key === 'alt' || key === 'meta') return

    parts.push(key)
    setNewKeyCombo(parts.join('+'))
  }

  const saveShortcut = () => {
    if (newKeyCombo && editingShortcut) {
      onSetCustomShortcut(newKeyCombo, editingShortcut)
      setEditingShortcut(null)
      setNewKeyCombo('')
    }
  }

  const cancelEdit = () => {
    setEditingShortcut(null)
    setNewKeyCombo('')
  }

  const removeShortcut = (action) => {
    const shortcut = getShortcutForAction(action)
    if (shortcut) {
      onRemoveCustomShortcut(shortcut)
    }
  }

  const filteredCategories = Object.entries(categorizedShortcuts).filter(([category, actions]) => {
    if (!searchTerm) return true
    return (
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actions.some((action) => actionLabels[action]?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const containerStyle = {
    width: '500px',
    maxHeight: '700px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    boxShadow: `0 8px 32px ${theme.colors.shadow}`,
    color: theme.colors.text,
    overflow: 'hidden',
  }

  const headerStyle = {
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.colors.surfaceSecondary,
  }

  const searchStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    background: theme.colors.surface,
    color: theme.colors.text,
    fontSize: '14px',
    margin: '16px 20px',
    maxWidth: 'calc(100% - 40px)',
  }

  const categoryStyle = {
    padding: '12px 20px',
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    background: theme.colors.surfaceSecondary,
    fontSize: '14px',
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  }

  const shortcutRowStyle = {
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.borderLight}`,
  }

  const shortcutKeyStyle = {
    fontSize: '12px',
    color: theme.colors.textMuted,
    background: theme.colors.surfaceSecondary,
    padding: '4px 8px',
    borderRadius: '4px',
    border: `1px solid ${theme.colors.border}`,
    minWidth: '80px',
    textAlign: 'center',
  }

  const buttonStyle = {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '4px',
    background: theme.colors.primary,
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    margin: '0 2px',
  }

  const editInputStyle = {
    padding: '4px 8px',
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: '4px',
    background: theme.colors.surface,
    color: theme.colors.text,
    fontSize: '12px',
    minWidth: '120px',
    textAlign: 'center',
  }

  return (
    <Panel position="center" style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>⌨️ Keyboard Shortcuts</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: theme.colors.textSecondary,
          }}
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search shortcuts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
      />

      {/* Content */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {filteredCategories.map(([category, actions]) => (
          <div key={category}>
            <div style={categoryStyle}>{category}</div>
            {actions
              .filter((action) => actionLabels[action])
              .map((action) => {
                const shortcut = getShortcutForAction(action)
                const isEditing = editingShortcut === action

                return (
                  <div key={action} style={shortcutRowStyle}>
                    <span style={{ fontSize: '14px' }}>{actionLabels[action]}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={newKeyCombo}
                            placeholder="Press keys..."
                            onKeyDown={handleKeyDown}
                            style={editInputStyle}
                            readOnly
                          />
                          <button onClick={saveShortcut} style={buttonStyle}>
                            Save
                          </button>
                          <button onClick={cancelEdit} style={{ ...buttonStyle, background: theme.colors.textMuted }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={shortcutKeyStyle}>
                            {shortcut ? (getFormattedShortcut ? getFormattedShortcut(shortcut) : shortcut) : 'Not set'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingShortcut(action)
                              setNewKeyCombo('')
                            }}
                            style={buttonStyle}
                          >
                            Edit
                          </button>
                          {shortcut && (
                            <button
                              onClick={() => removeShortcut(action)}
                              style={{ ...buttonStyle, background: theme.colors.error }}
                            >
                              Remove
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: `1px solid ${theme.colors.border}`,
          fontSize: '12px',
          color: theme.colors.textMuted,
          textAlign: 'center',
        }}
      >
        Click "Edit" to change a shortcut, then press the key combination you want to use
      </div>
    </Panel>
  )
}

export default ShortcutsSettings
