/**
 * Node Execution Engine
 * Handles data flow and execution of node workflows
 */

import {
  InputNodeProcessor,
  OutputNodeProcessor,
  ProcessNodeProcessor,
  TransformNodeProcessor,
  FilterNodeProcessor,
  AggregateNodeProcessor,
  ConditionNodeProcessor,
  ApiNodeProcessor,
  DatabaseNodeProcessor,
} from './nodeProcessors'

class ExecutionEngine {
  constructor() {
    this.isRunning = false
    this.executionSpeed = 1000 // ms between steps
    this.executionHistory = []
    this.currentData = new Map() // nodeId -> data
    this.listeners = new Map() // eventType -> Set of callbacks
  }

  /**
   * Execute a workflow from input nodes
   * @param {Array} nodes - All nodes in the workflow
   * @param {Array} edges - All edges connecting nodes
   * @param {Object} inputData - Initial data for input nodes
   */
  async executeWorkflow(nodes, edges, inputData = {}) {
    this.reset()
    this.isRunning = true

    try {
      // Initialize input nodes with data
      await this.initializeInputNodes(nodes, inputData)

      // Build execution order using topological sort
      const executionOrder = this.buildExecutionOrder(nodes, edges)

      // Execute nodes in order
      for (const nodeId of executionOrder) {
        if (!this.isRunning) break

        const node = nodes.find((n) => n.id === nodeId)
        if (node) {
          await this.executeNode(node, nodes, edges)
          this.notifyListeners('nodeExecuted', { nodeId, data: this.currentData.get(nodeId) })

          // Add delay for visualization
          await this.sleep(this.executionSpeed)
        }
      }

      this.notifyListeners('executionComplete', {
        data: this.currentData,
        history: this.executionHistory,
      })
    } catch (error) {
      this.notifyListeners('executionError', { error, nodeId: error.nodeId })
    } finally {
      this.isRunning = false
    }
  }

  /**
   * Execute a single node
   */
  async executeNode(node, allNodes, edges) {
    const processor = this.getNodeProcessor(node.type)
    if (!processor) {
      throw new Error(`No processor found for node type: ${node.type}`)
    }

    // Get input data from connected nodes
    const inputData = this.getNodeInputData(node.id, edges)

    // Execute the node processor
    const outputData = await processor.process(inputData, node.data)

    // Store the result
    this.currentData.set(node.id, outputData)
    this.executionHistory.push({
      nodeId: node.id,
      timestamp: Date.now(),
      input: inputData,
      output: outputData,
    })

    return outputData
  }

  /**
   * Get node processor based on type
   */
  getNodeProcessor(nodeType) {
    const processors = {
      input: new InputNodeProcessor(),
      output: new OutputNodeProcessor(),
      default: new ProcessNodeProcessor(),
      transform: new TransformNodeProcessor(),
      filter: new FilterNodeProcessor(),
      aggregate: new AggregateNodeProcessor(),
      condition: new ConditionNodeProcessor(),
      api: new ApiNodeProcessor(),
      database: new DatabaseNodeProcessor(),
    }

    return processors[nodeType] || processors['default']
  }

  /**
   * Get input data for a node from its connected predecessors
   */
  getNodeInputData(nodeId, edges) {
    const inputEdges = edges.filter((edge) => edge.target === nodeId)
    const inputData = {}

    inputEdges.forEach((edge) => {
      const sourceData = this.currentData.get(edge.source)
      if (sourceData !== undefined) {
        inputData[edge.sourceHandle || 'default'] = sourceData
      }
    })

    return inputData
  }

  /**
   * Initialize input nodes with provided data
   */
  async initializeInputNodes(nodes, inputData) {
    const inputNodes = nodes.filter((node) => node.type === 'input')

    for (const node of inputNodes) {
      const data = inputData[node.id] || node.data.defaultValue || null
      this.currentData.set(node.id, data)

      this.executionHistory.push({
        nodeId: node.id,
        timestamp: Date.now(),
        input: {},
        output: data,
      })
    }
  }

  /**
   * Build execution order using topological sort
   */
  buildExecutionOrder(nodes, edges) {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    const inDegree = new Map()
    const adjList = new Map()

    // Initialize
    nodes.forEach((node) => {
      inDegree.set(node.id, 0)
      adjList.set(node.id, [])
    })

    // Build adjacency list and calculate in-degrees
    edges.forEach((edge) => {
      adjList.get(edge.source).push(edge.target)
      inDegree.set(edge.target, inDegree.get(edge.target) + 1)
    })

    // Topological sort
    const queue = []
    const result = []

    // Start with nodes that have no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId)
      }
    })

    while (queue.length > 0) {
      const nodeId = queue.shift()
      result.push(nodeId)

      // Reduce in-degree for adjacent nodes
      adjList.get(nodeId).forEach((adjNodeId) => {
        inDegree.set(adjNodeId, inDegree.get(adjNodeId) - 1)
        if (inDegree.get(adjNodeId) === 0) {
          queue.push(adjNodeId)
        }
      })
    }

    // Check for cycles
    if (result.length !== nodes.length) {
      throw new Error('Workflow contains cycles - cannot execute')
    }

    return result
  }

  /**
   * Add execution listener
   */
  addListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType).add(callback)
  }

  /**
   * Remove execution listener
   */
  removeListener(eventType, callback) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(callback)
    }
  }

  /**
   * Notify all listeners
   */
  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error('Listener error:', error)
        }
      })
    }
  }

  /**
   * Stop execution
   */
  stop() {
    this.isRunning = false
  }

  /**
   * Reset execution state
   */
  reset() {
    this.isRunning = false
    this.currentData.clear()
    this.executionHistory = []
  }

  /**
   * Set execution speed
   */
  setSpeed(speed) {
    this.executionSpeed = speed
  }

  /**
   * Sleep utility for execution delays
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get current execution state
   */
  getState() {
    return {
      isRunning: this.isRunning,
      currentData: Object.fromEntries(this.currentData),
      history: this.executionHistory,
      speed: this.executionSpeed,
    }
  }
}

export default ExecutionEngine
