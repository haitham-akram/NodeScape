import React, { useState, useEffect } from 'react'
import { Panel } from 'reactflow'

/**
 * Node Configuration Panel
 * Allows users to configure selected node properties
 */
const NodeConfigPanel = ({ selectedNode, onUpdateNode, darkMode = false, isVisible = true }) => {
  const [config, setConfig] = useState({})

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data?.config || {})
    }
  }, [selectedNode])

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)

    if (onUpdateNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        config: newConfig,
      })
    }
  }

  const getConfigFields = (nodeType) => {
    switch (nodeType) {
      case 'input':
        return [
          { key: 'value', label: 'Default Value', type: 'text' },
          { key: 'dataType', label: 'Data Type', type: 'select', options: ['string', 'number', 'boolean', 'json'] },
        ]

      case 'transform':
        return [
          { key: 'operation', label: 'Operation', type: 'select', options: ['map', 'filter', 'reduce', 'sort'] },
          { key: 'expression', label: 'Expression', type: 'textarea' },
        ]

      case 'api':
        return [
          { key: 'url', label: 'API URL', type: 'text' },
          { key: 'method', label: 'HTTP Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
          { key: 'headers', label: 'Headers', type: 'json' },
        ]

      default:
        return [
          { key: 'delay', label: 'Processing Delay (ms)', type: 'number' },
          { key: 'operation', label: 'Operation', type: 'text' },
        ]
    }
  }

  if (!isVisible || !selectedNode) {
    return null
  }

  const fields = getConfigFields(selectedNode.type)

  return (
    <Panel position="top-right" className={`node-config-panel ${darkMode ? 'dark' : 'light'}`}>
      <div
        style={{
          width: '300px',
          padding: '16px',
          backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
          border: darkMode ? '1px solid #444' : '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            color: darkMode ? '#ffffff' : '#333333',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Configure: {selectedNode.data?.label}
        </h3>

        {fields.map((field) => (
          <div key={field.key} style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                color: darkMode ? '#cccccc' : '#666666',
                fontSize: '14px',
              }}
            >
              {field.label}
            </label>

            {field.type === 'select' ? (
              <select
                value={config[field.key] || ''}
                onChange={(e) => handleConfigChange(field.key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: darkMode ? '#333' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                }}
              >
                <option value="">Select...</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={config[field.key] || ''}
                onChange={(e) => handleConfigChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: darkMode ? '#333' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
            ) : (
              <input
                type={field.type}
                value={config[field.key] || ''}
                onChange={(e) => handleConfigChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: darkMode ? '#333' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                }}
              />
            )}
          </div>
        ))}

        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: darkMode ? '1px solid #444' : '1px solid #eee',
          }}
        >
          <small style={{ color: darkMode ? '#888' : '#666' }}>Double-click the node to edit its label</small>
        </div>
      </div>
    </Panel>
  )
}

export default NodeConfigPanel
