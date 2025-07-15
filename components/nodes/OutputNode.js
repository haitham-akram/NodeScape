import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { useExecution } from '../../contexts/ExecutionContext'

/**
 * Output node component with distinct styling
 * Only has an input handle (serves as a data sink)
 */
const OutputNode = ({ data, selected, id }) => {
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
      return 'var(--theme-warning)'
    }
    if (hasExecuted) {
      return 'var(--theme-success)'
    }
    if (selected) {
      return 'var(--theme-primary)'
    }
    return 'var(--theme-node-output-bg)'
  }

  // Determine text color based on execution state
  const getNodeTextColor = () => {
    if (isExecuting || hasExecuted) {
      return '#ffffff' // Always white for execution states (colored backgrounds)
    }
    if (selected) {
      // For selected state, use theme text color for better contrast
      return 'var(--theme-text)'
    }
    return 'var(--theme-node-output-text)'
  }

  // Determine border color based on execution state
  const getBorderColor = () => {
    if (isExecuting) return 'rgba(255,152,0,0.5)'
    if (hasExecuted) return 'rgba(76,175,80,0.5)'
    if (selected) return 'rgba(255,152,0,0.3)'
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
        border: `2px solid ${getBorderColor() || 'var(--theme-node-output-border)'}`,
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px var(--theme-shadow), 0 0 0 2px var(--theme-warning)'
          : isExecuting
          ? '0 6px 20px rgba(255,152,0,0.3), 0 2px 10px rgba(255,152,0,0.2)'
          : hasExecuted
          ? '0 6px 20px rgba(76,175,80,0.3), 0 2px 10px rgba(76,175,80,0.2)'
          : `0 6px 20px var(--theme-shadow), 0 2px 10px var(--theme-shadow)`,
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
          background: 'var(--theme-text)',
          width: '10px',
          height: '10px',
          left: '-5px',
          border: `2px solid var(--theme-surface)`,
          boxShadow: `0 2px 4px var(--theme-shadow)`,
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
          <div
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: getNodeTextColor(),
              transition: 'color 0.3s ease',
            }}
          >
            {label}
          </div>

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
                color: getNodeTextColor(),
                maxHeight: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: 'rgba(255,243,224,0.8)',
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid rgba(255,152,0,0.3)',
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

export default OutputNode
