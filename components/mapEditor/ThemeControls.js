import React from 'react'
import { Panel } from 'reactflow'

/**
 * Theme Controls Component
 * Provides UI controls for customizing the visual appearance of the graph
 */
const ThemeControls = ({ selectedEdgeType, setSelectedEdgeType, darkMode, setDarkMode }) => {
  return (
    <Panel
      position="bottom-left"
      style={{
        padding: '10px',
        background: 'var(--theme-surface)',
        borderRadius: '8px',
        border: `1px solid var(--theme-border)`,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div>
          <label
            style={{
              fontSize: '14px',
              marginRight: '8px',
              color: 'var(--theme-text)',
            }}
          >
            Edge Type:
          </label>
          <select
            value={selectedEdgeType}
            onChange={(e) => setSelectedEdgeType(e.target.value)}
            style={{
              padding: '6px 10px',
              border: `1px solid var(--theme-border)`,
              borderRadius: '4px',
              fontSize: '14px',
              background: 'var(--theme-bg)',
              color: 'var(--theme-text)',
              transition: 'all 0.2s ease',
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
            background: 'var(--theme-surface-secondary)',
            padding: '6px 12px',
            border: `1px solid var(--theme-border)`,
            borderRadius: '4px',
            color: 'var(--theme-text)',
            transition: 'all 0.2s ease',
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
