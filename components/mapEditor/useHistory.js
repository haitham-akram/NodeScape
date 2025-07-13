import { useState, useCallback, useRef } from 'react'

/**
 * History Management Hook
 * Provides undo/redo functionality for nodes and edges
 */
const useHistory = (initialNodes = [], initialEdges = []) => {
  const [historyIndex, setHistoryIndex] = useState(0)
  const [history, setHistory] = useState([
    {
      nodes: initialNodes,
      edges: initialEdges,
      timestamp: Date.now(),
    },
  ])

  const maxHistorySize = 50
  const isUndoRedoOperation = useRef(false)

  /**
   * Add a new state to history
   * @param {Array} nodes - Current nodes state
   * @param {Array} edges - Current edges state
   */
  const addToHistory = useCallback(
    (nodes, edges) => {
      // Don't add to history if this is an undo/redo operation
      if (isUndoRedoOperation.current) {
        isUndoRedoOperation.current = false
        return
      }

      setHistory((prevHistory) => {
        // Remove any history after current index (when we make changes after undoing)
        const newHistory = prevHistory.slice(0, historyIndex + 1)

        // Add new state
        newHistory.push({
          nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
          edges: JSON.parse(JSON.stringify(edges)), // Deep clone
          timestamp: Date.now(),
        })

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift()
          setHistoryIndex((prevIndex) => prevIndex - 1)
          return newHistory
        }

        setHistoryIndex(newHistory.length - 1)
        return newHistory
      })
    },
    [historyIndex]
  )

  /**
   * Undo the last action
   * @returns {Object|null} - Previous state or null if can't undo
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const previousState = history[newIndex]

      setHistoryIndex(newIndex)
      isUndoRedoOperation.current = true

      return {
        nodes: previousState.nodes,
        edges: previousState.edges,
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
      isUndoRedoOperation.current = true

      return {
        nodes: nextState.nodes,
        edges: nextState.edges,
      }
    }
    return null
  }, [historyIndex, history])

  /**
   * Clear history and start fresh
   * @param {Array} nodes - Initial nodes
   * @param {Array} edges - Initial edges
   */
  const clearHistory = useCallback((nodes = [], edges = []) => {
    setHistory([
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        timestamp: Date.now(),
      },
    ])
    setHistoryIndex(0)
  }, [])

  return {
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    addToHistory,
    undo,
    redo,
    clearHistory,
    historyLength: history.length,
    currentIndex: historyIndex,
  }
}

export default useHistory
