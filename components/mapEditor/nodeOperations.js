import { useCallback } from 'react'

/**
 * Node Operations
 * Provides functions for creating, updating and deleting nodes
 */
const useNodeOperations = (props) => {
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    nodeCounter,
    setNodeCounter,
    selectedNodes,
    setSelectedNodes,
    getViewport,
    markMapAsModified,
  } = props

  /**
   * Calculate the next node counter based on existing nodes
   * @param {Array} nodeList - Array of existing nodes
   * @returns {number} - Next counter value to use
   */
  const calculateNextNodeCounter = useCallback((nodeList) => {
    if (!nodeList || nodeList.length === 0) {
      return 1
    }

    // Find the highest node number from existing node IDs
    let maxNodeNumber = 0
    nodeList.forEach((node) => {
      if (node.id && node.id.startsWith('node-')) {
        const nodeNumber = parseInt(node.id.replace('node-', ''))
        if (!isNaN(nodeNumber) && nodeNumber > maxNodeNumber) {
          maxNodeNumber = nodeNumber
        }
      }
    })

    return maxNodeNumber + 1
  }, [])

  /**
   * Add a new node to the graph
   * @param {string} type - Node type ('default', 'input', 'output')
   * @param {Object} position - Optional position {x, y}
   * @param {string} label - Optional custom label
   * @returns {string} - ID of the created node
   */
  const addNode = useCallback(
    (type = 'default', position = null, label = null) => {
      const viewport = getViewport()
      const nodeId = `node-${nodeCounter}`

      // Generate appropriate default label based on node type
      const getDefaultLabel = (nodeType) => {
        switch (nodeType) {
          case 'input':
            return `Input ${nodeCounter}`
          case 'output':
            return `Output ${nodeCounter}`
          default:
            return `Node ${nodeCounter}`
        }
      }

      const newNode = {
        id: nodeId,
        type: type,
        position: position || {
          x: -viewport.x + 250,
          y: -viewport.y + 150,
        },
        data: {
          label: label || getDefaultLabel(type),
        },
        selected: false,
      }

      setNodes((currentNodes) => [...currentNodes, newNode])
      setNodeCounter((prev) => prev + 1)
      setSelectedNodes([nodeId])
      markMapAsModified() // Mark as modified when adding nodes

      return nodeId
    },
    [nodeCounter, setNodes, getViewport, setNodeCounter, setSelectedNodes, markMapAsModified]
  )

  /**
   * Remove a node from the graph
   * @param {string} nodeId - ID of the node to remove
   */
  const removeNode = useCallback(
    (nodeId) => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeId))

      // Remove all edges connected to this node
      setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

      // Update selection state
      setSelectedNodes((prev) => prev.filter((id) => id !== nodeId))
      markMapAsModified()
    },
    [setNodes, setEdges, setSelectedNodes, markMapAsModified]
  )

  /**
   * Remove multiple nodes from the graph
   * @param {string[]} nodeIds - Array of node IDs to remove
   */
  const removeNodes = useCallback(
    (nodeIds) => {
      setNodes((currentNodes) => currentNodes.filter((node) => !nodeIds.includes(node.id)))

      // Remove all edges connected to these nodes
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target))
      )

      // Clear selection
      setSelectedNodes([])
      markMapAsModified()
    },
    [setNodes, setEdges, setSelectedNodes, markMapAsModified]
  )

  /**
   * Update a node's label
   * @param {string} nodeId - ID of the node to update
   * @param {string} newLabel - New label text
   */
  const updateNodeLabel = useCallback(
    (nodeId, newLabel) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node))
      )
      markMapAsModified()
    },
    [setNodes, markMapAsModified]
  )

  /**
   * Update a node's position
   * @param {string} nodeId - ID of the node to update
   * @param {Object} newPosition - New position {x, y}
   */
  const updateNodePosition = useCallback(
    (nodeId, newPosition) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => (node.id === nodeId ? { ...node, position: newPosition } : node))
      )
      markMapAsModified()
    },
    [setNodes, markMapAsModified]
  )

  /**
   * Get node by ID
   * @param {string} nodeId - Node ID to find
   * @returns {Object|null} - Node object or null if not found
   */
  const getNode = useCallback(
    (nodeId) => {
      return nodes.find((node) => node.id === nodeId) || null
    },
    [nodes]
  )

  /**
   * Delete selected nodes and their connected edges
   */
  const deleteSelectedNodes = useCallback(() => {
    console.log('🗑️ Deleting selected items:', { nodes: selectedNodes })

    // Find edges connected to the selected nodes
    const connectedEdges = edges.filter(
      (edge) => selectedNodes.includes(edge.source) || selectedNodes.includes(edge.target)
    )
    const connectedEdgeIds = connectedEdges.map((edge) => edge.id)

    // Remove connected edges
    setEdges((currentEdges) => currentEdges.filter((edge) => !connectedEdgeIds.includes(edge.id)))

    // Remove selected nodes
    setNodes((currentNodes) => currentNodes.filter((node) => !selectedNodes.includes(node.id)))
    setSelectedNodes([])
    markMapAsModified()
  }, [selectedNodes, edges, setEdges, setNodes, setSelectedNodes, markMapAsModified])

  return {
    // Node operations
    calculateNextNodeCounter,
    addNode,
    removeNode,
    removeNodes,
    updateNodeLabel,
    updateNodePosition,
    getNode,
    deleteSelectedNodes,
  }
}

export default useNodeOperations
