import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Output node component with distinct styling
 * Only has an input handle (serves as a data sink)
 */
const OutputNode = ({ data, selected }) => {
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
          ? 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)'
          : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
        border: 'none !important',
        borderRadius: '20px',
        padding: '18px 22px',
        minWidth: '150px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 10px 30px rgba(255,152,0,0.4), 0 0 0 2px rgba(255,152,0,0.3)'
          : '0 6px 20px rgba(255,152,0,0.15), 0 2px 10px rgba(255,152,0,0.1)',
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
          background: '#000000',
          width: '10px',
          height: '10px',
          left: '-5px',
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
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#ef6c00' }}>{label}</div>
      )}
    </div>
  )
}

export default OutputNode
