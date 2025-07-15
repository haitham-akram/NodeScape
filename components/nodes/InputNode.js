import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { useExecution } from '../../contexts/ExecutionContext'

/**
 * Input node component with distinct styling
 * Only has an output handle (serves as a data source)
 */
const InputNode = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const [isEditingValue, setIsEditingValue] = useState(false)
  const [value, setValue] = useState(data.value || '')
  const inputRef = useRef(null)
  const valueRef = useRef(null)

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

  const handleValueDoubleClick = (e) => {
    e.stopPropagation()
    setIsEditingValue(true)
    setTimeout(() => valueRef.current?.focus(), 0)
  }

  const handleValueKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditingValue(false)
      data.value = value
    }
    if (e.key === 'Escape') {
      setIsEditingValue(false)
      setValue(data.value || '')
    }
  }

  const handleValueBlur = () => {
    setIsEditingValue(false)
    data.value = value
  }

  // Determine background based on execution state
  const getNodeBackground = () => {
    return 'var(--theme-surface)'
  }

  // Determine text color based on execution state
  const getNodeTextColor = () => {
    // Always use theme text color for better contrast with theme surface
    return 'var(--theme-text)'
  }

  // Determine border color based on execution state
  const getBorderColor = () => {
    if (isExecuting) return 'rgba(255,152,0,0.5)'
    if (hasExecuted) return 'rgba(76,175,80,0.5)'
    if (selected) return 'var(--theme-primary)'
    return 'var(--theme-border)'
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
        border: `2px solid ${getBorderColor() || 'var(--theme-node-input-border)'}`,
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px var(--theme-shadow), 0 0 0 2px var(--theme-success)'
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
      className="react-flow__node-input"
      onDoubleClick={handleDoubleClick}
    >
      {/* Input icon */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '12px',
          color: '#4caf50',
          fontWeight: 'bold',
        }}
      >
        📥
      </div>

      {/* Connection handles - Input nodes only output data */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'var(--theme-text)',
          width: '10px',
          height: '10px',
          right: '-5px',
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
            color: getNodeTextColor(),
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

          {/* Value input section */}
          <div style={{ marginTop: '8px' }}>
            {isEditingValue ? (
              <input
                ref={valueRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleValueKeyPress}
                onBlur={handleValueBlur}
                placeholder="Enter value..."
                style={{
                  border: `1px solid var(--theme-border)`,
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  width: '100%',
                  background: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  outline: 'none',
                }}
              />
            ) : (
              <div
                onDoubleClick={handleValueDoubleClick}
                style={{
                  border: '1px dashed #a5d6a7',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  minHeight: '20px',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.7)',
                  color: value ? getNodeTextColor() : 'var(--theme-text-muted)',
                }}
                title="Double-click to edit value"
              >
                {value || 'Double-click to set value'}
              </div>
            )}
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
                background: 'rgba(232,245,232,0.5)',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              Output: {formatResultForDisplay(executionResult)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InputNode
