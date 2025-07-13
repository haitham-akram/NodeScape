import React, { useState, useRef } from 'react'

/**
 * Custom edge component for editable labels with different styles
 * Supports multiple edge path types: default, straight, step, smoothstep, simplebezier
 */
const EditableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  type = 'default',
  markerEnd = 'url(#arrowhead)',
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data?.label || '')
  const inputRef = useRef(null)

  // Generate different edge paths based on type
  const getEdgePath = () => {
    switch (type) {
      case 'straight':
        return `M ${sourceX},${sourceY} L ${targetX},${targetY}`
      case 'step':
        const midX = (sourceX + targetX) / 2
        return `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`
      case 'smoothstep':
        const stepMidX = (sourceX + targetX) / 2
        return `M ${sourceX},${sourceY} C ${stepMidX},${sourceY} ${stepMidX},${targetY} ${targetX},${targetY}`
      case 'simplebezier':
        const controlOffsetX = Math.abs(targetX - sourceX) * 0.3
        return `M ${sourceX},${sourceY} C ${sourceX + controlOffsetX},${sourceY} ${
          targetX - controlOffsetX
        },${targetY} ${targetX},${targetY}`
      default:
        return `M ${sourceX},${sourceY} Q ${(sourceX + targetX) / 2},${sourceY - 50} ${targetX},${targetY}`
    }
  }

  const edgePath = getEdgePath()
  const labelX = (sourceX + targetX) / 2
  const labelY = (sourceY + targetY) / 2 - 25

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      if (data) data.label = label
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data?.label || '')
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (data) data.label = label
  }

  return (
    <g>
      <path
        d={edgePath}
        stroke={selected ? '#333333' : '#000000'}
        strokeWidth={selected ? 3 : 2}
        fill="none"
        markerEnd={markerEnd}
        style={{
          transition: 'all 0.2s ease',
        }}
      />
      {(label || isEditing) && (
        <foreignObject x={labelX - 40} y={labelY - 10} width="80" height="20" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleBlur}
              style={{
                border: '1px solid #000',
                borderRadius: '4px',
                padding: '2px 4px',
                fontSize: '12px',
                width: '100%',
                textAlign: 'center',
                background: 'white',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '12px',
                background: 'rgba(255,255,255,0.9)',
                padding: '2px 4px',
                borderRadius: '4px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #ddd',
              }}
            >
              {label}
            </div>
          )}
        </foreignObject>
      )}
    </g>
  )
}

export default EditableEdge
