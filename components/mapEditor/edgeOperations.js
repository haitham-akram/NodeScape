import { useCallback } from 'react'

/**
 * Edge Operations
 * Provides functions for creating, updating and deleting edges
 */
const useEdgeOperations = (props) => {
  const {
    nodes,
    edges,
    setEdges,
    selectedEdges,
    setSelectedEdges,
    selectedEdgeType,
    markMapAsModified,
    autoConnectEnabled,
  } = props

  /**
   * Add a new edge between two nodes (prevents duplicates)
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @param {string} label - Optional edge label
   * @returns {string|null} - ID of the created edge or null if duplicate
   */
  const addEdgeCustom = useCallback(
    (sourceId, targetId, label = '') => {
      console.log('🔗 Adding edge:', { sourceId, targetId, label })

      // Check for duplicate connections
      const existingEdge = edges.find((edge) => edge.source === sourceId && edge.target === targetId)

      if (existingEdge) {
        console.warn('❌ Duplicate edge prevented:', { sourceId, targetId })
        return null
      }

      const edgeId = `edge-${sourceId}-${targetId}`
      const newEdge = {
        id: edgeId,
        source: sourceId,
        target: targetId,
        data: { label },
        type: selectedEdgeType,
        style: {
          stroke: '#000000',
          strokeWidth: 2,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#000000',
        },
        animated: false,
      }

      console.log('✅ Creating new edge:', newEdge)
      setEdges((currentEdges) => {
        const updatedEdges = [...currentEdges, newEdge]
        console.log('📊 Total edges after addition:', updatedEdges.length)
        return updatedEdges
      })

      markMapAsModified()
      return edgeId
    },
    [edges, setEdges, selectedEdgeType, markMapAsModified]
  )

  /**
   * Handle connecting nodes with edges (prevents duplicates)
   */
  const onConnect = useCallback(
    (params) => {
      addEdgeCustom(params.source, params.target)
    },
    [addEdgeCustom]
  )

  /**
   * Handle node add - automatically connect to the last node if autoConnect is enabled
   * @param {string} nodeId - ID of the newly added node
   */
  const handleNodeAdd = useCallback(
    (nodeId) => {
      if (!autoConnectEnabled || nodes.length < 2) {
        return
      }

      // Find the most recently added node that's not this one
      // Sort nodes by their IDs in descending order (highest number = most recent)
      const sortedNodes = [...nodes]
        .filter((node) => node.id !== nodeId) // Exclude the current node
        .sort((a, b) => {
          const aNum = parseInt(a.id.replace('node-', ''))
          const bNum = parseInt(b.id.replace('node-', ''))
          return bNum - aNum // Descending order
        })

      if (sortedNodes.length > 0) {
        // Connect from the previously added node to this new one
        const previousNodeId = sortedNodes[0].id
        const currentNodeId = nodeId

        console.log('🤖 Auto-connect enabled: Connecting', previousNodeId, 'to', currentNodeId)
        addEdgeCustom(previousNodeId, currentNodeId)
      }
    },
    [autoConnectEnabled, nodes, addEdgeCustom]
  )

  /**
   * Remove an edge from the graph
   * @param {string} edgeId - ID of the edge to remove
   */
  const removeEdge = useCallback(
    (edgeId) => {
      setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== edgeId))
      setSelectedEdges((prev) => prev.filter((id) => id !== edgeId))
      markMapAsModified()
    },
    [setEdges, setSelectedEdges, markMapAsModified]
  )

  /**
   * Remove multiple edges from the graph
   * @param {string[]} edgeIds - Array of edge IDs to remove
   */
  const removeEdges = useCallback(
    (edgeIds) => {
      setEdges((currentEdges) => currentEdges.filter((edge) => !edgeIds.includes(edge.id)))
      setSelectedEdges([])
      markMapAsModified()
    },
    [setEdges, setSelectedEdges, markMapAsModified]
  )

  /**
   * Update an edge's label
   * @param {string} edgeId - ID of the edge to update
   * @param {string} newLabel - New label text
   */
  const updateEdgeLabel = useCallback(
    (edgeId, newLabel) => {
      setEdges((currentEdges) =>
        currentEdges.map((edge) => (edge.id === edgeId ? { ...edge, data: { ...edge.data, label: newLabel } } : edge))
      )
      markMapAsModified()
    },
    [setEdges, markMapAsModified]
  )

  /**
   * Get edge by ID
   * @param {string} edgeId - Edge ID to find
   * @returns {Object|null} - Edge object or null if not found
   */
  const getEdge = useCallback(
    (edgeId) => {
      return edges.find((edge) => edge.id === edgeId) || null
    },
    [edges]
  )

  /**
   * Get all edges connected to a node
   * @param {string} nodeId - Node ID
   * @returns {Object[]} - Array of connected edges
   */
  const getConnectedEdges = useCallback(
    (nodeId) => {
      return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)
    },
    [edges]
  )

  /**
   * Delete selected edges
   */
  const deleteSelectedEdges = useCallback(() => {
    console.log('🗑️ Deleting selected edges:', { edges: selectedEdges })

    if (selectedEdges.length > 0) {
      removeEdges(selectedEdges)
      markMapAsModified()
    }
  }, [selectedEdges, removeEdges, markMapAsModified])

  /**
   * Link all selected nodes in a chain sequence
   * Creates edges from first to last selected node
   * @param {Array} nodesToLink - Array of node IDs to link
   */
  const linkSelectedNodes = useCallback(
    (nodesToLink) => {
      if (nodesToLink.length < 2) {
        alert('Please select at least 2 nodes to link')
        return
      }

      console.log('🔄 Linking selected nodes:', nodesToLink)

      // Create edges between consecutive nodes in selection
      for (let i = 0; i < nodesToLink.length - 1; i++) {
        addEdgeCustom(nodesToLink[i], nodesToLink[i + 1])
      }
    },
    [addEdgeCustom]
  )

  /**
   * Link all nodes in the current graph in their creation order
   */
  const linkAllNodes = useCallback(() => {
    if (nodes.length < 2) {
      alert('Need at least 2 nodes to link all')
      return
    }

    console.log('🔄 Linking all nodes in sequence')

    // Sort nodes by their IDs to ensure consistent linking order
    const sortedNodes = [...nodes].sort((a, b) => {
      // Extract numbers from node IDs for numerical sorting
      const aNum = parseInt(a.id.replace('node-', ''))
      const bNum = parseInt(b.id.replace('node-', ''))
      return aNum - bNum
    })

    // Create edges between all nodes in order
    let createdCount = 0
    for (let i = 0; i < sortedNodes.length - 1; i++) {
      const sourceId = sortedNodes[i].id
      const targetId = sortedNodes[i + 1].id

      // Use our existing addEdgeCustom function which handles duplicates
      const edgeId = addEdgeCustom(sourceId, targetId)
      if (edgeId) {
        createdCount++
      }
    }

    markMapAsModified(true)

    if (createdCount > 0) {
      alert(`Created ${createdCount} new connections between nodes`)
    } else {
      alert('No new connections created - all possible connections already exist')
    }
  }, [nodes, edges, addEdgeCustom, markMapAsModified])

  /**
   * Smart link nodes based on their types (Input → Default → Output)
   * Links nodes in logical flow by type category
   */
  const smartLinkNodes = useCallback(() => {
    if (nodes.length < 2) {
      alert('Need at least 2 nodes to create smart links')
      return
    }

    console.log('🧠 Creating smart links between nodes')

    // Group nodes by type
    const inputNodes = nodes.filter((node) => node.type === 'input')
    const defaultNodes = nodes.filter((node) => node.type === 'default' || !node.type)
    const outputNodes = nodes.filter((node) => node.type === 'output')

    let createdCount = 0

    // Link inputs to defaults
    if (inputNodes.length > 0 && defaultNodes.length > 0) {
      inputNodes.forEach((input) => {
        // Link each input to the first default node
        const edgeId = addEdgeCustom(input.id, defaultNodes[0].id)
        if (edgeId) createdCount++
      })
    }

    // Link defaults in sequence
    for (let i = 0; i < defaultNodes.length - 1; i++) {
      const edgeId = addEdgeCustom(defaultNodes[i].id, defaultNodes[i + 1].id)
      if (edgeId) createdCount++
    }

    // Link last default to all outputs
    if (defaultNodes.length > 0 && outputNodes.length > 0) {
      const lastDefaultNode = defaultNodes[defaultNodes.length - 1]
      outputNodes.forEach((output) => {
        const edgeId = addEdgeCustom(lastDefaultNode.id, output.id)
        if (edgeId) createdCount++
      })
    }
    // If no defaults, link inputs directly to outputs
    else if (defaultNodes.length === 0 && inputNodes.length > 0 && outputNodes.length > 0) {
      inputNodes.forEach((input) => {
        outputNodes.forEach((output) => {
          const edgeId = addEdgeCustom(input.id, output.id)
          if (edgeId) createdCount++
        })
      })
    }

    markMapAsModified(true)
    if (createdCount > 0) {
      alert(`Created ${createdCount} new smart connections between nodes`)
    } else {
      alert('No new connections created - all logical connections already exist')
    }
  }, [nodes, addEdgeCustom, markMapAsModified])

  return {
    // Edge operations
    addEdgeCustom,
    onConnect,
    removeEdge,
    removeEdges,
    updateEdgeLabel,
    getEdge,
    getConnectedEdges,
    deleteSelectedEdges,
    linkSelectedNodes,
    linkAllNodes,
    smartLinkNodes,
    handleNodeAdd, // Expose handleNodeAdd for node addition
  }
}

export default useEdgeOperations
