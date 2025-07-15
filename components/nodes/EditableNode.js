import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { useExecution } from '../../contexts/ExecutionContext'

/**
 * Custom node component for editable labels
 * Standard default node with input and output handles
 */
const EditableNode = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
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

  // Determine background based on execution state
  const getNodeBackground = () => {
    if (isExecuting) {
      return 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)'
    }
    if (hasExecuted) {
      return 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)'
    }
    if (selected) {
      return 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    }
    return 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
  }

  // Determine border color based on execution state
  const getBorderColor = () => {
    if (isExecuting) return 'rgba(255,152,0,0.5)'
    if (hasExecuted) return 'rgba(76,175,80,0.5)'
    if (selected) return 'rgba(25,118,210,0.3)'
    return 'transparent'
  }

  // Format execution result for display
  const formatResultForDisplay = (result) => {
    if (result === null || result === undefined) {
      return 'No data'
    }

    // If it's a string or number, show it directly
    if (typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean') {
      const str = String(result)
      return str.length > 30 ? str.substring(0, 30) + '...' : str
    }

    // If it's an object with a 'value' property, show just the value
    if (typeof result === 'object' && result.value !== undefined) {
      return formatResultForDisplay(result.value)
    }

    // For other objects, show a clean JSON representation
    try {
      const str = JSON.stringify(result)
      return str.length > 30 ? str.substring(0, 30) + '...' : str
    } catch (e) {
      return String(result).substring(0, 30) + '...'
    }
  }

  return (
    <div
      style={{
        background: getNodeBackground(),
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '16px',
        padding: '16px 20px',
        minWidth: '140px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 8px 25px rgba(25,118,210,0.4), 0 0 0 2px rgba(25,118,210,0.3)'
          : isExecuting
          ? '0 4px 15px rgba(255,152,0,0.3), 0 2px 8px rgba(255,152,0,0.2)'
          : hasExecuted
          ? '0 4px 15px rgba(76,175,80,0.3), 0 2px 8px rgba(76,175,80,0.2)'
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
        <>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{label}</div>

          {/* Execution status indicator */}
          {isExecuting && (
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ff9800',
                animation: 'pulse 1.5s infinite',
              }}
            />
          )}

          {/* Execution result display */}
          {hasExecuted && executionResult && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#666',
                maxHeight: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: 'rgba(248,249,250,0.8)',
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              Result: {formatResultForDisplay(executionResult)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default EditableNode
