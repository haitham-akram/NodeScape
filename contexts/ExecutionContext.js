import React, { createContext, useContext, useState } from 'react'

// Create execution context
const ExecutionContext = createContext()

// Custom hook to use execution context
export const useExecution = () => {
  const context = useContext(ExecutionContext)
  if (!context) {
    throw new Error('useExecution must be used within ExecutionProvider')
  }
  return context
}

// Execution provider component
export const ExecutionProvider = ({ children }) => {
  const [executingNodes, setExecutingNodes] = useState(new Set())
  const [executionResults, setExecutionResults] = useState(new Map())
  const [isExecuting, setIsExecuting] = useState(false)

  const value = {
    executingNodes,
    setExecutingNodes,
    executionResults,
    setExecutionResults,
    isExecuting,
    setIsExecuting,

    // Helper functions
    isNodeExecuting: (nodeId) => executingNodes.has(nodeId),
    hasNodeExecuted: (nodeId) => executionResults.has(nodeId),
    getNodeResult: (nodeId) => executionResults.get(nodeId),

    // Clear execution state
    clearExecution: () => {
      setExecutingNodes(new Set())
      setExecutionResults(new Map())
      setIsExecuting(false)
    },
  }

  return <ExecutionContext.Provider value={value}>{children}</ExecutionContext.Provider>
}
