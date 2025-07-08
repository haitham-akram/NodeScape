import React, { useState, useCallback, useRef, useMemo } from 'react'
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  ReactFlowProvider,
  getRectOfNodes,
  getTransformForBounds,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { mapsApi } from '../lib/api'
import html2canvas from 'html2canvas'

// Custom node component for editable labels
const EditableNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      data.label = label
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data.label)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.label = label
  }

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: 'none !important',
        borderRadius: '16px',
        padding: '16px 20px',
        minWidth: '140px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 8px 25px rgba(25,118,210,0.4), 0 0 0 2px rgba(25,118,210,0.3)'
          : '0 4px 15px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: selected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        outline: 'none',
      }}
      className="react-flow__node-default"
      onDoubleClick={handleDoubleClick}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#000000',
          width: '10px',
          height: '10px',
          left: '-5px',
          border: '2px solid #ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#000000',
          width: '10px',
          height: '10px',
          right: '-5px',
          border: '2px solid #ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'center',
            width: '100%',
            fontSize: '14px',
          }}
        />
      ) : (
        <div style={{ fontSize: '14px', fontWeight: '500' }}>{label}</div>
      )}
    </div>
  )
}

// Input node component with distinct styling
const InputNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      data.label = label
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data.label)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.label = label
  }

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)'
          : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        border: 'none !important',
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px rgba(76,175,80,0.4), 0 0 0 2px rgba(76,175,80,0.3)'
          : '0 6px 20px rgba(76,175,80,0.15), 0 2px 10px rgba(76,175,80,0.1)',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: selected ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
        outline: 'none',
      }}
      className="react-flow__node-input"
      onDoubleClick={handleDoubleClick}
    >
      {/* Input icon */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '12px',
          color: '#4caf50',
          fontWeight: 'bold',
        }}
      >
        📥
      </div>

      {/* Connection handles - Input nodes only output data */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#000000',
          width: '10px',
          height: '10px',
          right: '-5px',
          border: '2px solid #ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'center',
            width: '100%',
            fontSize: '14px',
          }}
        />
      ) : (
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#2e7d32' }}>{label}</div>
      )}
    </div>
  )
}

// Output node component with distinct styling
const OutputNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      data.label = label
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data.label)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.label = label
  }

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)'
          : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
        border: 'none !important',
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px rgba(255,152,0,0.4), 0 0 0 2px rgba(255,152,0,0.3)'
          : '0 6px 20px rgba(255,152,0,0.15), 0 2px 10px rgba(255,152,0,0.1)',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: selected ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
        outline: 'none',
      }}
      className="react-flow__node-output"
      onDoubleClick={handleDoubleClick}
    >
      {/* Output icon */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '12px',
          color: '#ff9800',
          fontWeight: 'bold',
        }}
      >
        📤
      </div>

      {/* Connection handles - Output nodes only receive data */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#000000',
          width: '10px',
          height: '10px',
          left: '-5px',
          border: '2px solid #ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'center',
            width: '100%',
            fontSize: '14px',
          }}
        />
      ) : (
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#ef6c00' }}>{label}</div>
      )}
    </div>
  )
}

// Custom edge component for editable labels with different styles
const EditableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  type = 'default',
  markerEnd = 'url(#arrowhead)',
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data?.label || '')
  const inputRef = useRef(null)

  // Generate different edge paths based on type
  const getEdgePath = () => {
    switch (type) {
      case 'straight':
        return `M ${sourceX},${sourceY} L ${targetX},${targetY}`
      case 'step':
        const midX = (sourceX + targetX) / 2
        return `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`
      case 'smoothstep':
        const stepMidX = (sourceX + targetX) / 2
        return `M ${sourceX},${sourceY} C ${stepMidX},${sourceY} ${stepMidX},${targetY} ${targetX},${targetY}`
      case 'simplebezier':
        const controlOffsetX = Math.abs(targetX - sourceX) * 0.3
        return `M ${sourceX},${sourceY} C ${sourceX + controlOffsetX},${sourceY} ${
          targetX - controlOffsetX
        },${targetY} ${targetX},${targetY}`
      default:
        return `M ${sourceX},${sourceY} Q ${(sourceX + targetX) / 2},${sourceY - 50} ${targetX},${targetY}`
    }
  }

  const edgePath = getEdgePath()
  const labelX = (sourceX + targetX) / 2
  const labelY = (sourceY + targetY) / 2 - 25

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      if (data) data.label = label
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data?.label || '')
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (data) data.label = label
  }

  return (
    <g>
      <path
        d={edgePath}
        stroke={selected ? '#333333' : '#000000'}
        strokeWidth={selected ? 3 : 2}
        fill="none"
        markerEnd={markerEnd}
        style={{
          transition: 'all 0.2s ease',
        }}
      />
      {(label || isEditing) && (
        <foreignObject x={labelX - 40} y={labelY - 10} width="80" height="20" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleBlur}
              style={{
                border: '1px solid #000',
                borderRadius: '4px',
                padding: '2px 4px',
                fontSize: '12px',
                width: '100%',
                textAlign: 'center',
                background: 'white',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '12px',
                background: 'rgba(255,255,255,0.9)',
                padding: '2px 4px',
                borderRadius: '4px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #ddd',
              }}
            >
              {label}
            </div>
          )}
        </foreignObject>
      )}
    </g>
  )
}

const MapEditor = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Primary state: nodes and edges arrays (React Flow format)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Custom handlers to track modifications
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes)
      // Mark as modified if there are actual changes (not just selection)
      if (changes.some((change) => change.type !== 'select')) {
        setMapModifiedAfterLoad(true)
      }
    },
    [onNodesChange]
  )

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes)
      // Mark as modified if there are actual changes (not just selection)
      if (changes.some((change) => change.type !== 'select')) {
        setMapModifiedAfterLoad(true)
      }
    },
    [onEdgesChange]
  )

  // Selection state for UI interactions
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])

  // Counter for unique node IDs
  const [nodeCounter, setNodeCounter] = useState(1)

  // Map persistence state
  const [currentMapId, setCurrentMapId] = useState(null)
  const [currentMapName, setCurrentMapName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadMapId, setLoadMapId] = useState('')
  const [availableMaps, setAvailableMaps] = useState([])
  const [autoConnectEnabled, setAutoConnectEnabled] = useState(false)
  const [selectedEdgeType, setSelectedEdgeType] = useState('default')
  const [mapModifiedAfterLoad, setMapModifiedAfterLoad] = useState(false)

  const { fitView, getViewport } = useReactFlow()

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

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

  // ========================================
  // NODE CRUD OPERATIONS
  // ========================================

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
      setMapModifiedAfterLoad(true) // Mark as modified when adding nodes

      return nodeId
    },
    [nodeCounter, setNodes, getViewport]
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
    },
    [setNodes, setEdges]
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
    },
    [setNodes, setEdges]
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
    },
    [setNodes]
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
    },
    [setNodes]
  )

  // ========================================
  // EDGE CRUD OPERATIONS
  // ========================================

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
      return edgeId
    },
    [edges, setEdges]
  )

  /**
   * Remove an edge from the graph
   * @param {string} edgeId - ID of the edge to remove
   */
  const removeEdge = useCallback(
    (edgeId) => {
      setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== edgeId))
      setSelectedEdges((prev) => prev.filter((id) => id !== edgeId))
    },
    [setEdges]
  )

  /**
   * Remove multiple edges from the graph
   * @param {string[]} edgeIds - Array of edge IDs to remove
   */
  const removeEdges = useCallback(
    (edgeIds) => {
      setEdges((currentEdges) => currentEdges.filter((edge) => !edgeIds.includes(edge.id)))
      setSelectedEdges([])
    },
    [setEdges]
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
    },
    [setEdges]
  )

  // ========================================
  // UTILITY OPERATIONS
  // ========================================

  /**
   * Clear all nodes and edges from the graph
   */
  const clearGraph = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNodes([])
    setSelectedEdges([])
    setNodeCounter(1)
  }, [setNodes, setEdges])

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

  // ========================================
  // CUSTOM NODE AND EDGE TYPES
  // ========================================

  // Custom node types with distinct visual styling
  const nodeTypes = useMemo(
    () => ({
      default: EditableNode,
      input: InputNode,
      output: OutputNode,
    }),
    []
  )

  // Use React Flow's built-in edge types for better connection handling
  const edgeTypes = useMemo(
    () => ({}), // Use default edge types
    []
  )

  // Event Handlers

  // Handle connecting nodes with edges (prevents duplicates)
  const onConnect = useCallback(
    (params) => {
      addEdgeCustom(params.source, params.target)
      setMapModifiedAfterLoad(true) // Mark as modified when adding edges
    },
    [addEdgeCustom]
  )

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      setSelectedNodes((prev) => (prev.includes(node.id) ? prev.filter((id) => id !== node.id) : [...prev, node.id]))
    } else {
      // Single select
      setSelectedNodes([node.id])
    }
    setSelectedEdges([])
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      setSelectedEdges((prev) => (prev.includes(edge.id) ? prev.filter((id) => id !== edge.id) : [...prev, edge.id]))
    } else {
      // Single select
      setSelectedEdges([edge.id])
    }
    setSelectedNodes([])
  }, [])

  // Handle background click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodes([])
    setSelectedEdges([])
  }, [])

  // ========================================
  // DERIVED EVENT HANDLERS
  // ========================================

  /**
   * Delete selected nodes and edges
   * Also deletes any connected edges to selected nodes
   */
  const deleteSelectedNodes = useCallback(() => {
    console.log('🗑️ Deleting selected items:', { nodes: selectedNodes, edges: selectedEdges })

    // Remove selected edges
    if (selectedEdges.length > 0) {
      removeEdges(selectedEdges)
    }

    // Remove selected nodes and their connected edges
    if (selectedNodes.length > 0) {
      // Find edges connected to the selected nodes
      const connectedEdges = edges.filter(
        (edge) => selectedNodes.includes(edge.source) || selectedNodes.includes(edge.target)
      )
      const connectedEdgeIds = connectedEdges.map((edge) => edge.id)

      // Remove connected edges
      removeEdges(connectedEdgeIds)

      // Remove selected nodes
      setNodes((currentNodes) => currentNodes.filter((node) => !selectedNodes.includes(node.id)))
      setSelectedNodes([])
    }
  }, [selectedNodes, selectedEdges, edges, removeEdges, setNodes])

  /**
   * Link all selected nodes in a chain sequence
   * Creates edges from first to last selected node
   */
  const linkSelectedNodes = useCallback(() => {
    if (selectedNodes.length < 2) {
      alert('Please select at least 2 nodes to link')
      return
    }

    console.log('🔄 Linking selected nodes:', selectedNodes)

    // Create edges between consecutive nodes in selection
    for (let i = 0; i < selectedNodes.length - 1; i++) {
      addEdgeCustom(selectedNodes[i], selectedNodes[i + 1])
    }

    // Clear selection after linking
    setSelectedNodes([])
  }, [selectedNodes, addEdgeCustom])

  /**
   * Link all nodes in the current graph in their creation order
   */
  const linkAllNodes = useCallback(() => {
    if (nodes.length < 2) {
      alert('Need at least 2 nodes to link all')
      return
    }

    console.log('🔄 Linking all nodes in sequence')

    // Create edges between all nodes in order
    for (let i = 0; i < nodes.length - 1; i++) {
      addEdgeCustom(nodes[i].id, nodes[i + 1].id)
    }
  }, [nodes, addEdgeCustom])

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
    const defaultNodes = nodes.filter((node) => node.type === 'default')
    const outputNodes = nodes.filter((node) => node.type === 'output')

    // Link inputs to defaults
    inputNodes.forEach((input) => {
      defaultNodes.forEach((def, index) => {
        // Link each input to the first default node
        if (index === 0) {
          addEdgeCustom(input.id, def.id)
        }
      })
    })

    // Link defaults in sequence
    for (let i = 0; i < defaultNodes.length - 1; i++) {
      addEdgeCustom(defaultNodes[i].id, defaultNodes[i + 1].id)
    }

    // Link last default to all outputs
    if (defaultNodes.length > 0 && outputNodes.length > 0) {
      outputNodes.forEach((output) => {
        addEdgeCustom(defaultNodes[defaultNodes.length - 1].id, output.id)
      })
    }
    // If no defaults, link inputs directly to outputs
    else if (defaultNodes.length === 0 && inputNodes.length > 0 && outputNodes.length > 0) {
      inputNodes.forEach((input) => {
        outputNodes.forEach((output) => {
          addEdgeCustom(input.id, output.id)
        })
      })
    }

    alert('Smart links created successfully!')
  }, [nodes, addEdgeCustom])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedNodes()
      }
      if (event.key === 'Escape') {
        setSelectedNodes([])
        setSelectedEdges([])
      }
    },
    [deleteSelectedNodes]
  )

  // Attach keyboard event listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ========================================
  // API INTEGRATION FUNCTIONS
  // ========================================

  /**
   * Save current map to server
   * Creates a new map or updates existing one based on currentMapId
   */
  const saveMap = useCallback(async () => {
    console.log('🔄 Starting save process...')

    if (!currentMapName.trim()) {
      alert('Please enter a map name before saving')
      return
    }

    console.log('📋 Current state:', {
      mapName: currentMapName,
      mapId: currentMapId,
      nodesCount: nodes.length,
      edgesCount: edges.length,
    })

    setIsLoading(true)
    try {
      const mapData = {
        name: currentMapName,
        description: `Map with ${nodes.length} nodes and ${edges.length} edges`,
        nodes: nodes,
        edges: edges,
      }

      console.log('📦 Map data prepared:', mapData)

      let response
      if (currentMapId && mapModifiedAfterLoad) {
        // Ask user what they want to do with the modified loaded map
        const userChoice = confirm(
          `You've loaded and modified an existing map "${currentMapName}".\n\n` +
            `Click OK to UPDATE the original map.\n` +
            `Click Cancel to SAVE AS A NEW map.`
        )

        if (userChoice) {
          // Update existing map
          console.log('🔄 Updating existing map with ID:', currentMapId)
          response = await mapsApi.updateMap(currentMapId, mapData)
          console.log('✅ Map updated successfully:', response)
        } else {
          // Save as new map
          console.log('➕ Creating new map from modified existing map...')
          response = await mapsApi.createMap(mapData)
          console.log('✅ New map created successfully:', response)
          setCurrentMapId(response.data.id)
        }
        setMapModifiedAfterLoad(false) // Reset modification flag
      } else if (currentMapId) {
        // Update existing map (no modifications detected)
        console.log('🔄 Updating existing map with ID:', currentMapId)
        response = await mapsApi.updateMap(currentMapId, mapData)
        console.log('✅ Map updated successfully:', response)
      } else {
        // Create new map
        console.log('➕ Creating new map...')
        response = await mapsApi.createMap(mapData)
        console.log('✅ Map created successfully:', response)
        setCurrentMapId(response.data.id)
      }

      alert(`Map "${currentMapName}" saved successfully!`)

      // Refresh the available maps list
      fetchAvailableMaps()
    } catch (error) {
      console.error('❌ Error saving map:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      alert('Failed to save map. Please check the console for details.')
    } finally {
      setIsLoading(false)
      console.log('🏁 Save process completed')
    }
  }, [currentMapName, currentMapId, nodes, edges, mapModifiedAfterLoad])

  /**
   * Load a map from server by ID
   * Replaces current nodes and edges with loaded data
   */
  const loadMap = useCallback(async () => {
    if (!loadMapId.trim()) {
      alert('Please enter a map ID to load')
      return
    }

    setIsLoading(true)
    try {
      const response = await mapsApi.getMap(loadMapId)
      const mapData = response.data

      // Replace current graph with loaded data
      setNodes(mapData.nodes || [])
      setEdges(mapData.edges || [])
      setCurrentMapId(mapData.id)
      setCurrentMapName(mapData.name)
      setMapModifiedAfterLoad(false) // Reset modification flag

      // Update node counter to prevent ID conflicts
      const nextCounter = calculateNextNodeCounter(mapData.nodes || [])
      setNodeCounter(nextCounter)

      // Clear selection
      setSelectedNodes([])
      setSelectedEdges([])

      // Fit view to show all loaded content
      setTimeout(() => fitView(), 100)

      alert(`Map "${mapData.name}" loaded successfully!`)
    } catch (error) {
      console.error('Error loading map:', error)
      alert('Failed to load map. Please check the ID and try again.')
    } finally {
      setIsLoading(false)
    }
  }, [loadMapId, setNodes, setEdges, fitView, calculateNextNodeCounter])

  /**
   * Fetch all available maps from server
   * Updates availableMaps state with list of saved maps
   */
  const fetchAvailableMaps = useCallback(async () => {
    try {
      console.log('📋 Fetching available maps...')
      const response = await mapsApi.getAllMaps()
      const maps = response.data || []
      setAvailableMaps(maps)
      console.log('✅ Available maps loaded:', maps.length)
    } catch (error) {
      console.error('❌ Error fetching maps:', error)
      setAvailableMaps([])
    }
  }, [])

  // Fetch available maps on component mount
  React.useEffect(() => {
    fetchAvailableMaps()
  }, [fetchAvailableMaps])

  /**
   * Load a map by ID (enhanced version)
   * @param {string} mapId - ID of the map to load
   */
  const loadMapById = useCallback(
    async (mapId) => {
      if (!mapId) {
        alert('Please select a map to load')
        return
      }

      setIsLoading(true)
      try {
        console.log('🔄 Loading map with ID:', mapId)
        const response = await mapsApi.getMap(mapId)
        const mapData = response.data

        // Replace current graph with loaded data
        setNodes(mapData.nodes || [])
        setEdges(mapData.edges || [])
        setCurrentMapId(mapData.id)
        setCurrentMapName(mapData.name)
        setMapModifiedAfterLoad(false) // Reset modification flag

        // Update node counter to prevent ID conflicts
        const nextCounter = calculateNextNodeCounter(mapData.nodes || [])
        setNodeCounter(nextCounter)

        // Clear selection
        setSelectedNodes([])
        setSelectedEdges([])

        // Fit view to show all loaded content
        setTimeout(() => fitView(), 100)

        alert(`Map "${mapData.name}" loaded successfully!`)
        console.log('✅ Map loaded successfully:', mapData.name)
      } catch (error) {
        console.error('❌ Error loading map:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          mapId: mapId,
        })
        alert(`Failed to load map with ID "${mapId}". Error: ${error.message}. Check console for details.`)
      } finally {
        setIsLoading(false)
      }
    },
    [setNodes, setEdges, fitView, calculateNextNodeCounter]
  )

  /**
   * Delete current map from server
   * Clears the graph after successful deletion
   */
  const deleteMap = useCallback(async () => {
    if (!currentMapId) {
      alert('No map is currently loaded to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete the map "${currentMapName}"? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      await mapsApi.deleteMap(currentMapId)

      // Clear current map state
      setNodes([])
      setEdges([])
      setCurrentMapId(null)
      setCurrentMapName('')
      setSelectedNodes([])
      setSelectedEdges([])
      setMapModifiedAfterLoad(false) // Reset modification flag

      alert(`Map "${currentMapName}" deleted successfully!`)
    } catch (error) {
      console.error('Error deleting map:', error)
      alert('Failed to delete map. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [currentMapId, currentMapName, setNodes, setEdges])

  // ========================================
  // EXPORT / IMPORT FUNCTIONS
  // ========================================

  /**
   * Export the current graph as a PNG image
   * Uses html2canvas to create a screenshot of the graph
   */
  const exportToPNG = useCallback(() => {
    console.log('📸 Exporting graph as PNG')
    const reactFlowNode = document.querySelector('.react-flow')

    if (!reactFlowNode) {
      console.error('❌ Cannot find React Flow element')
      alert('Export failed. Please try again.')
      return
    }

    const nodesBounds = getRectOfNodes(nodes)
    const transform = getTransformForBounds(
      nodesBounds,
      {
        width: 1200,
        height: 800,
      },
      0.5
    )

    try {
      // Create a temporary wrapper element for proper image capture
      const tempWrapper = document.createElement('div')
      tempWrapper.style.width = '1200px'
      tempWrapper.style.height = '800px'
      tempWrapper.style.position = 'absolute'
      tempWrapper.style.top = '-9999px'
      tempWrapper.style.left = '-9999px'
      tempWrapper.style.transform = `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`

      document.body.appendChild(tempWrapper)
      const reactFlowClone = reactFlowNode.cloneNode(true)
      tempWrapper.appendChild(reactFlowClone)

      html2canvas(tempWrapper, {
        backgroundColor: '#f8f8f8',
        useCORS: true,
        allowTaint: true,
        scale: 2,
      }).then((canvas) => {
        const image = canvas.toDataURL('image/png', 1.0)

        // Create download link
        const downloadLink = document.createElement('a')
        downloadLink.href = image
        downloadLink.download = `${currentMapName || 'nodescape'}_${new Date().toISOString().slice(0, 10)}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

        // Clean up
        document.body.removeChild(tempWrapper)
        alert('PNG exported successfully!')
      })
    } catch (error) {
      console.error('❌ Error exporting PNG:', error)
      alert('Export failed. Please check console for details.')
    }
  }, [nodes, currentMapName])

  /**
   * Export the current graph as JSON data
   * Creates a downloadable JSON file with nodes and edges
   */
  const exportToJSON = useCallback(() => {
    try {
      console.log('📄 Exporting graph as JSON')

      // Create the export data structure
      const exportData = {
        metadata: {
          name: currentMapName || 'Exported Map',
          exportDate: new Date().toISOString(),
          version: '1.0',
        },
        graph: {
          nodes: nodes,
          edges: edges,
        },
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const dataUrl = URL.createObjectURL(blob)

      // Create download link
      const downloadLink = document.createElement('a')
      downloadLink.href = dataUrl
      downloadLink.download = `${currentMapName || 'nodescape'}_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      console.log('✅ JSON exported successfully')
      alert('JSON exported successfully!')
    } catch (error) {
      console.error('❌ Error exporting JSON:', error)
      alert('Export failed. Please check console for details.')
    }
  }, [nodes, edges, currentMapName])

  /**
   * Import a map from a JSON file
   * Allows users to upload and load a previously exported JSON file
   * Process: File picker → Read file → Parse JSON → Validate → Load data
   */
  const importFromJSON = useCallback(() => {
    try {
      // Create file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.json'
      fileInput.style.display = 'none'

      fileInput.onchange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        try {
          setIsLoading(true)

          // Read file content
          const text = await file.text()
          const importData = JSON.parse(text)

          // Validate the imported data structure
          if (!importData.graph || !importData.graph.nodes || !importData.graph.edges) {
            throw new Error('Invalid JSON structure. Missing graph data.')
          }

          // Load the data into the editor
          setNodes(importData.graph.nodes || [])
          setEdges(importData.graph.edges || [])

          // Update current map info
          setCurrentMapName(importData.metadata?.name || 'Imported Map')
          setCurrentMapId(null) // Clear current map ID since this is imported
          setMapModifiedAfterLoad(false) // Reset modification flag

          // Update node counter to prevent ID conflicts
          const nextCounter = calculateNextNodeCounter(importData.graph.nodes || [])
          setNodeCounter(nextCounter)

          // Clear selection
          setSelectedNodes([])
          setSelectedEdges([])

          // Fit view to show imported content
          setTimeout(() => fitView(), 100)

          alert(`Map "${importData.metadata?.name || 'Imported Map'}" imported successfully!`)
          console.log('Map imported successfully:', importData)
        } catch (error) {
          console.error('Error importing JSON:', error)
          alert('Failed to import JSON file. Please check the file format.')
        } finally {
          setIsLoading(false)
        }
      }

      // Trigger file selection
      document.body.appendChild(fileInput)
      fileInput.click()
      document.body.removeChild(fileInput)
    } catch (error) {
      console.error('Error setting up import:', error)
      alert('Failed to set up import. Please try again.')
    }
  }, [setNodes, setEdges, fitView, calculateNextNodeCounter])

  /**
   * Create a sample map for testing
   */
  const createSampleMap = useCallback(() => {
    const sampleNodes = [
      {
        id: 'sample-input',
        type: 'input',
        position: { x: 100, y: 100 },
        data: { label: 'Sample Input' },
      },
      {
        id: 'sample-process',
        type: 'default',
        position: { x: 300, y: 100 },
        data: { label: 'Process Data' },
      },
      {
        id: 'sample-output',
        type: 'output',
        position: { x: 500, y: 100 },
        data: { label: 'Sample Output' },
      },
    ]

    const sampleEdges = [
      {
        id: 'sample-edge-1',
        source: 'sample-input',
        target: 'sample-process',
        type: 'default',
        style: { stroke: '#000000', strokeWidth: 2 },
        markerEnd: { type: 'arrowclosed', color: '#000000' },
      },
      {
        id: 'sample-edge-2',
        source: 'sample-process',
        target: 'sample-output',
        type: 'default',
        style: { stroke: '#000000', strokeWidth: 2 },
        markerEnd: { type: 'arrowclosed', color: '#000000' },
      },
    ]

    setNodes(sampleNodes)
    setEdges(sampleEdges)
    setCurrentMapName('Sample Workflow')
    setCurrentMapId(null) // Reset to create new map
    setMapModifiedAfterLoad(false) // Reset modification flag

    // Clear selections
    setSelectedNodes([])
    setSelectedEdges([])

    setTimeout(() => fitView(), 100)
  }, [setNodes, setEdges, fitView])

  // ========================================
  // SMART CONNECTION FUNCTIONS
  // ========================================

  /**
   * Auto-connect new node to the most recently created node
   * This makes building linear workflows much easier
   */
  const autoConnectNewNode = useCallback(
    (newNodeId) => {
      if (!autoConnectEnabled || nodes.length === 0) {
        return
      }

      // Auto-connect logic based on node types
      const newNode = nodes.find((n) => n.id === newNodeId)
      if (!newNode) return

      // Find the most recent node to connect to
      const lastNode = nodes[nodes.length - 2] // -2 because new node is already added
      if (lastNode && lastNode.id !== newNodeId) {
        addEdgeCustom(lastNode.id, newNodeId)
      }
    },
    [autoConnectEnabled, nodes, addEdgeCustom]
  )

  /**
   * Add a node and auto-connect it if enabled
   * Wrapper for addNode that also handles auto connections
   * @param {string} type - Type of node to create (default, input, output)
   * @param {object} position - Optional position, otherwise centered in viewport
   * @param {string} label - Optional label, otherwise auto-generated
   */
  const addNodeWithAutoConnect = useCallback(
    (type = 'default', position = null, label = null) => {
      // Add the node first
      const newNodeId = addNode(type, position, label)

      // Then auto-connect if enabled
      if (autoConnectEnabled) {
        autoConnectNewNode(newNodeId)
      }

      return newNodeId
    },
    [addNode, autoConnectEnabled, autoConnectNewNode]
  )

  // ========================================
  // RENDER
  // ========================================

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* React Flow Component */}
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          selected: selectedNodes.includes(node.id),
        }))}
        edges={edges.map((edge) => ({
          ...edge,
          selected: selectedEdges.includes(edge.id),
        }))}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f0f0f0" gap={20} />
        <Controls />
        <MiniMap
          style={{
            height: 120,
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ddd',
          }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return '#4caf50'
              case 'output':
                return '#f44336'
              default:
                return '#2196f3'
            }
          }}
        />

        {/* Single Unified Navigation Bar */}
        <Panel
          position="top"
          style={{
            background: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            width: '100%',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top section - Logo & Status */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 15px',
              borderBottom: '1px solid #eee',
            }}
          >
            {/* Left side - Logo & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2196f3' }}>NodeScape</div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  flexWrap: 'wrap',
                }}
              >
                <span>Nodes: {nodes.length}</span>
                <span>|</span>
                <span>Edges: {edges.length}</span>
                <span>|</span>
                <span>Selected: {selectedNodes.length + selectedEdges.length}</span>
                {currentMapId && (
                  <span style={{ marginLeft: '5px', color: '#4caf50', display: 'flex', alignItems: 'center' }}>
                    | Map: {currentMapName}
                    {mapModifiedAfterLoad && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#ffeb3b',
                          borderRadius: '50%',
                          marginLeft: '5px',
                          title: 'Map has been modified',
                        }}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Help Button & Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="navbar-help" style={{ position: 'relative', fontSize: '12px' }}>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    alert(
                      'Quick Help:\n• Double-click nodes to edit labels\n• Drag to connect nodes\n• Click to select, Shift+click for multi-select\n• Del key to delete selected items\n• Auto-connect: new nodes link to recent ones'
                    )
                  }
                >
                  ❓ Help
                </button>
              </div>
            </div>
          </div>

          {/* Bottom section - Controls */}
          <div
            style={{
              padding: '15px',
              background: '#f9f9f9',
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Node Controls */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '200px',
                  flex: '1 1 200px', // Flexible width with minimum
                  maxWidth: '100%', // Prevent overflow on small screens
                  marginBottom: '10px', // Add space when controls stack
                }}
              >
                <h3
                  style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '5px',
                  }}
                >
                  Node Controls
                </h3>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => addNodeWithAutoConnect('default')}
                    style={{
                      padding: '6px 10px',
                      background: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Add Node
                  </button>

                  <button
                    onClick={() => addNodeWithAutoConnect('input')}
                    style={{
                      padding: '6px 10px',
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Add Input
                  </button>

                  <button
                    onClick={() => addNodeWithAutoConnect('output')}
                    style={{
                      padding: '6px 10px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Add Output
                  </button>
                </div>
              </div>

              {/* Edge Controls */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '280px',
                  flex: '1 1 280px', // Flexible width with minimum
                  maxWidth: '100%', // Prevent overflow on small screens
                  marginBottom: '10px', // Add space when controls stack
                }}
              >
                <h3
                  style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '5px',
                  }}
                >
                  Edge Controls
                </h3>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <button
                    onClick={deleteSelectedNodes}
                    style={{
                      padding: '6px 10px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Delete Selected
                  </button>

                  <button
                    onClick={linkSelectedNodes}
                    style={{
                      padding: '6px 10px',
                      background: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Link Selected
                  </button>

                  <button
                    onClick={linkAllNodes}
                    style={{
                      padding: '6px 8px',
                      background: '#9c27b0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Link All
                  </button>

                  <button
                    onClick={smartLinkNodes}
                    style={{
                      padding: '6px 8px',
                      background: '#607d8b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Smart Link
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '12px', color: '#666', flex: '1 1 120px' }}>
                    <input
                      type="checkbox"
                      checked={autoConnectEnabled}
                      onChange={(e) => setAutoConnectEnabled(e.target.checked)}
                      style={{ marginRight: '4px' }}
                    />
                    Auto-connect new nodes
                  </label>
                  <select
                    value={selectedEdgeType}
                    onChange={(e) => setSelectedEdgeType(e.target.value)}
                    style={{
                      padding: '4px 6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      flex: '1 1 120px',
                    }}
                  >
                    <option value="default">Default Edge</option>
                    <option value="straight">Straight Edge</option>
                    <option value="step">Step Edge</option>
                    <option value="smoothstep">Smooth Step Edge</option>
                  </select>
                </div>
              </div>

              {/* Map Controls */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '240px',
                  flex: '1 1 240px', // Flexible width with minimum
                  maxWidth: '100%', // Prevent overflow on small screens
                  marginBottom: '10px', // Add space when controls stack
                }}
              >
                <h3
                  style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '5px',
                  }}
                >
                  Map Controls
                </h3>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={currentMapName}
                    onChange={(e) => setCurrentMapName(e.target.value)}
                    placeholder="Enter map name"
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      flex: '2 1 120px',
                    }}
                  />
                  <button
                    onClick={saveMap}
                    disabled={isLoading}
                    style={{
                      padding: '6px 10px',
                      background: isLoading ? '#ccc' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto',
                    }}
                  >
                    {isLoading ? 'Saving...' : 'Save Map'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={loadMapId}
                    onChange={(e) => setLoadMapId(e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      flex: '2 1 120px',
                    }}
                  >
                    <option value="">Select a map to load</option>
                    {availableMaps.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={fetchAvailableMaps}
                    style={{
                      padding: '6px 8px',
                      background: '#607d8b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ↻
                  </button>
                  <button
                    onClick={() => loadMapById(loadMapId)}
                    disabled={isLoading || !loadMapId}
                    style={{
                      padding: '6px 10px',
                      background: isLoading || !loadMapId ? '#ccc' : '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isLoading || !loadMapId ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto',
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Load'}
                  </button>
                </div>
              </div>

              {/* Export/Import Controls */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '200px',
                  flex: '1 1 200px', // Flexible width with minimum
                  maxWidth: '100%', // Prevent overflow on small screens
                  marginBottom: '10px', // Add space when controls stack
                }}
              >
                <h3
                  style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '5px',
                  }}
                >
                  Export/Import
                </h3>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <button
                    onClick={exportToPNG}
                    style={{
                      padding: '6px 8px',
                      background: '#9c27b0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Export PNG
                  </button>

                  <button
                    onClick={exportToJSON}
                    style={{
                      padding: '6px 8px',
                      background: '#607d8b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Export JSON
                  </button>

                  <button
                    onClick={importFromJSON}
                    style={{
                      padding: '6px 8px',
                      background: '#795548',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Import JSON
                  </button>
                  <button
                    onClick={createSampleMap}
                    style={{
                      padding: '6px 8px',
                      background: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      flex: '1 1 auto', // More flexible sizing
                    }}
                  >
                    Sample
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// Wrap the component with ReactFlowProvider
const MapEditorWithProvider = () => {
  return (
    <ReactFlowProvider>
      <MapEditor />
    </ReactFlowProvider>
  )
}

export default MapEditorWithProvider
