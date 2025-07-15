import React, { useState } from 'react'
import { Panel } from 'reactflow'
import { useTheme } from '../../contexts/AdvancedThemeContext'

/**
 * Advanced Theme Controls Component
 * Provides comprehensive theming options with custom theme creation
 */
const AdvancedThemeControls = ({ selectedEdgeType, setSelectedEdgeType, onClose }) => {
  const { currentTheme, themes, setTheme, createCustomTheme, deleteCustomTheme, theme, isDarkMode } = useTheme()
  const [showCustomThemeCreator, setShowCustomThemeCreator] = useState(false)
  const [customThemeName, setCustomThemeName] = useState('')
  const [customColors, setCustomColors] = useState({
    background: '#f5f5f5',
    surface: '#ffffff',
    primary: '#2196F3',
    secondary: '#4CAF50',
    text: '#333333',
    border: '#e0e0e0',
  })

  const handleThemeChange = (themeName) => {
    setTheme(themeName)
  }

  const handleCreateCustomTheme = () => {
    if (!customThemeName.trim()) return

    const newTheme = {
      name: customThemeName,
      colors: {
        ...customColors,
        surfaceSecondary: customColors.surface,
        primaryVariant: customColors.primary,
        secondaryVariant: customColors.secondary,
        accent: customColors.secondary,
        error: '#f44336',
        warning: '#ff9800',
        success: '#4caf50',
        info: '#2196f3',
        textSecondary: customColors.text,
        textMuted: '#999999',
        borderLight: customColors.border,
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
      nodes: {
        default: { background: customColors.surface, border: customColors.border, text: customColors.text },
        input: { background: customColors.primary + '20', border: customColors.primary, text: customColors.text },
        output: { background: customColors.secondary + '20', border: customColors.secondary, text: customColors.text },
        process: { background: customColors.surface, border: customColors.border, text: customColors.text },
        decision: { background: '#fff3e0', border: '#ffcc80', text: customColors.text },
      },
      edges: {
        default: { stroke: customColors.border, strokeSelected: customColors.primary },
        success: { stroke: customColors.secondary, strokeSelected: customColors.secondary },
        error: { stroke: '#f44336', strokeSelected: '#d32f2f' },
        warning: { stroke: '#ff9800', strokeSelected: '#f57c00' },
      },
    }

    createCustomTheme(customThemeName, newTheme)
    setCustomThemeName('')
    setShowCustomThemeCreator(false)
  }

  const containerStyle = {
    width: '350px',
    maxHeight: '600px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    boxShadow: `0 8px 32px ${theme.colors.shadow}`,
    color: theme.colors.text,
    overflow: 'hidden',
  }

  const headerStyle = {
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.colors.surfaceSecondary,
  }

  const sectionStyle = {
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.colors.borderLight}`,
  }

  const themeButtonStyle = (themeName) => ({
    width: '100%',
    padding: '12px 16px',
    margin: '4px 0',
    border: currentTheme === themeName ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    background: currentTheme === themeName ? theme.colors.primary + '10' : theme.colors.surface,
    color: theme.colors.text,
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  })

  const ThemePreview = ({ themeData }) => {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: themeData.colors.primary,
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: themeData.colors.secondary,
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: themeData.colors.background,
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        />
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    background: theme.colors.surface,
    color: theme.colors.text,
    fontSize: '14px',
    marginBottom: '8px',
  }

  const colorInputStyle = {
    width: '40px',
    height: '30px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
  }

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    background: theme.colors.primary,
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '4px',
  }

  return (
    <Panel position="top-right" style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>🎨 Advanced Themes</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: theme.colors.textSecondary,
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {/* Built-in Themes */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: theme.colors.textSecondary }}>
            Built-in Themes ({Object.entries(themes).filter(([_, themeData]) => !themeData.custom).length})
          </h4>
          {Object.entries(themes)
            .filter(([_, themeData]) => !themeData.custom)
            .map(([key, themeData]) => (
              <button key={key} onClick={() => handleThemeChange(key)} style={themeButtonStyle(key)}>
                <span>{themeData.name}</span>
                <ThemePreview themeData={themeData} />
              </button>
            ))}
        </div>

        {/* Custom Themes */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: theme.colors.textSecondary }}>
            Custom Themes ({Object.entries(themes).filter(([_, themeData]) => themeData.custom).length})
          </h4>
          {Object.entries(themes).filter(([_, themeData]) => themeData.custom).length === 0 ? (
            <p
              style={{
                fontSize: '14px',
                color: theme.colors.textMuted,
                fontStyle: 'italic',
                margin: '8px 0',
              }}
            >
              No custom themes yet. Create one below!
            </p>
          ) : (
            Object.entries(themes)
              .filter(([_, themeData]) => themeData.custom)
              .map(([key, themeData]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                  <button
                    onClick={() => handleThemeChange(key)}
                    style={{ ...themeButtonStyle(key), flex: 1, marginRight: '8px' }}
                  >
                    <span>{themeData.name}</span>
                    <ThemePreview themeData={themeData} />
                  </button>
                  <button
                    onClick={() => deleteCustomTheme(key)}
                    style={{
                      padding: '4px 8px',
                      border: 'none',
                      borderRadius: '4px',
                      background: theme.colors.error,
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
          )}

          {/* Create Custom Theme */}
          {!showCustomThemeCreator ? (
            <button
              onClick={() => setShowCustomThemeCreator(true)}
              style={{
                ...buttonStyle,
                width: '100%',
                background: theme.colors.secondary,
                marginTop: '12px',
              }}
            >
              + Create Custom Theme
            </button>
          ) : (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: theme.colors.surfaceSecondary,
                borderRadius: '8px',
              }}
            >
              <input
                type="text"
                placeholder="Theme name"
                value={customThemeName}
                onChange={(e) => setCustomThemeName(e.target.value)}
                style={inputStyle}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px' }}>Background</label>
                <input
                  type="color"
                  value={customColors.background}
                  onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                  style={colorInputStyle}
                />

                <label style={{ fontSize: '12px' }}>Surface</label>
                <input
                  type="color"
                  value={customColors.surface}
                  onChange={(e) => setCustomColors({ ...customColors, surface: e.target.value })}
                  style={colorInputStyle}
                />

                <label style={{ fontSize: '12px' }}>Primary</label>
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                  style={colorInputStyle}
                />

                <label style={{ fontSize: '12px' }}>Secondary</label>
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                  style={colorInputStyle}
                />

                <label style={{ fontSize: '12px' }}>Text</label>
                <input
                  type="color"
                  value={customColors.text}
                  onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                  style={colorInputStyle}
                />

                <label style={{ fontSize: '12px' }}>Border</label>
                <input
                  type="color"
                  value={customColors.border}
                  onChange={(e) => setCustomColors({ ...customColors, border: e.target.value })}
                  style={colorInputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={handleCreateCustomTheme} style={buttonStyle}>
                  Create
                </button>
                <button
                  onClick={() => setShowCustomThemeCreator(false)}
                  style={{ ...buttonStyle, background: theme.colors.textMuted }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Import/Export */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: theme.colors.textSecondary }}>Share Themes</h4>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              onClick={() => {
                const themeData = JSON.stringify(themes[currentTheme], null, 2)
                navigator.clipboard.writeText(themeData)
                alert('Current theme copied to clipboard!')
              }}
              style={{
                ...buttonStyle,
                flex: 1,
                background: theme.colors.info,
                fontSize: '12px',
              }}
            >
              📋 Copy Current Theme
            </button>
            <button
              onClick={() => {
                const allCustomThemes = Object.fromEntries(
                  Object.entries(themes).filter(([_, themeData]) => themeData.custom)
                )
                const customThemesData = JSON.stringify(allCustomThemes, null, 2)
                navigator.clipboard.writeText(customThemesData)
                alert('All custom themes copied to clipboard!')
              }}
              style={{
                ...buttonStyle,
                flex: 1,
                background: theme.colors.secondary,
                fontSize: '12px',
              }}
            >
              📦 Export Custom Themes
            </button>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: theme.colors.textMuted,
              fontStyle: 'italic',
              padding: '8px',
              background: theme.colors.surfaceSecondary,
              borderRadius: '4px',
            }}
          >
            💡 Copy themes to share with others. Paste theme JSON into a new custom theme to import.
          </div>
        </div>

        {/* Edge Types */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: theme.colors.textSecondary }}>Edge Style</h4>
          <select
            value={selectedEdgeType}
            onChange={(e) => setSelectedEdgeType(e.target.value)}
            style={{
              ...inputStyle,
              marginBottom: 0,
            }}
          >
            <option value="default">Default (Curved)</option>
            <option value="straight">Straight Lines</option>
            <option value="step">Step Lines</option>
            <option value="smoothstep">Smooth Step</option>
            <option value="simplebezier">Bezier Curves</option>
          </select>
        </div>
      </div>
    </Panel>
  )
}

export default AdvancedThemeControls
