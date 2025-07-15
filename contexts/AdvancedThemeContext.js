import React, { createContext, useContext, useState, useEffect } from 'react'

// Default themes
const lightTheme = {
  name: 'Light',
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceSecondary: '#f8f9fa',
    primary: '#2196F3',
    primaryVariant: '#1976d2',
    secondary: '#4CAF50',
    secondaryVariant: '#388e3c',
    accent: '#ff9800',
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  nodes: {
    default: { background: '#ffffff', border: '#e0e0e0', text: '#333333' },
    input: { background: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
    output: { background: '#ffebee', border: '#ef9a9a', text: '#c62828' },
    process: { background: '#e3f2fd', border: '#90caf9', text: '#1976d2' },
    decision: { background: '#fff3e0', border: '#ffcc80', text: '#f57c00' },
  },
  edges: {
    default: { stroke: '#999999', strokeSelected: '#2196F3' },
    success: { stroke: '#4caf50', strokeSelected: '#388e3c' },
    error: { stroke: '#f44336', strokeSelected: '#d32f2f' },
    warning: { stroke: '#ff9800', strokeSelected: '#f57c00' },
  },
}

const darkTheme = {
  name: 'Dark',
  colors: {
    background: '#1a1a1a',
    surface: '#2d2d2d',
    surfaceSecondary: '#333333',
    primary: '#90caf9',
    primaryVariant: '#64b5f6',
    secondary: '#81c784',
    secondaryVariant: '#66bb6a',
    accent: '#ffb74d',
    error: '#ef5350',
    warning: '#ffb74d',
    success: '#66bb6a',
    info: '#64b5f6',
    text: '#e0e0e0',
    textSecondary: '#cccccc',
    textMuted: '#999999',
    border: '#555555',
    borderLight: '#444444',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  nodes: {
    default: { background: '#2d2d2d', border: '#555555', text: '#e0e0e0' },
    input: { background: '#2e7d32', border: '#4caf50', text: '#ffffff' },
    output: { background: '#c62828', border: '#f44336', text: '#ffffff' },
    process: { background: '#1976d2', border: '#2196f3', text: '#ffffff' },
    decision: { background: '#f57c00', border: '#ff9800', text: '#ffffff' },
  },
  edges: {
    default: { stroke: '#888888', strokeSelected: '#90caf9' },
    success: { stroke: '#66bb6a', strokeSelected: '#4caf50' },
    error: { stroke: '#ef5350', strokeSelected: '#f44336' },
    warning: { stroke: '#ffb74d', strokeSelected: '#ff9800' },
  },
}

const blueTheme = {
  name: 'Ocean Blue',
  colors: {
    background: '#f0f8ff',
    surface: '#ffffff',
    surfaceSecondary: '#f8fbff',
    primary: '#0d47a1',
    primaryVariant: '#1565c0',
    secondary: '#01579b',
    secondaryVariant: '#0277bd',
    accent: '#00acc1',
    error: '#d32f2f',
    warning: '#f57c00',
    success: '#388e3c',
    info: '#1976d2',
    text: '#1a237e',
    textSecondary: '#3f51b5',
    textMuted: '#7986cb',
    border: '#c5cae9',
    borderLight: '#e8eaf6',
    shadow: 'rgba(13, 71, 161, 0.15)',
    overlay: 'rgba(13, 71, 161, 0.5)',
  },
  nodes: {
    default: { background: '#ffffff', border: '#c5cae9', text: '#1a237e' },
    input: { background: '#e8f4fd', border: '#90caf9', text: '#0d47a1' },
    output: { background: '#e1f5fe', border: '#4fc3f7', text: '#01579b' },
    process: { background: '#e3f2fd', border: '#64b5f6', text: '#1565c0' },
    decision: { background: '#f1f8e9', border: '#aed581', text: '#33691e' },
  },
  edges: {
    default: { stroke: '#7986cb', strokeSelected: '#3f51b5' },
    success: { stroke: '#66bb6a', strokeSelected: '#4caf50' },
    error: { stroke: '#ef5350', strokeSelected: '#f44336' },
    warning: { stroke: '#ffb74d', strokeSelected: '#ff9800' },
  },
}

const greenTheme = {
  name: 'Forest Green',
  colors: {
    background: '#f1f8e9',
    surface: '#ffffff',
    surfaceSecondary: '#f9fbe7',
    primary: '#2e7d32',
    primaryVariant: '#388e3c',
    secondary: '#558b2f',
    secondaryVariant: '#689f38',
    accent: '#8bc34a',
    error: '#d32f2f',
    warning: '#f57c00',
    success: '#4caf50',
    info: '#2196f3',
    text: '#1b5e20',
    textSecondary: '#2e7d32',
    textMuted: '#66bb6a',
    border: '#c8e6c9',
    borderLight: '#e8f5e8',
    shadow: 'rgba(46, 125, 50, 0.15)',
    overlay: 'rgba(46, 125, 50, 0.5)',
  },
  nodes: {
    default: { background: '#ffffff', border: '#c8e6c9', text: '#1b5e20' },
    input: { background: '#e8f5e8', border: '#a5d6a7', text: '#2e7d32' },
    output: { background: '#fff3e0', border: '#ffcc80', text: '#ef6c00' },
    process: { background: '#f3e5f5', border: '#ce93d8', text: '#7b1fa2' },
    decision: { background: '#fff8e1', border: '#fff176', text: '#f57f17' },
  },
  edges: {
    default: { stroke: '#66bb6a', strokeSelected: '#4caf50' },
    success: { stroke: '#4caf50', strokeSelected: '#388e3c' },
    error: { stroke: '#ef5350', strokeSelected: '#f44336' },
    warning: { stroke: '#ffb74d', strokeSelected: '#ff9800' },
  },
}

const purpleTheme = {
  name: 'Royal Purple',
  colors: {
    background: '#faf5ff',
    surface: '#ffffff',
    surfaceSecondary: '#f8f5ff',
    primary: '#7b1fa2',
    primaryVariant: '#8e24aa',
    secondary: '#512da8',
    secondaryVariant: '#5e35b1',
    accent: '#9c27b0',
    error: '#d32f2f',
    warning: '#f57c00',
    success: '#388e3c',
    info: '#2196f3',
    text: '#4a148c',
    textSecondary: '#6a1b9a',
    textMuted: '#ab47bc',
    border: '#e1bee7',
    borderLight: '#f3e5f5',
    shadow: 'rgba(123, 31, 162, 0.15)',
    overlay: 'rgba(123, 31, 162, 0.5)',
  },
  nodes: {
    default: { background: '#ffffff', border: '#e1bee7', text: '#4a148c' },
    input: { background: '#f3e5f5', border: '#ce93d8', text: '#7b1fa2' },
    output: { background: '#ede7f6', border: '#b39ddb', text: '#512da8' },
    process: { background: '#e8eaf6', border: '#9fa8da', text: '#303f9f' },
    decision: { background: '#fff3e0', border: '#ffcc80', text: '#ef6c00' },
  },
  edges: {
    default: { stroke: '#ab47bc', strokeSelected: '#9c27b0' },
    success: { stroke: '#66bb6a', strokeSelected: '#4caf50' },
    error: { stroke: '#ef5350', strokeSelected: '#f44336' },
    warning: { stroke: '#ffb74d', strokeSelected: '#ff9800' },
  },
}

const sunsetTheme = {
  name: 'Sunset Orange',
  colors: {
    background: '#fff8f0',
    surface: '#ffffff',
    surfaceSecondary: '#fffaf5',
    primary: '#ff6f00',
    primaryVariant: '#ff8f00',
    secondary: '#ff5722',
    secondaryVariant: '#ff7043',
    accent: '#ffab40',
    error: '#d32f2f',
    warning: '#f57c00',
    success: '#388e3c',
    info: '#2196f3',
    text: '#bf360c',
    textSecondary: '#d84315',
    textMuted: '#ff8a65',
    border: '#ffccbc',
    borderLight: '#ffe0cc',
    shadow: 'rgba(255, 111, 0, 0.15)',
    overlay: 'rgba(255, 111, 0, 0.5)',
  },
  nodes: {
    default: { background: '#ffffff', border: '#ffccbc', text: '#bf360c' },
    input: { background: '#fff3e0', border: '#ffcc80', text: '#ef6c00' },
    output: { background: '#ffebee', border: '#ef9a9a', text: '#c62828' },
    process: { background: '#fce4ec', border: '#f8bbd9', text: '#ad1457' },
    decision: { background: '#f3e5f5', border: '#ce93d8', text: '#7b1fa2' },
  },
  edges: {
    default: { stroke: '#ff8a65', strokeSelected: '#ff6f00' },
    success: { stroke: '#66bb6a', strokeSelected: '#4caf50' },
    error: { stroke: '#ef5350', strokeSelected: '#f44336' },
    warning: { stroke: '#ffb74d', strokeSelected: '#ff9800' },
  },
}

const midnightTheme = {
  name: 'Midnight Blue',
  colors: {
    background: '#0a0e1a',
    surface: '#1a1f2e',
    surfaceSecondary: '#252a3a',
    primary: '#4fc3f7',
    primaryVariant: '#29b6f6',
    secondary: '#7986cb',
    secondaryVariant: '#5c6bc0',
    accent: '#ab47bc',
    error: '#ef5350',
    warning: '#ffb74d',
    success: '#66bb6a',
    info: '#42a5f5',
    text: '#e3f2fd',
    textSecondary: '#bbdefb',
    textMuted: '#90caf9',
    border: '#37474f',
    borderLight: '#455a64',
    shadow: 'rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  nodes: {
    default: { background: '#263238', border: '#455a64', text: '#e3f2fd' },
    input: { background: '#1a237e', border: '#3f51b5', text: '#ffffff' },
    output: { background: '#4a148c', border: '#7b1fa2', text: '#ffffff' },
    process: { background: '#01579b', border: '#0288d1', text: '#ffffff' },
    decision: { background: '#e65100', border: '#ff9800', text: '#ffffff' },
  },
  edges: {
    default: { stroke: '#607d8b', strokeSelected: '#4fc3f7' },
    success: { stroke: '#66bb6a', strokeSelected: '#4caf50' },
    error: { stroke: '#ef5350', strokeSelected: '#f44336' },
    warning: { stroke: '#ffb74d', strokeSelected: '#ff9800' },
  },
}

const cyberpunkTheme = {
  name: 'Cyberpunk',
  colors: {
    background: '#0d0208',
    surface: '#1a0b13',
    surfaceSecondary: '#2d1b26',
    primary: '#00ff9f',
    primaryVariant: '#00e676',
    secondary: '#ff0080',
    secondaryVariant: '#e91e63',
    accent: '#00d4ff',
    error: '#ff073a',
    warning: '#ffaa00',
    success: '#00ff9f',
    info: '#00d4ff',
    text: '#ffffff',
    textSecondary: '#b0bec5',
    textMuted: '#78909c',
    border: '#7c4dff',
    borderLight: '#9575cd',
    shadow: 'rgba(0, 255, 159, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.9)',
  },
  nodes: {
    default: { background: '#1a0b13', border: '#7c4dff', text: '#ffffff' },
    input: { background: '#1b5e20', border: '#00ff9f', text: '#ffffff' },
    output: { background: '#4a0e4e', border: '#ff0080', text: '#ffffff' },
    process: { background: '#0d47a1', border: '#00d4ff', text: '#ffffff' },
    decision: { background: '#e65100', border: '#ffaa00', text: '#ffffff' },
  },
  edges: {
    default: { stroke: '#7c4dff', strokeSelected: '#00ff9f' },
    success: { stroke: '#00ff9f', strokeSelected: '#00e676' },
    error: { stroke: '#ff073a', strokeSelected: '#d32f2f' },
    warning: { stroke: '#ffaa00', strokeSelected: '#ff9800' },
  },
}

const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  sunset: sunsetTheme,
  midnight: midnightTheme,
  cyberpunk: cyberpunkTheme,
}

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [customThemes, setCustomThemes] = useState({})

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('nodescape-theme')
    const savedCustomThemes = localStorage.getItem('nodescape-custom-themes')

    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }

    if (savedCustomThemes) {
      try {
        setCustomThemes(JSON.parse(savedCustomThemes))
      } catch (e) {
        console.warn('Failed to parse custom themes from localStorage')
      }
    }
  }, [])

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('nodescape-theme', currentTheme)
  }, [currentTheme])

  // Save custom themes to localStorage when changed
  useEffect(() => {
    localStorage.setItem('nodescape-custom-themes', JSON.stringify(customThemes))
  }, [customThemes])

  const getAllThemes = () => ({ ...themes, ...customThemes })

  const getTheme = (themeName = currentTheme) => {
    const allThemes = getAllThemes()
    return allThemes[themeName] || themes.light
  }

  const setTheme = (themeName) => {
    const allThemes = getAllThemes()
    if (allThemes[themeName]) {
      setCurrentTheme(themeName)
    }
  }

  const createCustomTheme = (name, themeData) => {
    const newCustomThemes = {
      ...customThemes,
      [name]: { ...themeData, name, custom: true },
    }
    setCustomThemes(newCustomThemes)
    return name
  }

  const deleteCustomTheme = (name) => {
    const newCustomThemes = { ...customThemes }
    delete newCustomThemes[name]
    setCustomThemes(newCustomThemes)

    // Switch to light theme if current theme was deleted
    if (currentTheme === name) {
      setCurrentTheme('light')
    }
  }

  const isDarkMode = () => {
    const theme = getTheme()
    return theme.name === 'Dark' || theme.colors.background === '#1a1a1a'
  }

  const value = {
    currentTheme,
    theme: getTheme(),
    themes: getAllThemes(),
    setTheme,
    createCustomTheme,
    deleteCustomTheme,
    isDarkMode: isDarkMode(),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
