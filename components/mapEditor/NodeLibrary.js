import React, { useState, useMemo } from 'react'
import { Panel } from 'reactflow'

/**
 * Node Library Component
 * Provides a searchable library of node types and templates
 */
const NodeLibrary = ({ addNode, darkMode = false, isVisible = true, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Node categories and templates
  const nodeCategories = {
    basic: {
      name: 'Basic Nodes',
      icon: '📦',
      nodes: [
        { type: 'default', label: 'Process Node', icon: '⚙️', description: 'Basic processing node' },
        { type: 'input', label: 'Input Node', icon: '📥', description: 'Data input point' },
        { type: 'output', label: 'Output Node', icon: '📤', description: 'Data output point' },
      ],
    },
    logic: {
      name: 'Logic & Control',
      icon: '🧠',
      nodes: [
        { type: 'default', label: 'Decision', icon: '❓', description: 'Decision making node' },
        { type: 'default', label: 'Condition', icon: '🔀', description: 'Conditional logic' },
        { type: 'default', label: 'Loop', icon: '🔄', description: 'Iteration control' },
        { type: 'default', label: 'Switch', icon: '🎛️', description: 'Multi-path selector' },
      ],
    },
    data: {
      name: 'Data Processing',
      icon: '📊',
      nodes: [
        { type: 'default', label: 'Transform', icon: '🔄', description: 'Data transformation' },
        { type: 'default', label: 'Filter', icon: '🔍', description: 'Data filtering' },
        { type: 'default', label: 'Aggregate', icon: '📈', description: 'Data aggregation' },
        { type: 'default', label: 'Sort', icon: '🔢', description: 'Data sorting' },
        { type: 'default', label: 'Validate', icon: '✅', description: 'Data validation' },
      ],
    },
    integration: {
      name: 'Integration',
      icon: '🔌',
      nodes: [
        { type: 'input', label: 'API Input', icon: '🌐', description: 'External API input' },
        { type: 'output', label: 'API Output', icon: '📡', description: 'External API output' },
        { type: 'default', label: 'Database', icon: '🗄️', description: 'Database operation' },
        { type: 'default', label: 'File System', icon: '📁', description: 'File operations' },
        { type: 'default', label: 'Message Queue', icon: '📬', description: 'Message handling' },
      ],
    },
    ui: {
      name: 'User Interface',
      icon: '🖥️',
      nodes: [
        { type: 'input', label: 'Form Input', icon: '📝', description: 'User form input' },
        { type: 'output', label: 'Display', icon: '📺', description: 'Data display' },
        { type: 'default', label: 'Button', icon: '🔘', description: 'User interaction' },
        { type: 'default', label: 'Modal', icon: '🪟', description: 'Modal dialog' },
      ],
    },
  }

  // Filter nodes based on search and category
  const filteredNodes = useMemo(() => {
    const allNodes = []

    Object.entries(nodeCategories).forEach(([categoryKey, category]) => {
      if (selectedCategory === 'all' || selectedCategory === categoryKey) {
        category.nodes.forEach((node) => {
          if (
            searchTerm === '' ||
            node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.description.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            allNodes.push({ ...node, category: categoryKey, categoryName: category.name })
          }
        })
      }
    })

    return allNodes
  }, [searchTerm, selectedCategory])

  const handleNodeAdd = (nodeTemplate) => {
    addNode(nodeTemplate.type, null, nodeTemplate.label)
  }

  if (!isVisible) return null

  const panelStyle = {
    background: darkMode ? '#2a2a2a' : '#ffffff',
    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    borderRadius: '8px',
    width: '300px',
    maxHeight: '500px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }

  const headerStyle = {
    padding: '12px',
    borderBottom: `1px solid ${darkMode ? '#444' : '#eee'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: darkMode ? '#333' : '#f8f9fa',
  }

  const searchStyle = {
    padding: '8px',
    border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
    borderRadius: '4px',
    background: darkMode ? '#1a1a1a' : '#fff',
    color: darkMode ? '#fff' : '#333',
    width: '100%',
    fontSize: '14px',
  }

  const categoryStyle = {
    padding: '4px 8px',
    margin: '2px',
    border: 'none',
    borderRadius: '4px',
    background: darkMode ? '#444' : '#e9ecef',
    color: darkMode ? '#fff' : '#333',
    cursor: 'pointer',
    fontSize: '12px',
  }

  const activeCategoryStyle = {
    ...categoryStyle,
    background: darkMode ? '#0d7377' : '#007bff',
    color: '#fff',
  }

  const nodeItemStyle = {
    padding: '8px 12px',
    margin: '4px',
    borderRadius: '6px',
    background: darkMode ? '#333' : '#f8f9fa',
    border: `1px solid ${darkMode ? '#555' : '#dee2e6'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  return (
    <Panel position="top-right" style={panelStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>📚 Node Library</span>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: darkMode ? '#fff' : '#333',
          }}
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '12px' }}>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
      </div>

      {/* Category Filter */}
      <div style={{ padding: '0 12px 12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={selectedCategory === 'all' ? activeCategoryStyle : categoryStyle}
        >
          All
        </button>
        {Object.entries(nodeCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={selectedCategory === key ? activeCategoryStyle : categoryStyle}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Node List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
        {filteredNodes.map((node, index) => (
          <div
            key={`${node.category}-${index}`}
            style={nodeItemStyle}
            onClick={() => handleNodeAdd(node)}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? '#444' : '#e9ecef'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = darkMode ? '#333' : '#f8f9fa'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '18px' }}>{node.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{node.label}</div>
              <div
                style={{
                  fontSize: '12px',
                  color: darkMode ? '#aaa' : '#666',
                  marginTop: '2px',
                }}
              >
                {node.description}
              </div>
            </div>
          </div>
        ))}

        {filteredNodes.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              color: darkMode ? '#aaa' : '#666',
              fontSize: '14px',
            }}
          >
            No nodes found matching "{searchTerm}"
          </div>
        )}
      </div>
    </Panel>
  )
}

export default NodeLibrary
