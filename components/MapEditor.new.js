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
import { ExecutionProvider, useExecution } from '../contexts/ExecutionContext'
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

  // Execution management (from context)
  const { executingNodes, executionResults } = useExecution()
  const executionManager = useExecutionManager(nodes, edges)

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
    markMapAsModified: (value) => setMapModifiedAfterLoad(value),
  })

  // Extract map operations functions
  const {
    saveMap,
    loadMapById,
    exportAsJson,
    importFromJson,
    exportAsPng,
    createNewMap,
    canSave,
    loadMapId,
    setLoadMapId,
    isLoading,
    mapModifiedAfterLoad,
    setMapModifiedAfterLoad,
    availableMaps,
    fetchAvailableMaps,
  } = mapOperations

  // Edge operations
  const edgeOperations = useEdgeOperations({
    nodes,
    edges,
    setEdges,
    selectedNodes,
    selectedEdges,
    setSelectedEdges,
    autoConnectEnabled,
    selectedEdgeType,
    markMapAsModified: (value) => setMapModifiedAfterLoad(value),
  })

  // Extract edge operations functions
  const { linkSelectedNodes, linkAllNodes, smartLinkNodes, deleteSelectedEdges } = edgeOperations

  // Graph utilities
  const graphUtils = useGraphUtils({
    nodes,
    setNodes,
    selectedNodes,
    getViewport,
    fitView,
    markMapAsModified: (value) => setMapModifiedAfterLoad(value),
  })

  // Extract graph utilities
  const { alignNodes, distributeNodes, autoLayout } = graphUtils

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
    },
    [setSelectedNodes, setSelectedEdges]
  )

  // Create enhanced addNode function
  const addNode = useCallback(
    (type = 'default', position) => {
      const newNode = addNodeOriginal(type, position)
      return newNode
    },
    [addNodeOriginal]
  )

  // Handle undo operations
  const handleUndo = useCallback(() => {
    const { nodes: prevNodes, edges: prevEdges } = history.undo()
    if (prevNodes && prevEdges) {
      setNodes(prevNodes)
      setEdges(prevEdges)
    }
  }, [history, setNodes, setEdges])

  // Handle redo operations
  const handleRedo = useCallback(() => {
    const { nodes: nextNodes, edges: nextEdges } = history.redo()
    if (nextNodes && nextEdges) {
      setNodes(nextNodes)
      setEdges(nextEdges)
    }
  }, [history, setNodes, setEdges])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)
  }, [])

  // Toggle node library panel
  const toggleNodeLibrary = useCallback(() => {
    setNodeLibraryVisible((prev) => !prev)
  }, [])

  // Toggle templates panel
  const toggleTemplates = useCallback(() => {
    setTemplatesVisible((prev) => !prev)
  }, [])

  // Load template handler
  const handleLoadTemplate = useCallback(
    (templateData) => {
      const { nodes: templateNodes, edges: templateEdges } = templateData
      setNodes(templateNodes)
      setEdges(templateEdges)
      setMapModifiedAfterLoad(true)

      // Update node counter to avoid conflicts
      const maxId = Math.max(...templateNodes.map((node) => parseInt(node.id.replace(/\D/g, '')) || 0), 0)
      setNodeCounter(maxId + 1)

      // Close template panel
      setTemplatesVisible(false)

      // Fit view to show all nodes
      setTimeout(() => fitView(), 100)
    },
    [setNodes, setEdges, setNodeCounter, fitView, setMapModifiedAfterLoad]
  )

  // ========================================
  // ENHANCED NODE RENDERING WITH EXECUTION STATE
  // ========================================

  // Enhanced nodes with execution state
  const enhancedNodes = React.useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isExecuting: executingNodes.has(node.id),
        executionResult: executionResults.get(node.id),
        onLabelChange: (newLabel) => updateNodeLabel(node.id, newLabel),
      },
    }))
  }, [nodes, executingNodes, executionResults, updateNodeLabel])

  // ========================================
  // RENDER
  // ========================================

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={null}
        multiSelectionKeyCode={null}
        selectionKeyCode={null}
        panOnDrag={true}
        selectionOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        className={`map-editor ${darkMode ? 'dark' : 'light'}`}
      >
        {/* Header with save/load controls */}
        <MapHeader
          saveMap={saveMap}
          canSave={canSave}
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
          executeWorkflow={executionManager.executeWorkflow}
          stopExecution={executionManager.stopExecution}
          resetExecution={executionManager.resetExecution}
          stepExecution={executionManager.stepExecution}
          isExecuting={executionManager.isExecuting}
          executionSpeed={executionManager.executionSpeed}
          setExecutionSpeed={executionManager.setExecutionSpeed}
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

// Wrap the component with ReactFlowProvider and ExecutionProvider
const MapEditorWithProvider = () => {
  return (
    <ReactFlowProvider>
      <ExecutionProvider>
        <MapEditor />
      </ExecutionProvider>
    </ReactFlowProvider>
  )
}

export default MapEditorWithProvider
