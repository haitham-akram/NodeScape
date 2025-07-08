// Simple in-memory database with file persistence
// This provides a lightweight solution for storing maps

import fs from 'fs'
import path from 'path'

// Database file path
const DB_FILE = path.join(process.cwd(), 'data', 'maps.json')

// Mock user ID for development (replace with real auth later)
export const MOCK_USER_ID = 'user-123'

// In-memory cache for better performance
let mapsCache = null

/**
 * Initialize database - create data directory and file if they don't exist
 */
const initializeDB = () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DB_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Create maps file if it doesn't exist
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ maps: [], lastId: 0 }), 'utf8')
    }
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

/**
 * Load maps from file into memory cache
 * @returns {Object} Database object with maps array and lastId
 */
const loadMapsFromFile = () => {
  try {
    initializeDB()
    const data = fs.readFileSync(DB_FILE, 'utf8')
    mapsCache = JSON.parse(data)
    return mapsCache
  } catch (error) {
    console.error('Failed to load maps from file:', error)
    // Return empty database structure on error
    mapsCache = { maps: [], lastId: 0 }
    return mapsCache
  }
}

/**
 * Save maps to file from memory cache
 * @returns {boolean} Success status
 */
const saveMapsToFile = () => {
  try {
    if (!mapsCache) return false
    fs.writeFileSync(DB_FILE, JSON.stringify(mapsCache, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Failed to save maps to file:', error)
    return false
  }
}

/**
 * Get all maps from database
 * @returns {Array} Array of map objects
 */
export const getAllMaps = () => {
  if (!mapsCache) {
    loadMapsFromFile()
  }
  return mapsCache.maps || []
}

/**
 * Get a specific map by ID
 * @param {string} id - Map ID to find
 * @returns {Object|null} Map object or null if not found
 */
export const getMapById = (id) => {
  const maps = getAllMaps()
  return maps.find((map) => map.id === id) || null
}

/**
 * Create a new map
 * @param {Object} mapData - Map data object
 * @param {string} mapData.name - Map name (required)
 * @param {string} mapData.description - Map description (optional)
 * @param {Array} mapData.nodes - Array of nodes (optional)
 * @param {Array} mapData.edges - Array of edges (optional)
 * @param {string} mapData.userId - User ID (optional)
 * @returns {Object|null} Created map object or null on error
 */
export const createMap = (mapData) => {
  try {
    if (!mapsCache) {
      loadMapsFromFile()
    }

    // Validate required fields
    if (!mapData.name || typeof mapData.name !== 'string') {
      throw new Error('Map name is required and must be a string')
    }

    // Generate new ID
    const newId = (++mapsCache.lastId).toString()
    const timestamp = new Date().toISOString()

    // Create map object
    const newMap = {
      id: newId,
      name: mapData.name.trim(),
      description: mapData.description || '',
      nodes: Array.isArray(mapData.nodes) ? mapData.nodes : [],
      edges: Array.isArray(mapData.edges) ? mapData.edges : [],
      userId: mapData.userId || MOCK_USER_ID,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    // Validate nodes and edges structure
    newMap.nodes = newMap.nodes.filter(
      (node) => node && typeof node === 'object' && node.id && node.position && node.data
    )
    newMap.edges = newMap.edges.filter(
      (edge) => edge && typeof edge === 'object' && edge.id && edge.source && edge.target
    )

    // Add to cache and save
    mapsCache.maps.push(newMap)

    if (saveMapsToFile()) {
      return newMap
    } else {
      // Rollback on save failure
      mapsCache.maps.pop()
      mapsCache.lastId--
      return null
    }
  } catch (error) {
    console.error('Failed to create map:', error)
    return null
  }
}

/**
 * Update an existing map
 * @param {string} id - Map ID to update
 * @param {Object} updateData - Data to update
 * @returns {Object|null} Updated map object or null on error
 */
export const updateMap = (id, updateData) => {
  try {
    const maps = getAllMaps()
    const mapIndex = maps.findIndex((map) => map.id === id)

    if (mapIndex === -1) {
      return null // Map not found
    }

    const existingMap = maps[mapIndex]
    const timestamp = new Date().toISOString()

    // Update map with provided data
    const updatedMap = {
      ...existingMap,
      name: updateData.name?.trim() || existingMap.name,
      description: updateData.description !== undefined ? updateData.description : existingMap.description,
      nodes: Array.isArray(updateData.nodes) ? updateData.nodes : existingMap.nodes,
      edges: Array.isArray(updateData.edges) ? updateData.edges : existingMap.edges,
      userId: updateData.userId !== undefined ? updateData.userId : existingMap.userId,
      updatedAt: timestamp,
    }

    // Validate nodes and edges structure
    updatedMap.nodes = updatedMap.nodes.filter(
      (node) => node && typeof node === 'object' && node.id && node.position && node.data
    )
    updatedMap.edges = updatedMap.edges.filter(
      (edge) => edge && typeof edge === 'object' && edge.id && edge.source && edge.target
    )

    // Update in cache and save
    mapsCache.maps[mapIndex] = updatedMap

    if (saveMapsToFile()) {
      return updatedMap
    } else {
      // Rollback on save failure
      mapsCache.maps[mapIndex] = existingMap
      return null
    }
  } catch (error) {
    console.error('Failed to update map:', error)
    return null
  }
}

/**
 * Delete a map by ID
 * @param {string} id - Map ID to delete
 * @returns {boolean} Success status
 */
export const deleteMap = (id) => {
  try {
    const maps = getAllMaps()
    const mapIndex = maps.findIndex((map) => map.id === id)

    if (mapIndex === -1) {
      return false // Map not found
    }

    // Remove from cache
    const deletedMap = mapsCache.maps.splice(mapIndex, 1)[0]

    if (saveMapsToFile()) {
      return true
    } else {
      // Rollback on save failure
      mapsCache.maps.splice(mapIndex, 0, deletedMap)
      return false
    }
  } catch (error) {
    console.error('Failed to delete map:', error)
    return false
  }
}

/**
 * Get database statistics
 * @returns {Object} Database stats
 */
export const getDbStats = () => {
  const maps = getAllMaps()
  return {
    totalMaps: maps.length,
    lastId: mapsCache?.lastId || 0,
    dbFile: DB_FILE,
    cacheLoaded: mapsCache !== null,
  }
}

/**
 * Get current user ID (mock implementation)
 * In a real application, this would extract the user ID from the session/token
 * @returns {string} Current user ID
 */
export const getCurrentUserId = () => {
  return MOCK_USER_ID
}

// Initialize on module load
initializeDB()
