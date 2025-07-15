import React, { useState, useEffect } from 'react'
import { Panel } from 'reactflow'

/**
 * Execution Monitor Panel
 * Shows real-time execution status and performance metrics
 */
const ExecutionMonitor = ({
  isExecuting,
  executingNodes,
  executionResults,
  executionHistory = [],
  darkMode = false,
  isVisible = true,
}) => {
  const [metrics, setMetrics] = useState({
    totalNodes: 0,
    executedNodes: 0,
    executionTime: 0,
    avgNodeTime: 0,
    errors: 0,
  })

  useEffect(() => {
    if (executionHistory.length > 0) {
      const completed = executionHistory.filter((h) => h.status === 'completed')
      const errors = executionHistory.filter((h) => h.status === 'error')
      const totalTime = completed.reduce((sum, h) => sum + (h.endTime - h.startTime), 0)

      setMetrics({
        totalNodes: executingNodes.size + executionResults.size,
        executedNodes: executionResults.size,
        executionTime: totalTime,
        avgNodeTime: completed.length > 0 ? totalTime / completed.length : 0,
        errors: errors.length,
      })
    }
  }, [executingNodes, executionResults, executionHistory])

  if (!isVisible) return null

  return (
    <Panel position="bottom-left" className={`execution-monitor ${darkMode ? 'dark' : 'light'}`}>
      <div
        style={{
          width: '320px',
          padding: '16px',
          backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
          border: darkMode ? '1px solid #444' : '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '18px', marginRight: '8px' }}>{isExecuting ? '⚡' : '📊'}</span>
          <h3
            style={{
              margin: 0,
              color: darkMode ? '#ffffff' : '#333333',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Execution Monitor
          </h3>
          {isExecuting && (
            <div
              style={{
                marginLeft: 'auto',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                animation: 'pulse 1.5s infinite',
              }}
            />
          )}
        </div>

        {/* Status Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '12px',
              background: darkMode ? '#333' : '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#2196f3',
              }}
            >
              {metrics.executedNodes}/{metrics.totalNodes}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: darkMode ? '#ccc' : '#666',
              }}
            >
              Nodes Executed
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              background: darkMode ? '#333' : '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: metrics.errors > 0 ? '#f44336' : '#4caf50',
              }}
            >
              {metrics.errors}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: darkMode ? '#ccc' : '#666',
              }}
            >
              Errors
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: darkMode ? '#ccc' : '#666',
              }}
            >
              Total Time:
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: darkMode ? '#fff' : '#333',
              }}
            >
              {metrics.executionTime.toFixed(0)}ms
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: darkMode ? '#ccc' : '#666',
              }}
            >
              Avg per Node:
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: darkMode ? '#fff' : '#333',
              }}
            >
              {metrics.avgNodeTime.toFixed(0)}ms
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {metrics.totalNodes > 0 && (
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: darkMode ? '#ccc' : '#666',
                }}
              >
                Progress
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: darkMode ? '#fff' : '#333',
                }}
              >
                {Math.round((metrics.executedNodes / metrics.totalNodes) * 100)}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: darkMode ? '#444' : '#e0e0e0',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(metrics.executedNodes / metrics.totalNodes) * 100}%`,
                  height: '100%',
                  backgroundColor: isExecuting ? '#2196f3' : '#4caf50',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Currently Executing Nodes */}
        {executingNodes.size > 0 && (
          <div>
            <div
              style={{
                fontSize: '12px',
                color: darkMode ? '#ccc' : '#666',
                marginBottom: '8px',
              }}
            >
              Currently Executing:
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              {Array.from(executingNodes).map((nodeId) => (
                <span
                  key={nodeId}
                  style={{
                    padding: '2px 6px',
                    background: '#2196f3',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  {nodeId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Panel>
  )
}

export default ExecutionMonitor
