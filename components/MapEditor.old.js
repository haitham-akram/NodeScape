import React, { useState, useCallback } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Import extracted components
import { nodeTypes } from './nodes'
import { edgeTypes } from './edges'
import MapControls from './mapEditor/MapControls'
import MapHeader from './mapEditor/MapHeader'
import ThemeControls from './mapEditor/ThemeControls'
import NodeLibrary from './mapEditor/NodeLibrary'
import MapTemplates from './mapEditor/MapTemplates'

// Import operation hooks
import useNodeOperations from './mapEditor/nodeOperations'
import useEdgeOperations from './mapEditor/edgeOperations'
import useMapOperations from './mapEditor/mapOperations'
import useGraphUtils from './mapEditor/graphUtils'
import useHistory from './mapEditor/useHistory'

// Import execution context and manager
import { ExecutionProvider } from '../contexts/ExecutionContext'
import { useExecutionManager } from './mapEditor/useExecutionManager'

/**
 * Main MapEditor component
 * Central component that coordinates all graph editing functionality
 */
const MapEditor = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Primary state: nodes and edges arrays (React Flow format)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Selection state for UI interactions
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])

  // Counter for unique node IDs
  const [nodeCounter, setNodeCounter] = useState(1)

  // Editor options
  const [autoConnectEnabled, setAutoConnectEnabled] = useState(false)
  const [selectedEdgeType, setSelectedEdgeType] = useState('default')
  const [darkMode, setDarkMode] = useState(false)

  // Panel visibility states
  const [nodeLibraryVisible, setNodeLibraryVisible] = useState(false)
  const [templatesVisible, setTemplatesVisible] = useState(false)

  // Access React Flow instance
  const { fitView, getViewport } = useReactFlow()

  // History management
  const history = useHistory(nodes, edges)

  // ========================================
  // CUSTOM HOOKS FOR OPERATIONS
  // ========================================

  // Node operations
  const nodeOperations = useNodeOperations({
    nodes,
    setNodes,
    edges,
    setEdges,
    nodeCounter,
    setNodeCounter,
    selectedNodes,
    setSelectedNodes,
    getViewport,
    markMapAsModified: (value) => setMapModifiedAfterLoad(value),
  })

  // Extract the calculateNextNodeCounter function for mapOperations hook
  const { calculateNextNodeCounter, addNode: addNodeOriginal, deleteSelectedNodes, updateNodeLabel } = nodeOperations

  // Map operations (save, load, export, import)
  const mapOperations = useMapOperations({
    nodes,
    edges,
    setNodes,
    setEdges,
    fitView,
    calculateNextNodeCounter,
    setNodeCounter,
    setSelectedNodes,
    setSelectedEdges,
  })

  // Extract map operations
  const {
    currentMapId,
    setCurrentMapId,
    currentMapName,
    setCurrentMapName,
    mapModifiedAfterLoad,
    setMapModifiedAfterLoad,
    isLoading,
    loadMapId,
    setLoadMapId,
    availableMaps,
    fetchAvailableMaps,
    saveMap,
    loadMapById,
    exportAsPng,
    exportAsJson,
    importFromJson,
    createNewMap,
  } = mapOperations

  // Edge operations
  const edgeOperations = useEdgeOperations({
    nodes,
    edges,
    setEdges,
    selectedEdges,
    setSelectedEdges,
    selectedEdgeType,
    markMapAsModified: (value) => setMapModifiedAfterLoad(value),
    autoConnectEnabled,
  })

  // Extract edge operations
  const { addEdge, onConnect, deleteSelectedEdges, linkSelectedNodes, linkAllNodes, smartLinkNodes, handleNodeAdd } =
    edgeOperations

  // Create a wrapped version of addNode that also handles auto-connection
  const addNode = useCallback(
    (type = 'default', position = null, label = null) => {
      const nodeId = addNodeOriginal(type, position, label)

      // When autoConnect is enabled, connect the new node to the previous node
      if (nodeId) {
        handleNodeAdd(nodeId)
      }

      return nodeId
    },
    [addNodeOriginal, handleNodeAdd]
  )

  // Graph utilities
  const graphUtils = useGraphUtils({
    nodes,
    setNodes,
    setEdges,
    setNodeCounter,
    setSelectedNodes,
    setSelectedEdges,
    markMapAsModified: (value) => setMapModifiedAfterLoad(value),
  })

  // Extract graph utilities
  const { alignNodes, distributeNodes, autoLayout } = graphUtils

  // ========================================
  // EXECUTION ENGINE FUNCTIONS
  // ========================================

  // Setup execution engine listeners
  React.useEffect(() => {
    const handleNodeExecuted = (event) => {
      setExecutingNodes((prev) => {
        const next = new Set(prev)
        next.add(event.nodeId)
        return next
      })
      setExecutionResults((prev) => {
        const next = new Map(prev)
        next.set(event.nodeId, event.data)
        return next
      })
    }

    const handleExecutionComplete = (event) => {
      setIsExecuting(false)
      setExecutingNodes(new Set())
      console.log('Execution completed:', event)
    }

    const handleExecutionError = (event) => {
      setIsExecuting(false)
      setExecutingNodes(new Set())
      console.error('Execution error:', event.error)
    }

    executionEngine.addListener('nodeExecuted', handleNodeExecuted)
    executionEngine.addListener('executionComplete', handleExecutionComplete)
    executionEngine.addListener('executionError', handleExecutionError)

    return () => {
      executionEngine.removeListener('nodeExecuted', handleNodeExecuted)
      executionEngine.removeListener('executionComplete', handleExecutionComplete)
      executionEngine.removeListener('executionError', handleExecutionError)
    }
  }, [executionEngine])

  // Execute workflow
  const executeWorkflow = useCallback(async () => {
    if (isExecuting) return

    setIsExecuting(true)
    setExecutionResults(new Map())
    setExecutingNodes(new Set())

    // Set execution speed
    executionEngine.executionSpeed = executionSpeed

    try {
      // Get input data from input nodes
      const inputData = {}
      nodes.forEach((node) => {
        if (node.type === 'input' && node.data?.value !== undefined) {
          inputData[node.id] = node.data.value
        }
      })

      await executionEngine.executeWorkflow(nodes, edges, inputData)
    } catch (error) {
      console.error('Execution failed:', error)
      setIsExecuting(false)
      setExecutingNodes(new Set())
    }
  }, [nodes, edges, executionEngine, isExecuting, executionSpeed])

  // Stop execution
  const stopExecution = useCallback(() => {
    executionEngine.stop()
    setIsExecuting(false)
    setExecutingNodes(new Set())
  }, [executionEngine])

  // Reset execution
  const resetExecution = useCallback(() => {
    executionEngine.reset()
    setIsExecuting(false)
    setExecutingNodes(new Set())
    setExecutionResults(new Map())
  }, [executionEngine])

  // Step through execution
  const stepExecution = useCallback(async () => {
    if (isExecuting) return

    // TODO: Implement step-by-step execution
    console.log('Step execution not yet implemented')
  }, [isExecuting])

  // ========================================
  // EVENT HANDLERS
  // ========================================

  // Handle node changes and track modifications
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes)
      // Mark as modified if there are actual changes (not just selection)
      if (changes.some((change) => change.type !== 'select')) {
        setMapModifiedAfterLoad(true)
      }
    },
    [onNodesChange, setMapModifiedAfterLoad]
  )

  // Handle edge changes and track modifications
  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes)
      // Mark as modified if there are actual changes (not just selection)
      if (changes.some((change) => change.type !== 'select')) {
        setMapModifiedAfterLoad(true)
      }
    },
    [onEdgesChange, setMapModifiedAfterLoad]
  )

  // Update selection state for UI
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes = [], edges: selectedEdges = [] }) => {
      // Extract node IDs from selected nodes
      const nodeIds = selectedNodes.map((node) => node.id)
      setSelectedNodes(nodeIds)

      // Extract edge IDs from selected edges
      const edgeIds = selectedEdges.map((edge) => edge.id)
      setSelectedEdges(edgeIds)

      console.log('Selection changed:', { nodes: nodeIds, edges: edgeIds })
    },
    [setSelectedNodes, setSelectedEdges]
  )

  // Handle key commands (delete, undo, redo, etc.)
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedNodes()
        deleteSelectedEdges()
      } else if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault()
          // handleUndo() will be called later
        } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault()
          // handleRedo() will be called later
        }
      }
    },
    [deleteSelectedNodes, deleteSelectedEdges]
  )

  // Undo functionality
  const handleUndo = useCallback(() => {
    const previousState = history.undo()
    if (previousState) {
      setNodes(previousState.nodes)
      setEdges(previousState.edges)
    }
  }, [history, setNodes, setEdges])

  // Redo functionality
  const handleRedo = useCallback(() => {
    const nextState = history.redo()
    if (nextState) {
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
    }
  }, [history, setNodes, setEdges])

  // Global key handler for undo/redo
  React.useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault()
          handleUndo()
        } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault()
          handleRedo()
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleUndo, handleRedo])

  // Add to history when nodes or edges change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      history.addToHistory(nodes, edges)
    }, 100) // Much faster response for undo/redo

    return () => clearTimeout(timer)
  }, [nodes, edges, history])

  // Template loading handler
  const handleLoadTemplate = useCallback(
    (template) => {
      setNodes(template.nodes)
      setEdges(template.edges)
      history.clearHistory(template.nodes, template.edges)

      // Fit view after loading template
      setTimeout(() => fitView(), 100)
    },
    [setNodes, setEdges, history, fitView]
  )

  // Panel toggle handlers
  const toggleNodeLibrary = useCallback(() => {
    setNodeLibraryVisible((prev) => !prev)
  }, [])

  const toggleTemplates = useCallback(() => {
    setTemplatesVisible((prev) => !prev)
  }, [])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevDarkMode) => !prevDarkMode)
  }, [])

  // ========================================
  // PREPARE NODES WITH EXECUTION STATE (WITHOUT MODIFYING MAIN STATE)
  // ========================================

  // Create nodes with execution state for rendering (don't modify main nodes state)
  const nodesWithExecutionState = React.useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isExecuting: executingNodes.has(node.id),
        hasExecuted: executionResults.has(node.id),
        executionResult: executionResults.get(node.id),
      },
    }))
  }, [nodes, executingNodes, executionResults])

  // ========================================
  // RENDER COMPONENT
  // ========================================

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
        color: darkMode ? '#e0e0e0' : '#333',
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodesWithExecutionState}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={[]} // Disable default deletion to use our custom handler
        fitView
      >
        {/* Map Header with title and save/load controls */}
        <MapHeader
          currentMapName={currentMapName}
          setCurrentMapName={setCurrentMapName}
          mapModifiedAfterLoad={mapModifiedAfterLoad}
          saveMap={saveMap}
          loadMapId={loadMapId}
          setLoadMapId={setLoadMapId}
          availableMaps={availableMaps}
          fetchAvailableMaps={fetchAvailableMaps}
          isLoading={isLoading}
          loadMapById={loadMapById}
          exportToPNG={exportAsPng}
          exportToJSON={exportAsJson}
          importFromJSON={importFromJson}
          createSampleMap={createNewMap}
        />

        {/* Theme Controls */}
        <ThemeControls
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          selectedEdgeType={selectedEdgeType}
          setSelectedEdgeType={setSelectedEdgeType}
        />

        {/* Background and controls */}
        <Background color={darkMode ? '#444444' : '#aaaaaa'} gap={16} />
        <Controls />
        <MiniMap
          zoomable
          pannable
          nodeStrokeColor={darkMode ? '#888888' : '#555555'}
          nodeStrokeWidth={2}
          nodeBorderRadius={4}
          nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return darkMode ? '#4caf50' : '#a5d6a7'
              case 'output':
                return darkMode ? '#f44336' : '#ef9a9a'
              default:
                return darkMode ? '#555555' : '#d3d3d3'
            }
          }}
          maskColor={darkMode ? 'rgba(20,20,20,0.6)' : 'rgba(240,240,240,0.6)'}
          className={`minimap-${darkMode ? 'dark' : 'light'}`}
          inversePan={false}
          position="bottom-right"
        />

        {/* Node and Edge Operation Controls */}
        <MapControls
          addNode={addNode}
          linkSelectedNodes={linkSelectedNodes}
          linkAllNodes={linkAllNodes}
          smartLinkNodes={smartLinkNodes}
          autoConnectEnabled={autoConnectEnabled}
          setAutoConnectEnabled={setAutoConnectEnabled}
          selectedEdgeType={selectedEdgeType}
          setSelectedEdgeType={setSelectedEdgeType}
          alignNodes={alignNodes}
          distributeNodes={distributeNodes}
          autoLayout={autoLayout}
          darkMode={darkMode}
          selectedNodes={selectedNodes}
          selectedEdges={selectedEdges}
          deleteSelectedNodes={deleteSelectedNodes}
          deleteSelectedEdges={deleteSelectedEdges}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onToggleNodeLibrary={toggleNodeLibrary}
          onToggleTemplates={toggleTemplates}
          executeWorkflow={executeWorkflow}
          stopExecution={stopExecution}
          resetExecution={resetExecution}
          stepExecution={stepExecution}
          isExecuting={isExecuting}
          executionSpeed={executionSpeed}
          setExecutionSpeed={setExecutionSpeed}
        />

        {/* Node Library Panel */}
        <NodeLibrary
          addNode={addNode}
          darkMode={darkMode}
          isVisible={nodeLibraryVisible}
          onToggle={toggleNodeLibrary}
        />

        {/* Map Templates Panel */}
        <MapTemplates
          onLoadTemplate={handleLoadTemplate}
          darkMode={darkMode}
          isVisible={templatesVisible}
          onToggle={toggleTemplates}
        />
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
