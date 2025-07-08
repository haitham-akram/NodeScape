// State Management Demo for MapEditor CRUD Operations
// This file demonstrates the clean state management structure

/**
 * NODE STATE STRUCTURE:
 * Array of node objects in React Flow format:
 * {
 *   id: string,           // Unique identifier
 *   type: string,         // 'default' | 'input' | 'output'
 *   position: {x, y},     // Position coordinates
 *   data: {label: string}, // Node content
 *   selected: boolean     // Selection state
 * }
 */

/**
 * EDGE STATE STRUCTURE:
 * Array of edge objects in React Flow format:
 * {
 *   id: string,           // Unique identifier
 *   source: string,       // Source node ID
 *   target: string,       // Target node ID
 *   data: {label: string}, // Edge content
 *   type: string          // Edge type
 * }
 */

/**
 * CRUD OPERATIONS AVAILABLE:
 *
 * NODES:
 * - addNode(type, position, label) → nodeId
 * - removeNode(nodeId) → void
 * - removeNodes(nodeIds[]) → void
 * - updateNodeLabel(nodeId, newLabel) → void
 * - updateNodePosition(nodeId, newPosition) → void
 *
 * EDGES:
 * - addEdgeCustom(sourceId, targetId, label) → edgeId|null
 * - removeEdge(edgeId) → void
 * - removeEdges(edgeIds[]) → void
 * - updateEdgeLabel(edgeId, newLabel) → void
 *
 * UTILITIES:
 * - clearGraph() → void
 * - getNode(nodeId) → node|null
 * - getEdge(edgeId) → edge|null
 * - getConnectedEdges(nodeId) → edges[]
 */

/**
 * DUPLICATE PREVENTION:
 * - addEdgeCustom() prevents duplicate connections between same nodes
 * - Returns null if duplicate is attempted
 * - Logs warning message to console
 */

/**
 * CASCADING OPERATIONS:
 * - removeNode() automatically removes connected edges
 * - removeNodes() automatically removes connected edges
 * - Selection state is automatically updated
 */

export default {
  nodeStructure: {
    id: 'node-1',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { label: 'Sample Node' },
    selected: false,
  },
  edgeStructure: {
    id: 'edge-node1-node2',
    source: 'node-1',
    target: 'node-2',
    data: { label: 'Connection' },
    type: 'default',
  },
}
