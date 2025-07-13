import React from 'react'
import { Panel } from 'reactflow'

/**
 * Theme Controls Component
 * Provides UI controls for customizing the visual appearance of the graph
 */
const ThemeControls = ({ selectedEdgeType, setSelectedEdgeType, darkMode, setDarkMode }) => {
  return (
    <Panel position="bottom-left" style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '14px', marginRight: '8px' }}>Edge Type:</label>
          <select
            value={selectedEdgeType}
            onChange={(e) => setSelectedEdgeType(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="default">Default</option>
            <option value="straight">Straight</option>
            <option value="step">Step</option>
            <option value="smoothstep">Smooth Step</option>
            <option value="simplebezier">Bezier</option>
          </select>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            background: '#f5f5f5',
            padding: '6px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
          Dark Mode
        </label>
      </div>
    </Panel>
  )
}

export default ThemeControls
