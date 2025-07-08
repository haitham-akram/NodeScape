// API utility functions for making HTTP requests to the backend

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://your-domain.com/api' : 'http://localhost:3000/api'

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  console.log('🌐 Making API request:', {
    url,
    method: options.method || 'GET',
    hasBody: !!options.body,
  })

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    console.log('📡 API response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ API response data:', data)
    return data
  } catch (error) {
    console.error('💥 API request failed:', {
      url,
      error: error.message,
      stack: error.stack,
    })
    throw error
  }
}

// Maps API functions
export const mapsApi = {
  // Get all maps
  getAllMaps: async () => {
    return apiRequest('/maps')
  },

  // Get a specific map by ID
  getMap: async (id) => {
    return apiRequest(`/maps/${id}`)
  },

  // Create a new map
  createMap: async (mapData) => {
    return apiRequest('/maps', {
      method: 'POST',
      body: JSON.stringify(mapData),
    })
  },

  // Update an existing map
  updateMap: async (id, mapData) => {
    return apiRequest(`/maps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapData),
    })
  },

  // Delete a map
  deleteMap: async (id) => {
    return apiRequest(`/maps/${id}`, {
      method: 'DELETE',
    })
  },
}

// TODO: Add more API functions as needed
// Example: nodes API, edges API, user authentication, etc.

export default apiRequest
