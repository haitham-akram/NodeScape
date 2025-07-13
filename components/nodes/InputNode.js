import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Input node component with distinct styling
 * Only has an output handle (serves as a data source)
 */
const InputNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef(null)

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

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)'
          : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        border: 'none !important',
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px rgba(76,175,80,0.4), 0 0 0 2px rgba(76,175,80,0.3)'
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
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#2e7d32' }}>{label}</div>
      )}
    </div>
  )
}

export default InputNode
