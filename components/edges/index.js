/**
 * Exports for all edge components
 * This file simplifies importing edge components elsewhere
 */

import EditableEdge from './EditableEdge'

export { EditableEdge }

// Edge types to register with React Flow
export const edgeTypes = {
  default: EditableEdge,
}
