import { useEffect, useState, useCallback } from 'react'

/**
 * Keyboard Shortcuts Hook
 * Provides configurable keyboard shortcuts management
 */
export const useKeyboardShortcuts = (actions = {}) => {
  const [shortcuts, setShortcuts] = useState({
    // Node operations
    'ctrl+n': 'addNode',
    n: 'addNode',
    'ctrl+i': 'addInputNode',
    i: 'addInputNode',
    'ctrl+o': 'addOutputNode',
    o: 'addOutputNode',

    // Selection and deletion
    delete: 'deleteSelected',
    backspace: 'deleteSelected',
    'ctrl+a': 'selectAll',
    escape: 'clearSelection',

    // Undo/Redo
    'ctrl+z': 'undo',
    'ctrl+y': 'redo',
    'ctrl+shift+z': 'redo',

    // Save/Load
    'ctrl+s': 'saveMap',
    'ctrl+shift+s': 'saveAsMap',
    'ctrl+l': 'loadMap',

    // Export/Import
    'ctrl+e': 'exportMap',
    'ctrl+shift+e': 'exportPNG',
    'ctrl+shift+i': 'importMap',

    // View operations
    'ctrl+f': 'fitView',
    'ctrl+0': 'resetZoom',
    'ctrl+plus': 'zoomIn',
    'ctrl+minus': 'zoomOut',

    // Execution
    f5: 'executeWorkflow',
    'shift+f5': 'stopExecution',
    f6: 'stepExecution',
    f7: 'resetExecution',

    // Layout
    'ctrl+shift+a': 'autoLayout',
    'ctrl+shift+l': 'alignNodes',
    'ctrl+shift+d': 'distributeNodes',

    // Panels
    'ctrl+shift+n': 'toggleNodeLibrary',
    'ctrl+shift+t': 'toggleTemplates',
    'ctrl+shift+p': 'toggleCommandPalette',
    'ctrl+comma': 'openSettings',

    // Connection
    'ctrl+l': 'linkSelected',
    'ctrl+shift+l': 'linkAll',
    'ctrl+alt+l': 'smartLink',

    // Copy/Paste (future feature)
    'ctrl+c': 'copySelected',
    'ctrl+v': 'pasteNodes',
    'ctrl+d': 'duplicateSelected',
  })

  const [customShortcuts, setCustomShortcuts] = useState({})

  // Load custom shortcuts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nodescape-shortcuts')
    if (saved) {
      try {
        setCustomShortcuts(JSON.parse(saved))
      } catch (e) {
        console.warn('Failed to parse shortcuts from localStorage')
      }
    }
  }, [])

  // Save custom shortcuts to localStorage
  useEffect(() => {
    localStorage.setItem('nodescape-shortcuts', JSON.stringify(customShortcuts))
  }, [customShortcuts])

  // Combine default and custom shortcuts
  const allShortcuts = { ...shortcuts, ...customShortcuts }

  const formatKeyCombo = (key) => {
    return key
      .toLowerCase()
      .replace('ctrl+', 'ctrl+')
      .replace('shift+', 'shift+')
      .replace('alt+', 'alt+')
      .replace('meta+', 'cmd+')
  }

  const parseKeyEvent = (event) => {
    const parts = []
    if (event.ctrlKey || event.metaKey) parts.push('ctrl')
    if (event.shiftKey) parts.push('shift')
    if (event.altKey) parts.push('alt')

    let key = event.key.toLowerCase()
    if (key === ' ') key = 'space'
    if (key === '+') key = 'plus'
    if (key === '-') key = 'minus'

    parts.push(key)
    return parts.join('+')
  }

  const handleKeyDown = useCallback(
    (event) => {
      // Ignore if typing in input fields
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.contentEditable === 'true'
      ) {
        return
      }

      const keyCombo = parseKeyEvent(event)
      const action = allShortcuts[keyCombo]

      if (action && actions[action]) {
        event.preventDefault()
        actions[action](event)
      }
    },
    [allShortcuts, actions]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const setCustomShortcut = (keyCombo, action) => {
    setCustomShortcuts((prev) => ({
      ...prev,
      [formatKeyCombo(keyCombo)]: action,
    }))
  }

  const removeCustomShortcut = (keyCombo) => {
    setCustomShortcuts((prev) => {
      const newShortcuts = { ...prev }
      delete newShortcuts[formatKeyCombo(keyCombo)]
      return newShortcuts
    })
  }

  const getShortcutForAction = (action) => {
    for (const [key, actionName] of Object.entries(allShortcuts)) {
      if (actionName === action) {
        return key
      }
    }
    return null
  }

  const getFormattedShortcut = (keyCombo) => {
    return keyCombo
      .replace('ctrl+', '⌘')
      .replace('shift+', '⇧')
      .replace('alt+', '⌥')
      .replace('meta+', '⌘')
      .toUpperCase()
  }

  return {
    shortcuts: allShortcuts,
    setCustomShortcut,
    removeCustomShortcut,
    getShortcutForAction,
    getFormattedShortcut,
  }
}
