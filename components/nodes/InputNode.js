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
    if (isExecuting) {
      return 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)'
    }
    if (hasExecuted) {
      return 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)'
    }
    if (selected) {
      return 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)'
    }
    return 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
  }

  // Determine border color based on execution state
  const getBorderColor = () => {
    if (isExecuting) return 'rgba(255,152,0,0.5)'
    if (hasExecuted) return 'rgba(76,175,80,0.5)'
    if (selected) return 'rgba(76,175,80,0.3)'
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
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px rgba(76,175,80,0.4), 0 0 0 2px rgba(76,175,80,0.3)'
          : isExecuting
          ? '0 6px 20px rgba(255,152,0,0.3), 0 2px 10px rgba(255,152,0,0.2)'
          : hasExecuted
          ? '0 6px 20px rgba(76,175,80,0.3), 0 2px 10px rgba(76,175,80,0.2)'
          : '0 6px 20px rgba(76,175,80,0.15), 0 2px 10px rgba(76,175,80,0.1)',
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
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#2e7d32' }}>{label}</div>

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
                  border: '1px solid #a5d6a7',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  width: '100%',
                  background: 'white',
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
                  color: value ? '#2e7d32' : '#999',
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
                color: '#2e7d32',
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
