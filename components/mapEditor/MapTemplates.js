import React, { useState } from 'react'
import { Panel } from 'reactflow'

/**
 * Map Templates Component
 * Provides predefined map templates and presets
 */
const MapTemplates = ({ onLoadTemplate, darkMode = false, isVisible = true, onToggle }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Predefined map templates
  const templates = {
    workflow: {
      name: 'Workflow Templates',
      icon: '🔄',
      templates: [
        {
          id: 'simple-workflow',
          name: 'Simple Workflow',
          description: 'Basic linear workflow with input, process, and output',
          thumbnail: '📥➡️⚙️➡️📤',
          nodes: [
            {
              id: 'node-1',
              type: 'input',
              position: { x: 100, y: 100 },
              data: { label: 'Start' },
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 300, y: 100 },
              data: { label: 'Process' },
            },
            {
              id: 'node-3',
              type: 'output',
              position: { x: 500, y: 100 },
              data: { label: 'End' },
            },
          ],
          edges: [
            {
              id: 'edge-1-2',
              source: 'node-1',
              target: 'node-2',
              type: 'default',
            },
            {
              id: 'edge-2-3',
              source: 'node-2',
              target: 'node-3',
              type: 'default',
            },
          ],
        },
        {
          id: 'approval-workflow',
          name: 'Approval Workflow',
          description: 'Document approval process with decision points',
          thumbnail: '📄➡️❓➡️✅',
          nodes: [
            {
              id: 'node-1',
              type: 'input',
              position: { x: 100, y: 150 },
              data: { label: 'Submit Request' },
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 300, y: 150 },
              data: { label: 'Review' },
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 500, y: 100 },
              data: { label: 'Approve' },
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 500, y: 200 },
              data: { label: 'Reject' },
            },
            {
              id: 'node-5',
              type: 'output',
              position: { x: 700, y: 150 },
              data: { label: 'Complete' },
            },
          ],
          edges: [
            { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'default' },
            { id: 'edge-2-3', source: 'node-2', target: 'node-3', type: 'default' },
            { id: 'edge-2-4', source: 'node-2', target: 'node-4', type: 'default' },
            { id: 'edge-3-5', source: 'node-3', target: 'node-5', type: 'default' },
            { id: 'edge-4-5', source: 'node-4', target: 'node-5', type: 'default' },
          ],
        },
      ],
    },
    dataflow: {
      name: 'Data Processing',
      icon: '📊',
      templates: [
        {
          id: 'etl-pipeline',
          name: 'ETL Pipeline',
          description: 'Extract, Transform, Load data pipeline',
          thumbnail: '🗃️➡️🔄➡️💾',
          nodes: [
            {
              id: 'node-1',
              type: 'input',
              position: { x: 100, y: 150 },
              data: { label: 'Extract Data' },
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 300, y: 100 },
              data: { label: 'Validate' },
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 300, y: 200 },
              data: { label: 'Transform' },
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 500, y: 150 },
              data: { label: 'Aggregate' },
            },
            {
              id: 'node-5',
              type: 'output',
              position: { x: 700, y: 150 },
              data: { label: 'Load to DB' },
            },
          ],
          edges: [
            { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'default' },
            { id: 'edge-1-3', source: 'node-1', target: 'node-3', type: 'default' },
            { id: 'edge-2-4', source: 'node-2', target: 'node-4', type: 'default' },
            { id: 'edge-3-4', source: 'node-3', target: 'node-4', type: 'default' },
            { id: 'edge-4-5', source: 'node-4', target: 'node-5', type: 'default' },
          ],
        },
        {
          id: 'data-analysis',
          name: 'Data Analysis',
          description: 'Data analysis and visualization pipeline',
          thumbnail: '📈➡️🔍➡️📊',
          nodes: [
            {
              id: 'node-1',
              type: 'input',
              position: { x: 100, y: 200 },
              data: { label: 'Raw Data' },
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 300, y: 100 },
              data: { label: 'Clean Data' },
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 300, y: 200 },
              data: { label: 'Filter' },
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 300, y: 300 },
              data: { label: 'Normalize' },
            },
            {
              id: 'node-5',
              type: 'default',
              position: { x: 500, y: 150 },
              data: { label: 'Analyze' },
            },
            {
              id: 'node-6',
              type: 'default',
              position: { x: 500, y: 250 },
              data: { label: 'Correlate' },
            },
            {
              id: 'node-7',
              type: 'output',
              position: { x: 700, y: 200 },
              data: { label: 'Visualize' },
            },
          ],
          edges: [
            { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'default' },
            { id: 'edge-1-3', source: 'node-1', target: 'node-3', type: 'default' },
            { id: 'edge-1-4', source: 'node-1', target: 'node-4', type: 'default' },
            { id: 'edge-2-5', source: 'node-2', target: 'node-5', type: 'default' },
            { id: 'edge-3-5', source: 'node-3', target: 'node-5', type: 'default' },
            { id: 'edge-4-6', source: 'node-4', target: 'node-6', type: 'default' },
            { id: 'edge-5-7', source: 'node-5', target: 'node-7', type: 'default' },
            { id: 'edge-6-7', source: 'node-6', target: 'node-7', type: 'default' },
          ],
        },
      ],
    },
    architecture: {
      name: 'System Architecture',
      icon: '🏗️',
      templates: [
        {
          id: 'microservices',
          name: 'Microservices Architecture',
          description: 'Basic microservices setup with API gateway',
          thumbnail: '🌐➡️⚡➡️🔧',
          nodes: [
            {
              id: 'node-1',
              type: 'input',
              position: { x: 100, y: 200 },
              data: { label: 'Client' },
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 300, y: 200 },
              data: { label: 'API Gateway' },
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 500, y: 100 },
              data: { label: 'User Service' },
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 500, y: 200 },
              data: { label: 'Order Service' },
            },
            {
              id: 'node-5',
              type: 'default',
              position: { x: 500, y: 300 },
              data: { label: 'Payment Service' },
            },
            {
              id: 'node-6',
              type: 'output',
              position: { x: 700, y: 200 },
              data: { label: 'Database' },
            },
          ],
          edges: [
            { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'default' },
            { id: 'edge-2-3', source: 'node-2', target: 'node-3', type: 'default' },
            { id: 'edge-2-4', source: 'node-2', target: 'node-4', type: 'default' },
            { id: 'edge-2-5', source: 'node-2', target: 'node-5', type: 'default' },
            { id: 'edge-3-6', source: 'node-3', target: 'node-6', type: 'default' },
            { id: 'edge-4-6', source: 'node-4', target: 'node-6', type: 'default' },
            { id: 'edge-5-6', source: 'node-5', target: 'node-6', type: 'default' },
          ],
        },
      ],
    },
  }

  // Get filtered templates
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return Object.values(templates).flatMap((category) =>
        category.templates.map((template) => ({
          ...template,
          categoryName: category.name,
          categoryIcon: category.icon,
        }))
      )
    }

    const category = templates[selectedCategory]
    return category
      ? category.templates.map((template) => ({
          ...template,
          categoryName: category.name,
          categoryIcon: category.icon,
        }))
      : []
  }

  const handleTemplateLoad = (template) => {
    if (onLoadTemplate) {
      onLoadTemplate(template)
    }
  }

  if (!isVisible) return null

  const panelStyle = {
    background: darkMode ? '#2a2a2a' : '#ffffff',
    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    borderRadius: '8px',
    width: '350px',
    maxHeight: '600px',
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

  const templateStyle = {
    padding: '12px',
    margin: '8px',
    borderRadius: '8px',
    background: darkMode ? '#333' : '#f8f9fa',
    border: `1px solid ${darkMode ? '#555' : '#dee2e6'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  return (
    <Panel position="bottom-right" style={panelStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🎨 Templates</span>
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

      {/* Category Filter */}
      <div style={{ padding: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={selectedCategory === 'all' ? activeCategoryStyle : categoryStyle}
        >
          All
        </button>
        {Object.entries(templates).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={selectedCategory === key ? activeCategoryStyle : categoryStyle}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Template List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
        {getFilteredTemplates().map((template) => (
          <div
            key={template.id}
            style={templateStyle}
            onClick={() => handleTemplateLoad(template)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? '#444' : '#e9ecef'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = darkMode ? '#333' : '#f8f9fa'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}
            >
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{template.name}</h4>
              <span style={{ fontSize: '12px', color: darkMode ? '#aaa' : '#666' }}>{template.categoryIcon}</span>
            </div>

            <div
              style={{
                fontSize: '20px',
                textAlign: 'center',
                margin: '8px 0',
                padding: '8px',
                background: darkMode ? '#1a1a1a' : '#fff',
                borderRadius: '4px',
                border: `1px solid ${darkMode ? '#444' : '#eee'}`,
              }}
            >
              {template.thumbnail}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: darkMode ? '#aaa' : '#666',
                lineHeight: '1.4',
              }}
            >
              {template.description}
            </p>

            <div
              style={{
                marginTop: '8px',
                fontSize: '11px',
                color: darkMode ? '#888' : '#999',
              }}
            >
              {template.nodes.length} nodes • {template.edges.length} connections
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export default MapTemplates
