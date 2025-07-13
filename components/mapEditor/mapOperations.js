import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { getRectOfNodes, getTransformForBounds } from 'reactflow'
import { mapsApi } from '../../lib/api'

/**
 * Map Operations
 * Handles saving, loading, exporting, and importing maps
 */
const useMapOperations = (props) => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    fitView,
    calculateNextNodeCounter,
    setNodeCounter,
    setSelectedNodes,
    setSelectedEdges,
  } = props

  // Map persistence state
  const [currentMapId, setCurrentMapId] = useState(null)
  const [currentMapName, setCurrentMapName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadMapId, setLoadMapId] = useState('')
  const [availableMaps, setAvailableMaps] = useState([])
  const [mapModifiedAfterLoad, setMapModifiedAfterLoad] = useState(false)

  /**
   * Fetch all available maps from the API
   */
  const fetchAvailableMaps = useCallback(async () => {
    try {
      console.log('📋 Fetching available maps...')
      const response = await mapsApi.getAllMaps()
      const maps = response.data || []
      setAvailableMaps(maps)
      console.log('✅ Available maps loaded:', maps.length)
    } catch (error) {
      console.error('❌ Error fetching maps:', error)
      setAvailableMaps([])
    }
  }, [])

  /**
   * Save the current map to the backend
   * Handles both new maps and updates to existing maps
   */
  const saveMap = useCallback(async () => {
    console.log('🔄 Starting save process...')

    if (!currentMapName.trim()) {
      alert('Please enter a map name before saving')
      return
    }

    console.log('📋 Current state:', {
      mapName: currentMapName,
      mapId: currentMapId,
      nodesCount: nodes.length,
      edgesCount: edges.length,
    })

    setIsLoading(true)
    try {
      const mapData = {
        name: currentMapName,
        description: `Map with ${nodes.length} nodes and ${edges.length} edges`,
        nodes: nodes,
        edges: edges,
      }

      console.log('📦 Map data prepared:', mapData)

      let response
      if (currentMapId && mapModifiedAfterLoad) {
        // Ask user what they want to do with the modified loaded map
        const userChoice = confirm(
          `You've loaded and modified an existing map "${currentMapName}".\n\n` +
            `Click OK to UPDATE the original map.\n` +
            `Click Cancel to SAVE AS A NEW map.`
        )

        if (userChoice) {
          // Update existing map
          console.log('🔄 Updating existing map with ID:', currentMapId)
          response = await mapsApi.updateMap(currentMapId, mapData)
          console.log('✅ Map updated successfully:', response)
        } else {
          // Save as new map
          console.log('➕ Creating new map from modified existing map...')
          response = await mapsApi.createMap(mapData)
          console.log('✅ New map created successfully:', response)
          setCurrentMapId(response.data.id)
        }
        setMapModifiedAfterLoad(false) // Reset modification flag
      } else if (currentMapId) {
        // Update existing map (no modifications detected)
        console.log('🔄 Updating existing map with ID:', currentMapId)
        response = await mapsApi.updateMap(currentMapId, mapData)
        console.log('✅ Map updated successfully:', response)
      } else {
        // Create new map
        console.log('➕ Creating new map...')
        response = await mapsApi.createMap(mapData)
        console.log('✅ Map created successfully:', response)
        setCurrentMapId(response.data.id)
      }

      alert(`Map "${currentMapName}" saved successfully!`)

      // Refresh the available maps list
      fetchAvailableMaps()
    } catch (error) {
      console.error('❌ Error saving map:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        mapId: currentMapId,
      })
      alert(`Failed to save map "${currentMapName}". Error: ${error.message}. Check console for details.`)
    } finally {
      setIsLoading(false)
    }
  }, [currentMapId, currentMapName, nodes, edges, mapModifiedAfterLoad, fetchAvailableMaps])

  /**
   * Load a map by ID
   * @param {string} mapId - ID of the map to load
   */
  const loadMapById = useCallback(
    async (mapId) => {
      if (!mapId) {
        alert('Please select a map to load')
        return
      }

      setIsLoading(true)
      try {
        console.log('🔄 Loading map with ID:', mapId)
        const response = await mapsApi.getMap(mapId)
        const mapData = response.data

        // Replace current graph with loaded data
        setNodes(mapData.nodes || [])
        setEdges(mapData.edges || [])
        setCurrentMapId(mapData.id)
        setCurrentMapName(mapData.name)
        setMapModifiedAfterLoad(false) // Reset modification flag

        // Update node counter to prevent ID conflicts
        const nextCounter = calculateNextNodeCounter(mapData.nodes || [])
        setNodeCounter(nextCounter)

        // Clear selection
        setSelectedNodes([])
        setSelectedEdges([])

        // Fit view to show all loaded content
        setTimeout(() => fitView(), 100)

        alert(`Map "${mapData.name}" loaded successfully!`)
        console.log('✅ Map loaded successfully:', mapData.name)
      } catch (error) {
        console.error('❌ Error loading map:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          mapId: mapId,
        })
        alert(`Failed to load map with ID "${mapId}". Error: ${error.message}. Check console for details.`)
      } finally {
        setIsLoading(false)
      }
    },
    [setNodes, setEdges, fitView, calculateNextNodeCounter, setNodeCounter, setSelectedNodes, setSelectedEdges]
  )

  /**
   * Delete current map from server
   * Clears the graph after successful deletion
   */
  const deleteMap = useCallback(async () => {
    if (!currentMapId) {
      alert('No map is currently loaded to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete the map "${currentMapName}"? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      await mapsApi.deleteMap(currentMapId)

      // Clear current map state
      setNodes([])
      setEdges([])
      setCurrentMapId(null)
      setCurrentMapName('')
      setSelectedNodes([])
      setSelectedEdges([])
      setMapModifiedAfterLoad(false) // Reset modification flag

      alert(`Map "${currentMapName}" deleted successfully!`)
      console.log('✅ Map deleted successfully:', currentMapName)

      // Refresh the available maps list
      fetchAvailableMaps()
    } catch (error) {
      console.error('❌ Error deleting map:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        mapId: currentMapId,
      })
      alert(`Failed to delete map "${currentMapName}". Error: ${error.message}. Check console for details.`)
    } finally {
      setIsLoading(false)
    }
  }, [currentMapId, currentMapName, setNodes, setEdges, setSelectedNodes, setSelectedEdges, fetchAvailableMaps])

  /**
   * Export the current graph as a PNG image
   * Uses html2canvas to create a screenshot of the graph
   */
  const exportToPNG = useCallback(() => {
    console.log('📸 Exporting graph as PNG')
    const reactFlowNode = document.querySelector('.react-flow')

    if (!reactFlowNode) {
      console.error('❌ Cannot find React Flow element')
      alert('Export failed. Please try again.')
      return
    }

    const nodesBounds = getRectOfNodes(nodes)
    const transform = getTransformForBounds(
      nodesBounds,
      {
        width: 1200,
        height: 800,
      },
      0.5
    )

    try {
      // Create a temporary wrapper element for proper image capture
      const tempWrapper = document.createElement('div')
      tempWrapper.style.width = '1200px'
      tempWrapper.style.height = '800px'
      tempWrapper.style.position = 'absolute'
      tempWrapper.style.top = '-9999px'
      tempWrapper.style.left = '-9999px'
      tempWrapper.style.transform = `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`

      document.body.appendChild(tempWrapper)
      const reactFlowClone = reactFlowNode.cloneNode(true)
      tempWrapper.appendChild(reactFlowClone)

      html2canvas(tempWrapper, {
        backgroundColor: '#f8f8f8',
        useCORS: true,
        allowTaint: true,
        scale: 2,
      }).then((canvas) => {
        const image = canvas.toDataURL('image/png', 1.0)

        // Create download link
        const downloadLink = document.createElement('a')
        downloadLink.href = image
        downloadLink.download = `${currentMapName || 'nodescape'}_${new Date().toISOString().slice(0, 10)}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

        // Clean up
        document.body.removeChild(tempWrapper)
        alert('PNG exported successfully!')
      })
    } catch (error) {
      console.error('❌ Error exporting PNG:', error)
      alert('Export failed. Please check console for details.')
    }
  }, [nodes, currentMapName])

  /**
   * Export the current graph as JSON data
   * Creates a downloadable JSON file with nodes and edges
   */
  const exportToJSON = useCallback(() => {
    try {
      console.log('📄 Exporting graph as JSON')

      // Create the export data structure
      const exportData = {
        metadata: {
          name: currentMapName || 'Exported Map',
          exportDate: new Date().toISOString(),
          version: '1.0',
        },
        graph: {
          nodes: nodes,
          edges: edges,
        },
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const dataUrl = URL.createObjectURL(blob)

      // Create download link
      const downloadLink = document.createElement('a')
      downloadLink.href = dataUrl
      downloadLink.download = `${currentMapName || 'nodescape'}_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      console.log('✅ JSON exported successfully')
      alert('JSON exported successfully!')
    } catch (error) {
      console.error('❌ Error exporting JSON:', error)
      alert('Export failed. Please check console for details.')
    }
  }, [nodes, edges, currentMapName])

  /**
   * Import a map from a JSON file
   * Allows users to upload and load a previously exported JSON file
   */
  const importFromJSON = useCallback(() => {
    try {
      // Create file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.json'
      fileInput.style.display = 'none'

      fileInput.onchange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        try {
          setIsLoading(true)

          // Read file content
          const text = await file.text()
          const importData = JSON.parse(text)

          // Validate the imported data structure
          if (!importData.graph || !importData.graph.nodes || !importData.graph.edges) {
            throw new Error('Invalid JSON structure. Missing graph data.')
          }

          // Load the data into the editor
          setNodes(importData.graph.nodes || [])
          setEdges(importData.graph.edges || [])

          // Update current map info
          setCurrentMapName(importData.metadata?.name || 'Imported Map')
          setCurrentMapId(null) // Clear current map ID since this is imported
          setMapModifiedAfterLoad(false) // Reset modification flag

          // Update node counter to prevent ID conflicts
          const nextCounter = calculateNextNodeCounter(importData.graph.nodes || [])
          setNodeCounter(nextCounter)

          // Clear selection
          setSelectedNodes([])
          setSelectedEdges([])

          // Fit view to show imported content
          setTimeout(() => fitView(), 100)

          alert(`Map "${importData.metadata?.name || 'Imported Map'}" imported successfully!`)
          console.log('Map imported successfully:', importData)
        } catch (error) {
          console.error('Error importing JSON:', error)
          alert('Failed to import JSON file. Please check the file format.')
        } finally {
          setIsLoading(false)
        }
      }

      document.body.appendChild(fileInput)
      fileInput.click()
      document.body.removeChild(fileInput)
    } catch (error) {
      console.error('❌ Error in import process:', error)
      alert('Import failed. Please check console for details.')
    }
  }, [setNodes, setEdges, calculateNextNodeCounter, setNodeCounter, setSelectedNodes, setSelectedEdges, fitView])

  // Mark the map as modified whenever nodes or edges change
  const markMapAsModified = useCallback(() => {
    setMapModifiedAfterLoad(true)
  }, [])

  return {
    // State
    currentMapId,
    currentMapName,
    isLoading,
    loadMapId,
    availableMaps,
    mapModifiedAfterLoad,

    // State setters
    setCurrentMapId,
    setCurrentMapName,
    setLoadMapId,
    setMapModifiedAfterLoad,

    // Operations
    saveMap,
    loadMapById,
    deleteMap,
    fetchAvailableMaps,
    exportToPNG,
    exportToJSON,
    importFromJSON,
    markMapAsModified,
  }
}

export default useMapOperations
