import React, { useState, useCallback, useEffect } from 'react'
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
  addEdge,
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

// Import Phase 2 components
import MobileControls from './responsive/MobileControls'
import { useMobileDetection, useTouchGestures } from './responsive/MobileDetection'
import AdvancedThemeControls from './theming/AdvancedThemeControls'
import CommandPalette from './commands/CommandPalette'
import ShortcutsSettings from './commands/ShortcutsSettings'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { ThemeProvider, useTheme } from '../contexts/AdvancedThemeContext'

// Import operation hooks
import useNodeOperations from '../lib/hooks/nodeOperations'
import useEdgeOperations from '../lib/hooks/edgeOperations'
import useMapOperations from '../lib/hooks/mapOperations'
import useGraphUtils from '../lib/hooks/graphUtils'
import useHistory from '../lib/hooks/useHistory'

// Import execution context and manager
import { ExecutionProvider, useExecution } from '../contexts/ExecutionContext'
import { useExecutionManager } from '../lib/hooks/useExecutionManager'

/**
 * Main MapEditor component with Phase 2 enhancements
 * Central component that coordinates all graph editing functionality
 */
const MapEditorInner = () => {
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

  // Panel visibility states
  const [nodeLibraryVisible, setNodeLibraryVisible] = useState(false)
  const [templatesVisible, setTemplatesVisible] = useState(false)

  // Phase 2: Advanced UI states
  const [advancedThemeControlsVisible, setAdvancedThemeControlsVisible] = useState(false)
  const [commandPaletteVisible, setCommandPaletteVisible] = useState(false)
  const [shortcutsSettingsVisible, setShortcutsSettingsVisible] = useState(false)

  // Access React Flow instance
  const { fitView, getViewport } = useReactFlow()

  // Phase 2: Mobile detection and theme
  const { isMobile, isTablet, touchDevice } = useMobileDetection()
  const { theme, isDarkMode, setTheme, themes, currentTheme } = useTheme()

  // Apply theme CSS variables to document root
  useEffect(() => {
    const root = document.documentElement
    if (theme && theme.colors) {
      // Set CSS custom properties for global theming
      root.style.setProperty('--theme-background', theme.colors.background)
      root.style.setProperty('--theme-surface', theme.colors.surface)
      root.style.setProperty('--theme-surface-secondary', theme.colors.surfaceSecondary)
      root.style.setProperty('--theme-primary', theme.colors.primary)
      root.style.setProperty('--theme-secondary', theme.colors.secondary)
      root.style.setProperty('--theme-text', theme.colors.text)
      root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
      root.style.setProperty('--theme-text-muted', theme.colors.textMuted)
      root.style.setProperty('--theme-border', theme.colors.border)
      root.style.setProperty('--theme-border-light', theme.colors.borderLight)
      root.style.setProperty('--theme-shadow', theme.colors.shadow)
      root.style.setProperty('--theme-overlay', theme.colors.overlay)
      root.style.setProperty('--theme-error', theme.colors.error)
      root.style.setProperty('--theme-warning', theme.colors.warning)
      root.style.setProperty('--theme-success', theme.colors.success)
      root.style.setProperty('--theme-info', theme.colors.info)

      // Node colors
      root.style.setProperty('--theme-node-default-bg', theme.nodes.default.background)
      root.style.setProperty('--theme-node-default-border', theme.nodes.default.border)
      root.style.setProperty('--theme-node-default-text', theme.nodes.default.text)
      root.style.setProperty('--theme-node-input-bg', theme.nodes.input.background)
      root.style.setProperty('--theme-node-input-border', theme.nodes.input.border)
      root.style.setProperty('--theme-node-input-text', theme.nodes.input.text)
      root.style.setProperty('--theme-node-output-bg', theme.nodes.output.background)
      root.style.setProperty('--theme-node-output-border', theme.nodes.output.border)
      root.style.setProperty('--theme-node-output-text', theme.nodes.output.text)

      // Edge colors
      root.style.setProperty('--theme-edge-default', theme.edges.default.stroke)
      root.style.setProperty('--theme-edge-selected', theme.edges.default.strokeSelected)

      // Set the body background to match theme
      document.body.style.backgroundColor = theme.colors.background
      document.body.style.color = theme.colors.text
    }
  }, [theme])

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
  const { linkSelectedNodes, linkAllNodes, smartLinkNodes, deleteSelectedEdges, onConnect } = edgeOperations

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
    const result = history.undo()
    if (result && result.nodes !== undefined && result.edges !== undefined) {
      setNodes(result.nodes)
      setEdges(result.edges)
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

  // Toggle dark mode (now uses advanced theme system)
  const toggleDarkMode = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }, [isDarkMode, setTheme])

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
  // PHASE 2: KEYBOARD SHORTCUTS & COMMAND PALETTE
  // ========================================

  // Define all actions for shortcuts and command palette
  const keyboardActions = {
    // Node operations
    addNode: () => addNode('default'),
    addInputNode: () => addNode('input'),
    addOutputNode: () => addNode('output'),
    deleteSelected: () => {
      deleteSelectedNodes()
      deleteSelectedEdges()
    },
    selectAll: () => {
      setSelectedNodes(nodes.map((n) => n.id))
      setSelectedEdges(edges.map((e) => e.id))
    },
    clearSelection: () => {
      setSelectedNodes([])
      setSelectedEdges([])
    },

    // Edit operations
    undo: handleUndo,
    redo: handleRedo,
    copySelected: () => {
      /* TODO: Implement copy */
    },
    pasteNodes: () => {
      /* TODO: Implement paste */
    },
    duplicateSelected: () => {
      /* TODO: Implement duplicate */
    },

    // File operations
    saveMap: saveMap,
    saveAsMap: () => {
      /* TODO: Implement save as */
    },
    loadMap: () => {
      /* TODO: Show load dialog */
    },
    exportMap: exportAsJson,
    exportPNG: exportAsPng,
    importMap: () => {
      /* TODO: Show import dialog */
    },

    // View operations
    fitView: () => fitView(),
    resetZoom: () => {
      /* TODO: Implement reset zoom */
    },
    zoomIn: () => {
      /* TODO: Implement zoom in */
    },
    zoomOut: () => {
      /* TODO: Implement zoom out */
    },

    // Execution
    executeWorkflow: executionManager.executeWorkflow,
    stopExecution: executionManager.stopExecution,
    stepExecution: executionManager.stepExecution,
    resetExecution: executionManager.resetExecution,

    // Layout
    autoLayout: autoLayout,
    alignNodes: alignNodes,
    distributeNodes: distributeNodes,

    // Connection
    linkSelected: linkSelectedNodes,
    linkAll: linkAllNodes,
    smartLink: smartLinkNodes,

    // Panels
    toggleNodeLibrary: toggleNodeLibrary,
    toggleTemplates: toggleTemplates,
    toggleCommandPalette: () => setCommandPaletteVisible((prev) => !prev),
    toggleThemes: () => setAdvancedThemeControlsVisible((prev) => !prev),
    openSettings: () => setShortcutsSettingsVisible(true),

    // Themes
    cycleTheme: () => {
      const themeKeys = Object.keys(themes).filter((key) => !themes[key].custom)
      const currentIndex = themeKeys.indexOf(currentTheme)
      const nextIndex = (currentIndex + 1) % themeKeys.length
      setTheme(themeKeys[nextIndex])
    },
    lightTheme: () => setTheme('light'),
    darkTheme: () => setTheme('dark'),
    blueTheme: () => setTheme('blue'),
    greenTheme: () => setTheme('green'),
    purpleTheme: () => setTheme('purple'),
    sunsetTheme: () => setTheme('sunset'),
    midnightTheme: () => setTheme('midnight'),
    cyberpunkTheme: () => setTheme('cyberpunk'),
  }

  // Setup keyboard shortcuts
  const { shortcuts, setCustomShortcut, removeCustomShortcut, getFormattedShortcut } =
    useKeyboardShortcuts(keyboardActions)

  // ========================================
  // PHASE 2: TOUCH GESTURES
  // ========================================

  useTouchGestures({
    onPinch: ({ scale, center }) => {
      // TODO: Implement pinch-to-zoom
      console.log('Pinch gesture:', scale, center)
    },
    onPan: ({ deltaX, deltaY }) => {
      // TODO: Implement pan gesture
      console.log('Pan gesture:', deltaX, deltaY)
    },
    onTap: ({ x, y }) => {
      // Add node on double tap
      addNode('default', { x: x - 100, y: y - 50 })
    },
    onLongPress: ({ x, y }) => {
      // Show context menu on long press
      console.log('Long press at:', x, y)
    },
  })

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
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
        className={`map-editor ${isDarkMode ? 'dark' : 'light'} ${isMobile ? 'mobile' : ''} ${
          touchDevice ? 'touch' : ''
        }`}
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

        {/* Phase 2: Enhanced Theme Controls - Desktop only */}
        {!isMobile && !isTablet && (
          <ThemeControls
            darkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            selectedEdgeType={selectedEdgeType}
            setSelectedEdgeType={setSelectedEdgeType}
          />
        )}

        {/* Phase 2: Simple theme toggle for mobile */}
        {(isMobile || isTablet) && (
          <Panel
            position="bottom-left"
            style={{
              padding: '8px',
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              marginBottom: '80px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <button
              onClick={() => {
                const themeKeys = Object.keys(themes).filter((key) => !themes[key].custom)
                const currentIndex = themeKeys.indexOf(currentTheme)
                const nextIndex = (currentIndex + 1) % themeKeys.length
                setTheme(themeKeys[nextIndex])
              }}
              style={{
                padding: '6px 8px',
                background: theme.colors.secondary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                minWidth: '60px',
              }}
              title="Cycle through themes"
            >
              🎨 {themes[currentTheme]?.name}
            </button>
            <button
              onClick={() => setAdvancedThemeControlsVisible(true)}
              style={{
                padding: '6px 8px',
                background: theme.colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              ⚙️ Custom
            </button>
          </Panel>
        )}

        {/* Background and controls */}
        <Background color={theme.colors.border} gap={16} />
        <Controls className={isMobile || isTablet ? 'mobile-controls' : ''} />
        <MiniMap
          zoomable
          pannable
          nodeStrokeColor={theme.colors.border}
          nodeStrokeWidth={2}
          nodeBorderRadius={4}
          nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return theme.nodes.input.background
              case 'output':
                return theme.nodes.output.background
              default:
                return theme.nodes.default.background
            }
          }}
          maskColor={theme.colors.overlay}
          className={`minimap-${isDarkMode ? 'dark' : 'light'} ${isMobile ? 'mobile-minimap' : ''}`}
          inversePan={false}
          position="bottom-right"
        />

        {/* Node and Edge Operation Controls */}
        {!isMobile && !isTablet && (
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
            darkMode={isDarkMode}
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
            onToggleCommandPalette={() => setCommandPaletteVisible((prev) => !prev)}
            onToggleThemes={() => setAdvancedThemeControlsVisible((prev) => !prev)}
            executeWorkflow={executionManager.executeWorkflow}
            stopExecution={executionManager.stopExecution}
            resetExecution={executionManager.resetExecution}
            stepExecution={executionManager.stepExecution}
            isExecuting={executionManager.isExecuting}
            executionSpeed={executionManager.executionSpeed}
            setExecutionSpeed={executionManager.setExecutionSpeed}
            className="desktop-only"
          />
        )}

        {/* Phase 2: Mobile Controls */}
        <MobileControls
          addNode={addNode}
          deleteSelectedNodes={deleteSelectedNodes}
          deleteSelectedEdges={deleteSelectedEdges}
          selectedNodes={selectedNodes}
          selectedEdges={selectedEdges}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          darkMode={isDarkMode}
          onToggleNodeLibrary={toggleNodeLibrary}
          onToggleTemplates={toggleTemplates}
          onToggleCommandPalette={() => setCommandPaletteVisible((prev) => !prev)}
          executeWorkflow={executionManager.executeWorkflow}
          stopExecution={executionManager.stopExecution}
          isExecuting={executionManager.isExecuting}
          onSettings={() => setAdvancedThemeControlsVisible(true)}
        />

        {/* Node Library Panel */}
        <NodeLibrary
          addNode={addNode}
          darkMode={isDarkMode}
          isVisible={nodeLibraryVisible}
          onToggle={toggleNodeLibrary}
        />

        {/* Map Templates Panel */}
        <MapTemplates
          onLoadTemplate={handleLoadTemplate}
          darkMode={isDarkMode}
          isVisible={templatesVisible}
          onToggle={toggleTemplates}
        />

        {/* Phase 2: Advanced Theme Controls */}
        {advancedThemeControlsVisible && (
          <AdvancedThemeControls
            selectedEdgeType={selectedEdgeType}
            setSelectedEdgeType={setSelectedEdgeType}
            onClose={() => setAdvancedThemeControlsVisible(false)}
          />
        )}
      </ReactFlow>

      {/* Phase 2: Command Palette */}
      <CommandPalette
        isOpen={commandPaletteVisible}
        onClose={() => setCommandPaletteVisible(false)}
        actions={keyboardActions}
        shortcuts={shortcuts}
        getFormattedShortcut={getFormattedShortcut}
      />

      {/* Phase 2: Shortcuts Settings */}
      {shortcutsSettingsVisible && (
        <ShortcutsSettings
          shortcuts={shortcuts}
          onSetCustomShortcut={setCustomShortcut}
          onRemoveCustomShortcut={removeCustomShortcut}
          getFormattedShortcut={getFormattedShortcut}
          onClose={() => setShortcutsSettingsVisible(false)}
        />
      )}
    </div>
  )
}

// Main MapEditor component with providers
const MapEditor = () => {
  return (
    <ThemeProvider>
      <ExecutionProvider>
        <ReactFlowProvider>
          <MapEditorInner />
        </ReactFlowProvider>
      </ExecutionProvider>
    </ThemeProvider>
  )
}

export default MapEditor
