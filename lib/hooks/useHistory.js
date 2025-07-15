import { useState, useCallback, useRef, useMemo } from 'react'

/**
 * History Management Hook
 * Provides undo/redo functionality for nodes and edges
 */
const useHistory = (nodes = [], edges = []) => {
  const [historyIndex, setHistoryIndex] = useState(0)
  const [history, setHistory] = useState([
    {
      nodes: [],
      edges: [],
      timestamp: Date.now(),
    },
  ])

  const maxHistorySize = 50
  const isUpdatingFromHistory = useRef(false)

  // Manual history push function - called explicitly when state changes
  const pushToHistory = useCallback((newNodes, newEdges) => {
    if (isUpdatingFromHistory.current) {
      return // Don't record history during undo/redo
    }

    setHistory((prevHistory) => {
      // Remove any history after current index (when we make changes after undoing)
      const newHistory = prevHistory.slice(0, historyIndex + 1)

      // Add new state
      const newEntry = {
        nodes: JSON.parse(JSON.stringify(newNodes)), // Deep clone
        edges: JSON.parse(JSON.stringify(newEdges)), // Deep clone
        timestamp: Date.now(),
      }

      newHistory.push(newEntry)

      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift()
        // Don't update index since we removed from the beginning
        return newHistory
      }

      return newHistory
    })

    setHistoryIndex(prevIndex => {
      const newHistoryLength = Math.min(maxHistorySize, historyIndex + 2)
      return newHistoryLength - 1
    })
  }, [historyIndex])

  /**
   * Undo the last action
   * @returns {Object|null} - Previous state or null if can't undo
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const previousState = history[newIndex]

      setHistoryIndex(newIndex)
      isUpdatingFromHistory.current = true
      
      // Reset the flag after a microtask to allow the state update to complete
      setTimeout(() => {
        isUpdatingFromHistory.current = false
      }, 0)

      return {
        nodes: JSON.parse(JSON.stringify(previousState.nodes)),
        edges: JSON.parse(JSON.stringify(previousState.edges)),
      }
    }
    return null
  }, [historyIndex, history])

  /**
   * Redo the last undone action
   * @returns {Object|null} - Next state or null if can't redo
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const nextState = history[newIndex]

      setHistoryIndex(newIndex)
      isUpdatingFromHistory.current = true
      
      // Reset the flag after a microtask to allow the state update to complete
      setTimeout(() => {
        isUpdatingFromHistory.current = false
      }, 0)

      return {
        nodes: JSON.parse(JSON.stringify(nextState.nodes)),
        edges: JSON.parse(JSON.stringify(nextState.edges)),
      }
    }
    return null
  }, [historyIndex, history])

  /**
   * Clear history and start fresh
   * @param {Array} initialNodes - Initial nodes
   * @param {Array} initialEdges - Initial edges
   */
  const clearHistory = useCallback((initialNodes = [], initialEdges = []) => {
    setHistory([
      {
        nodes: JSON.parse(JSON.stringify(initialNodes)),
        edges: JSON.parse(JSON.stringify(initialEdges)),
        timestamp: Date.now(),
      },
    ])
    setHistoryIndex(0)
    isUpdatingFromHistory.current = false
  }, [])

  // Compute can undo/redo to avoid unnecessary re-renders
  const canUndo = useMemo(() => historyIndex > 0, [historyIndex])
  const canRedo = useMemo(() => historyIndex < history.length - 1, [historyIndex, history.length])

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory,
    pushToHistory, // Export this so components can manually record history
    historyLength: history.length,
    currentIndex: historyIndex,
  }
}

export default useHistory
