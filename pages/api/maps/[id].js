// API Route: /api/maps/[id]
// Handles requests for a specific map (GET, PUT, DELETE)

import { getMapById, updateMap, deleteMap } from '../../../lib/database'

/**
 * Main handler for /api/maps/[id] endpoint
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default function handler(req, res) {
  const { method, query } = req
  const { id } = query

  // Validate ID parameter
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Map ID is required',
    })
  }

  try {
    switch (method) {
      case 'GET':
        handleGetMap(req, res, id)
        break

      case 'PUT':
        handleUpdateMap(req, res, id)
        break

      case 'DELETE':
        handleDeleteMap(req, res, id)
        break

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
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
 * Handle GET /api/maps/[id] - Fetch a specific map
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} id - Map ID
 */
const handleGetMap = (req, res, id) => {
  try {
    console.log('🔍 Looking for map with ID:', id, 'type:', typeof id)
    const map = getMapById(id) // Remove parseInt() - keep as string

    if (!map) {
      console.log('❌ Map not found for ID:', id)
      return res.status(404).json({
        success: false,
        error: 'Map not found',
      })
    }

    console.log('✅ Map found:', map.name)
    res.status(200).json({
      success: true,
      data: map,
    })
  } catch (error) {
    console.error('Error fetching map:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch map',
    })
  }
}

/**
 * Handle PUT /api/maps/[id] - Update a specific map
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} id - Map ID
 */
const handleUpdateMap = (req, res, id) => {
  try {
    const { name, description, nodes, edges } = req.body

    // Basic validation
    if (!name && !description && !nodes && !edges) {
      return res.status(400).json({
        success: false,
        error: 'At least one field (name, description, nodes, or edges) must be provided',
      })
    }

    // Prepare update data
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (nodes !== undefined) updateData.nodes = nodes
    if (edges !== undefined) updateData.edges = edges

    // Update the map
    const updatedMap = updateMap(id, updateData) // Remove parseInt()

    if (!updatedMap) {
      return res.status(404).json({
        success: false,
        error: 'Map not found',
      })
    }

    res.status(200).json({
      success: true,
      data: updatedMap,
    })
  } catch (error) {
    console.error('Error updating map:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update map',
    })
  }
}

/**
 * Handle DELETE /api/maps/[id] - Delete a specific map
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} id - Map ID
 */
const handleDeleteMap = (req, res, id) => {
  try {
    const success = deleteMap(id) // Remove parseInt()

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Map not found',
      })
    }

    res.status(200).json({
      success: true,
      message: `Map ${id} deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting map:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete map',
    })
  }
}
