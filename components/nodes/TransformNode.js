import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { useExecution } from '../../contexts/ExecutionContext'

/**
 * Transform Node Component
 * Specialized node for data transformation operations
 */
const TransformNode = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || 'Transform')
  const inputRef = useRef(null)

  // Get execution state from context
  const { isNodeExecuting, hasNodeExecuted, getNodeResult } = useExecution()
  const isExecuting = isNodeExecuting(id)
  const hasExecuted = hasNodeExecuted(id)
  const executionResult = getNodeResult(id)

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

  // Get operation display
  const getOperationDisplay = () => {
    const config = data.config || {}
    switch (config.operation) {
      case 'map':
        return '🔄 Map'
      case 'filter':
        return '🔍 Filter'
      case 'reduce':
        return '📊 Reduce'
      case 'sort':
        return '🔢 Sort'
      default:
        return '⚙️ Transform'
    }
  }

  const getNodeBackground = () => {
    if (isExecuting) {
      return 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)'
    }
    if (hasExecuted) {
      return 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)'
    }
    if (selected) {
      return 'linear-gradient(135deg, #e1f5fe 0%, #81d4fa 100%)'
    }
    return 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)'
  }

  const getBorderColor = () => {
    if (isExecuting) return 'rgba(255,152,0,0.8)'
    if (hasExecuted) return 'rgba(76,175,80,0.8)'
    if (selected) return 'rgba(3,169,244,0.8)'
    return 'rgba(156,39,176,0.6)'
  }

  return (
    <div
      className="transform-node"
      style={{
        background: getNodeBackground(),
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '150px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#9c27b0',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
        }}
      />

      {/* Operation Type Badge */}
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          right: '8px',
          background: '#9c27b0',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: 'bold',
        }}
      >
        {getOperationDisplay()}
      </div>

      {/* Node Label */}
      <div style={{ marginBottom: '8px' }}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 'bold',
              width: '100%',
              outline: 'none',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            {label}
          </div>
        )}
      </div>

      {/* Configuration Preview */}
      {data.config?.expression && (
        <div
          style={{
            fontSize: '11px',
            color: '#666',
            fontFamily: 'monospace',
            background: 'rgba(255,255,255,0.5)',
            padding: '4px 6px',
            borderRadius: '4px',
            marginBottom: '4px',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.config.expression}
        </div>
      )}

      {/* Execution Status */}
      {isExecuting && (
        <div
          style={{
            fontSize: '11px',
            color: '#f57c00',
            fontWeight: 'bold',
          }}
        >
          🔄 Processing...
        </div>
      )}

      {hasExecuted && executionResult && (
        <div
          style={{
            fontSize: '11px',
            color: '#388e3c',
            fontWeight: 'bold',
          }}
        >
          ✅ Transformed
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#9c27b0',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
        }}
      />
    </div>
  )
}

export default TransformNode
