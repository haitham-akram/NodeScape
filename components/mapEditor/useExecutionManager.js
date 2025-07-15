import React, { useState, useCallback } from 'react'
import { useExecution } from '../../contexts/ExecutionContext'
import ExecutionEngine from './executionEngine'

/**
 * Execution Manager Hook
 * Handles all execution logic separate from MapEditor
 */
export const useExecutionManager = (nodes, edges) => {
  const [executionEngine] = useState(() => new ExecutionEngine())
  const [executionSpeed, setExecutionSpeed] = useState(1000)

  const { isExecuting, setIsExecuting, setExecutingNodes, setExecutionResults, clearExecution } = useExecution()

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
  }, [executionEngine, setIsExecuting, setExecutingNodes, setExecutionResults])

  // Execute workflow
  const executeWorkflow = useCallback(async () => {
    if (isExecuting) return

    setIsExecuting(true)
    clearExecution()

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
  }, [nodes, edges, executionEngine, isExecuting, executionSpeed, setIsExecuting, clearExecution])

  // Stop execution
  const stopExecution = useCallback(() => {
    executionEngine.stop()
    setIsExecuting(false)
    setExecutingNodes(new Set())
  }, [executionEngine, setIsExecuting, setExecutingNodes])

  // Reset execution
  const resetExecution = useCallback(() => {
    executionEngine.reset()
    clearExecution()
  }, [executionEngine, clearExecution])

  // Step execution (placeholder)
  const stepExecution = useCallback(async () => {
    if (isExecuting) return
    console.log('Step execution not yet implemented')
  }, [isExecuting])

  return {
    executeWorkflow,
    stopExecution,
    resetExecution,
    stepExecution,
    isExecuting,
    executionSpeed,
    setExecutionSpeed,
  }
}
