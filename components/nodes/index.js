/**
 * Exports for all node components
 * This file simplifies importing node components elsewhere
 */

import EditableNode from './EditableNode'
import InputNode from './InputNode'
import OutputNode from './OutputNode'

export { EditableNode, InputNode, OutputNode }

// Node types to register with React Flow
export const nodeTypes = {
  default: EditableNode,
  input: InputNode,
  output: OutputNode,
}
