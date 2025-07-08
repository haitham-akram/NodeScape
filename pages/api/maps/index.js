// API Route: /api/maps
// Handles requests for all maps (GET, POST)

import { getAllMaps, createMap } from '../../../lib/database'

/**
 * Main handler for /api/maps endpoint
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        handleGetMaps(req, res)
        break

      case 'POST':
        handleCreateMap(req, res)
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
        })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

/**
 * Handle GET /api/maps - Fetch all maps
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const handleGetMaps = (req, res) => {
  try {
    // Get query parameters for filtering/pagination
    const { userId, limit = 50, offset = 0 } = req.query

    // Fetch all maps from database
    let maps = getAllMaps()

    // Filter by userId if provided
    if (userId) {
      maps = maps.filter((map) => map.userId === userId)
    }

    // Apply pagination
    const startIndex = parseInt(offset)
    const limitNum = parseInt(limit)
    const totalMaps = maps.length
    maps = maps.slice(startIndex, startIndex + limitNum)

    // Return success response
    res.status(200).json({
      success: true,
      data: maps,
      pagination: {
        total: totalMaps,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < totalMaps,
      },
    })
  } catch (error) {
    console.error('Error fetching maps:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch maps',
    })
  }
}

/**
 * Handle POST /api/maps - Create a new map
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const handleCreateMap = (req, res) => {
  try {
    const { name, description, nodes, edges, userId } = req.body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Map name is required and must be a non-empty string',
      })
    }

    // Validate nodes array if provided
    if (nodes && !Array.isArray(nodes)) {
      return res.status(400).json({
        success: false,
        error: 'Nodes must be an array',
      })
    }

    // Validate edges array if provided
    if (edges && !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        error: 'Edges must be an array',
      })
    }

    // Create map data object
    const mapData = {
      name: name.trim(),
      description: description || '',
      nodes: nodes || [],
      edges: edges || [],
      userId: userId || null,
    }

    // Create map in database
    const newMap = createMap(mapData)

    if (!newMap) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create map',
      })
    }

    // Return success response
    res.status(201).json({
      success: true,
      data: newMap,
      message: 'Map created successfully',
    })
  } catch (error) {
    console.error('Error creating map:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create map',
    })
  }
}
