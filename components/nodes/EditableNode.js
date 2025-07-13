import React, { useState, useRef } from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Custom node component for editable labels
 * Standard default node with input and output handles
 */
const EditableNode = ({ data, selected }) => {
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
          ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: 'none !important',
        borderRadius: '16px',
        padding: '16px 20px',
        minWidth: '140px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected
          ? '0 8px 25px rgba(25,118,210,0.4), 0 0 0 2px rgba(25,118,210,0.3)'
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
        <div style={{ fontSize: '14px', fontWeight: '500' }}>{label}</div>
      )}
    </div>
  )
}

export default EditableNode
