import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/AdvancedThemeContext'

/**
 * Command Palette Component
 * Provides a searchable command interface similar to VS Code
 */
const CommandPalette = ({ isOpen, onClose, actions = {}, shortcuts = {}, getFormattedShortcut }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [filteredCommands, setFilteredCommands] = useState([])
  const inputRef = useRef(null)
  const { theme } = useTheme()

  // Define all available commands
  const commands = [
    // Node Operations
    { id: 'addNode', label: 'Add Node', category: 'Nodes', action: 'addNode', icon: '➕' },
    { id: 'addInputNode', label: 'Add Input Node', category: 'Nodes', action: 'addInputNode', icon: '📥' },
    { id: 'addOutputNode', label: 'Add Output Node', category: 'Nodes', action: 'addOutputNode', icon: '📤' },
    { id: 'deleteSelected', label: 'Delete Selected', category: 'Nodes', action: 'deleteSelected', icon: '🗑️' },
    { id: 'selectAll', label: 'Select All', category: 'Selection', action: 'selectAll', icon: '⚫' },
    { id: 'clearSelection', label: 'Clear Selection', category: 'Selection', action: 'clearSelection', icon: '⭕' },

    // Editing
    { id: 'undo', label: 'Undo', category: 'Edit', action: 'undo', icon: '↶' },
    { id: 'redo', label: 'Redo', category: 'Edit', action: 'redo', icon: '↷' },
    { id: 'copySelected', label: 'Copy Selected', category: 'Edit', action: 'copySelected', icon: '📋' },
    { id: 'pasteNodes', label: 'Paste', category: 'Edit', action: 'pasteNodes', icon: '📄' },
    { id: 'duplicateSelected', label: 'Duplicate Selected', category: 'Edit', action: 'duplicateSelected', icon: '📑' },

    // File Operations
    { id: 'saveMap', label: 'Save Map', category: 'File', action: 'saveMap', icon: '💾' },
    { id: 'saveAsMap', label: 'Save As...', category: 'File', action: 'saveAsMap', icon: '💾' },
    { id: 'loadMap', label: 'Load Map', category: 'File', action: 'loadMap', icon: '📂' },
    { id: 'exportMap', label: 'Export JSON', category: 'File', action: 'exportMap', icon: '📤' },
    { id: 'exportPNG', label: 'Export PNG', category: 'File', action: 'exportPNG', icon: '🖼️' },
    { id: 'importMap', label: 'Import JSON', category: 'File', action: 'importMap', icon: '📥' },

    // View
    { id: 'fitView', label: 'Fit View', category: 'View', action: 'fitView', icon: '🎯' },
    { id: 'resetZoom', label: 'Reset Zoom', category: 'View', action: 'resetZoom', icon: '🔍' },
    { id: 'zoomIn', label: 'Zoom In', category: 'View', action: 'zoomIn', icon: '🔍' },
    { id: 'zoomOut', label: 'Zoom Out', category: 'View', action: 'zoomOut', icon: '🔍' },

    // Execution
    { id: 'executeWorkflow', label: 'Execute Workflow', category: 'Execution', action: 'executeWorkflow', icon: '▶️' },
    { id: 'stopExecution', label: 'Stop Execution', category: 'Execution', action: 'stopExecution', icon: '⏹️' },
    { id: 'stepExecution', label: 'Step Execution', category: 'Execution', action: 'stepExecution', icon: '⏭️' },
    { id: 'resetExecution', label: 'Reset Execution', category: 'Execution', action: 'resetExecution', icon: '🔄' },

    // Layout
    { id: 'autoLayout', label: 'Auto Layout', category: 'Layout', action: 'autoLayout', icon: '🎯' },
    { id: 'alignNodes', label: 'Align Nodes', category: 'Layout', action: 'alignNodes', icon: '📐' },
    { id: 'distributeNodes', label: 'Distribute Nodes', category: 'Layout', action: 'distributeNodes', icon: '📏' },

    // Connection
    { id: 'linkSelected', label: 'Link Selected Nodes', category: 'Connection', action: 'linkSelected', icon: '🔗' },
    { id: 'linkAll', label: 'Link All Nodes', category: 'Connection', action: 'linkAll', icon: '🔄' },
    { id: 'smartLink', label: 'Smart Link', category: 'Connection', action: 'smartLink', icon: '🧠' },

    // Panels
    {
      id: 'toggleNodeLibrary',
      label: 'Toggle Node Library',
      category: 'Panels',
      action: 'toggleNodeLibrary',
      icon: '📚',
    },
    { id: 'toggleTemplates', label: 'Toggle Templates', category: 'Panels', action: 'toggleTemplates', icon: '🎨' },
    { id: 'toggleThemes', label: 'Open Themes Panel', category: 'Panels', action: 'toggleThemes', icon: '🎨' },
    { id: 'openSettings', label: 'Open Settings', category: 'Panels', action: 'openSettings', icon: '⚙️' },

    // Themes
    { id: 'cycleTheme', label: 'Cycle Built-in Themes', category: 'Themes', action: 'cycleTheme', icon: '🔄' },
    { id: 'lightTheme', label: 'Switch to Light Theme', category: 'Themes', action: 'lightTheme', icon: '☀️' },
    { id: 'darkTheme', label: 'Switch to Dark Theme', category: 'Themes', action: 'darkTheme', icon: '🌙' },
    { id: 'blueTheme', label: 'Switch to Ocean Blue Theme', category: 'Themes', action: 'blueTheme', icon: '🌊' },
    { id: 'greenTheme', label: 'Switch to Forest Green Theme', category: 'Themes', action: 'greenTheme', icon: '🌲' },
    { id: 'purpleTheme', label: 'Switch to Royal Purple Theme', category: 'Themes', action: 'purpleTheme', icon: '👑' },
    {
      id: 'sunsetTheme',
      label: 'Switch to Sunset Orange Theme',
      category: 'Themes',
      action: 'sunsetTheme',
      icon: '🌅',
    },
    {
      id: 'midnightTheme',
      label: 'Switch to Midnight Blue Theme',
      category: 'Themes',
      action: 'midnightTheme',
      icon: '🌙',
    },
    {
      id: 'cyberpunkTheme',
      label: 'Switch to Cyberpunk Theme',
      category: 'Themes',
      action: 'cyberpunkTheme',
      icon: '⚡',
    },
  ]

  // Filter commands based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCommands(commands)
    } else {
      const filtered = commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCommands(filtered)
    }
    setSelectedIndex(0)
  }, [searchTerm])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands])

  const executeCommand = (command) => {
    if (actions[command.action]) {
      actions[command.action]()
      onClose()
      setSearchTerm('')
    }
  }

  const getShortcutDisplay = (action) => {
    for (const [key, shortcutAction] of Object.entries(shortcuts)) {
      if (shortcutAction === action) {
        return getFormattedShortcut ? getFormattedShortcut(key) : key
      }
    }
    return null
  }

  if (!isOpen) return null

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.colors.overlay,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '10vh',
  }

  const paletteStyle = {
    width: '600px',
    maxWidth: '90vw',
    maxHeight: '70vh',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    boxShadow: `0 16px 64px ${theme.colors.shadow}`,
    overflow: 'hidden',
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: 'none',
    outline: 'none',
    fontSize: '18px',
    background: theme.colors.surface,
    color: theme.colors.text,
    borderBottom: `1px solid ${theme.colors.border}`,
  }

  const resultsStyle = {
    maxHeight: '400px',
    overflowY: 'auto',
  }

  const commandStyle = (index) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    background: index === selectedIndex ? theme.colors.primary + '20' : 'transparent',
    borderLeft: index === selectedIndex ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.1s ease',
  })

  const commandInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  const iconStyle = {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  }

  const labelStyle = {
    fontSize: '14px',
    color: theme.colors.text,
    fontWeight: '500',
  }

  const categoryStyle = {
    fontSize: '12px',
    color: theme.colors.textMuted,
    marginLeft: '8px',
  }

  const shortcutStyle = {
    fontSize: '12px',
    color: theme.colors.textMuted,
    background: theme.colors.surfaceSecondary,
    padding: '2px 6px',
    borderRadius: '4px',
    border: `1px solid ${theme.colors.border}`,
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={paletteStyle} onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a command..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        {/* Results */}
        <div style={resultsStyle}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.textMuted }}>No commands found</div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                style={commandStyle(index)}
                onClick={() => executeCommand(command)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={commandInfoStyle}>
                  <span style={iconStyle}>{command.icon}</span>
                  <div>
                    <span style={labelStyle}>{command.label}</span>
                    <span style={categoryStyle}>{command.category}</span>
                  </div>
                </div>
                {getShortcutDisplay(command.action) && (
                  <span style={shortcutStyle}>{getShortcutDisplay(command.action)}</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '8px 20px',
            borderTop: `1px solid ${theme.colors.border}`,
            fontSize: '12px',
            color: theme.colors.textMuted,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
          <span>{filteredCommands.length} commands</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
