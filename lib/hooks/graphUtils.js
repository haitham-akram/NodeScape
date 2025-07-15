import { useCallback } from 'react'

/**
 * Graph Utilities
 * General utility functions for the graph editor
 */
const useGraphUtils = (props) => {
  const { nodes, edges, setNodes, setEdges, setNodeCounter, setSelectedNodes, setSelectedEdges, markMapAsModified } =
    props

  /**
   * Clear all nodes and edges from the graph
   */
  const clearGraph = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNodes([])
    setSelectedEdges([])
    setNodeCounter(1)
    markMapAsModified()
  }, [setNodes, setEdges, setSelectedNodes, setSelectedEdges, setNodeCounter, markMapAsModified])

  /**
   * Handle node selection
   */
  const onNodeClick = useCallback(
    (event, node) => {
      if (event.ctrlKey || event.metaKey) {
        // Multi-select with Ctrl/Cmd
        setSelectedNodes((prev) => (prev.includes(node.id) ? prev.filter((id) => id !== node.id) : [...prev, node.id]))
      } else {
        // Single select
        setSelectedNodes([node.id])
      }
      setSelectedEdges([])
    },
    [setSelectedNodes, setSelectedEdges]
  )

  /**
   * Handle edge selection
   */
  const onEdgeClick = useCallback(
    (event, edge) => {
      if (event.ctrlKey || event.metaKey) {
        // Multi-select with Ctrl/Cmd
        setSelectedEdges((prev) => (prev.includes(edge.id) ? prev.filter((id) => id !== edge.id) : [...prev, edge.id]))
      } else {
        // Single select
        setSelectedEdges([edge.id])
      }
      setSelectedNodes([])
    },
    [setSelectedEdges, setSelectedNodes]
  )

  /**
   * Handle background click to deselect
   */
  const onPaneClick = useCallback(() => {
    setSelectedNodes([])
    setSelectedEdges([])
  }, [setSelectedNodes, setSelectedEdges])

  return {
    // Graph utility functions
    clearGraph,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
  }
}

export default useGraphUtils
