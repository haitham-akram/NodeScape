/**
 * Node Processors
 * Define the actual logic for each node type
 */

/**
 * Base Node Processor
 */
class BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    throw new Error('Process method must be implemented by subclass')
  }

  validateInputs(inputData, required = []) {
    for (const key of required) {
      if (!(key in inputData) || inputData[key] === null || inputData[key] === undefined) {
        throw new Error(`Required input '${key}' is missing`)
      }
    }
  }
}

/**
 * Input Node Processor
 */
class InputNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    // Input nodes just pass through their configured data
    return nodeConfig.value || nodeConfig.defaultValue || null
  }
}

/**
 * Output Node Processor
 */
class OutputNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    // Output nodes receive data and display it
    // Get the actual input data (could be from default connection or named connections)
    const input = this.extractInputValue(inputData)

    // For output nodes, we just pass through the input data
    return input
  }

  extractInputValue(inputData) {
    // If inputData is empty, return null
    if (!inputData || Object.keys(inputData).length === 0) {
      return null
    }

    // If there's a 'default' connection, use that
    if (inputData.default !== undefined) {
      return inputData.default
    }

    // If there's only one input, use that value
    const keys = Object.keys(inputData)
    if (keys.length === 1) {
      return inputData[keys[0]]
    }

    // Otherwise return the whole inputData object
    return inputData
  }

  formatOutput(data, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2)
      case 'string':
        return String(data)
      case 'number':
        return Number(data)
      default:
        return data
    }
  }
}

/**
 * Default Process Node Processor
 */
class ProcessNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    // Basic processing node that can apply simple transformations
    const input = inputData.default || Object.values(inputData)[0]

    switch (nodeConfig.operation || 'passthrough') {
      case 'passthrough':
        return input

      case 'delay':
        await new Promise((resolve) => setTimeout(resolve, nodeConfig.delayMs || 1000))
        return input

      case 'multiply':
        return typeof input === 'number' ? input * (nodeConfig.factor || 1) : input

      case 'uppercase':
        return typeof input === 'string' ? input.toUpperCase() : input

      case 'lowercase':
        return typeof input === 'string' ? input.toLowerCase() : input

      default:
        return input
    }
  }
}

/**
 * Transform Node Processor
 */
class TransformNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    const input = inputData.default || Object.values(inputData)[0]

    switch (nodeConfig.transformType || 'map') {
      case 'map':
        if (Array.isArray(input)) {
          return input.map((item) => this.applyTransform(item, nodeConfig.transform))
        }
        return this.applyTransform(input, nodeConfig.transform)

      case 'extract':
        return this.extractField(input, nodeConfig.fieldPath)

      case 'merge':
        return this.mergeData(inputData, nodeConfig.mergeStrategy)

      case 'restructure':
        return this.restructureData(input, nodeConfig.schema)

      default:
        return input
    }
  }

  applyTransform(data, transform) {
    if (!transform) return data

    try {
      // Simple transform function evaluation (in real app, use safer evaluation)
      const func = new Function('data', `return ${transform}`)
      return func(data)
    } catch (error) {
      console.error('Transform error:', error)
      return data
    }
  }

  extractField(data, path) {
    if (!path) return data

    return path.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : null
    }, data)
  }

  mergeData(inputData, strategy = 'combine') {
    const values = Object.values(inputData)

    switch (strategy) {
      case 'combine':
        return values.reduce((acc, val) => ({ ...acc, ...val }), {})

      case 'array':
        return values

      case 'sum':
        return values.reduce((sum, val) => sum + (Number(val) || 0), 0)

      default:
        return values[0]
    }
  }

  restructureData(data, schema) {
    if (!schema) return data

    try {
      const result = {}
      Object.entries(schema).forEach(([key, sourcePath]) => {
        result[key] = this.extractField(data, sourcePath)
      })
      return result
    } catch (error) {
      console.error('Restructure error:', error)
      return data
    }
  }
}

/**
 * Filter Node Processor
 */
class FilterNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    const input = inputData.default || Object.values(inputData)[0]

    if (!Array.isArray(input)) {
      return this.filterSingle(input, nodeConfig)
    }

    return input.filter((item) => this.filterSingle(item, nodeConfig))
  }

  filterSingle(item, nodeConfig) {
    const { field, operator = 'equals', value, condition } = nodeConfig

    if (condition) {
      try {
        const func = new Function('item', `return ${condition}`)
        return func(item)
      } catch (error) {
        console.error('Filter condition error:', error)
        return true
      }
    }

    if (!field) return true

    const itemValue = this.extractField(item, field)

    switch (operator) {
      case 'equals':
        return itemValue === value
      case 'not_equals':
        return itemValue !== value
      case 'greater_than':
        return Number(itemValue) > Number(value)
      case 'less_than':
        return Number(itemValue) < Number(value)
      case 'contains':
        return String(itemValue).includes(String(value))
      case 'exists':
        return itemValue !== null && itemValue !== undefined
      default:
        return true
    }
  }

  extractField(data, path) {
    if (!path) return data
    return path.split('.').reduce((obj, key) => obj?.[key], data)
  }
}

/**
 * Aggregate Node Processor
 */
class AggregateNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    const input = inputData.default || Object.values(inputData)[0]

    if (!Array.isArray(input)) {
      return input
    }

    const { operation = 'count', field } = nodeConfig

    switch (operation) {
      case 'count':
        return input.length

      case 'sum':
        return input.reduce((sum, item) => {
          const value = field ? this.extractField(item, field) : item
          return sum + (Number(value) || 0)
        }, 0)

      case 'average':
        const sum = input.reduce((sum, item) => {
          const value = field ? this.extractField(item, field) : item
          return sum + (Number(value) || 0)
        }, 0)
        return input.length > 0 ? sum / input.length : 0

      case 'min':
        return Math.min(
          ...input.map((item) => {
            const value = field ? this.extractField(item, field) : item
            return Number(value) || 0
          })
        )

      case 'max':
        return Math.max(
          ...input.map((item) => {
            const value = field ? this.extractField(item, field) : item
            return Number(value) || 0
          })
        )

      case 'group_by':
        return this.groupBy(input, field)

      default:
        return input
    }
  }

  extractField(data, path) {
    if (!path) return data
    return path.split('.').reduce((obj, key) => obj?.[key], data)
  }

  groupBy(array, field) {
    return array.reduce((groups, item) => {
      const key = this.extractField(item, field)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    }, {})
  }
}

/**
 * Condition Node Processor
 */
class ConditionNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    const input = inputData.default || Object.values(inputData)[0]
    const { condition, trueValue, falseValue } = nodeConfig

    let result = false

    try {
      if (condition) {
        const func = new Function('input', `return ${condition}`)
        result = func(input)
      }
    } catch (error) {
      console.error('Condition evaluation error:', error)
      result = false
    }

    return {
      condition: result,
      value: result ? trueValue : falseValue,
      input: input,
    }
  }
}

/**
 * API Node Processor
 */
class ApiNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    const { url, method = 'GET', headers = {}, body } = nodeConfig
    const input = inputData.default || Object.values(inputData)[0]

    if (!url) {
      throw new Error('API URL is required')
    }

    try {
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }

      if (method !== 'GET' && body) {
        requestOptions.body = JSON.stringify(
          body.includes('{{input}}') ? JSON.parse(body.replace('{{input}}', JSON.stringify(input))) : body
        )
      }

      const response = await fetch(url, requestOptions)
      const data = await response.json()

      return {
        status: response.status,
        data: data,
        input: input,
      }
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`)
    }
  }
}

/**
 * Database Node Processor (Mock implementation)
 */
class DatabaseNodeProcessor extends BaseNodeProcessor {
  async process(inputData, nodeConfig) {
    const { operation = 'select', table, query } = nodeConfig
    const input = inputData.default || Object.values(inputData)[0]

    // Mock database operations
    switch (operation) {
      case 'select':
        return this.mockSelect(table, query, input)

      case 'insert':
        return this.mockInsert(table, input)

      case 'update':
        return this.mockUpdate(table, query, input)

      case 'delete':
        return this.mockDelete(table, query)

      default:
        return { success: false, error: 'Unknown operation' }
    }
  }

  mockSelect(table, query, input) {
    // Simulate database select
    return {
      success: true,
      data: [
        { id: 1, name: 'Sample Record 1', value: Math.random() },
        { id: 2, name: 'Sample Record 2', value: Math.random() },
      ],
      query: query,
      input: input,
    }
  }

  mockInsert(table, data) {
    return {
      success: true,
      insertedId: Math.floor(Math.random() * 1000),
      data: data,
    }
  }

  mockUpdate(table, query, data) {
    return {
      success: true,
      affected: 1,
      data: data,
    }
  }

  mockDelete(table, query) {
    return {
      success: true,
      affected: 1,
    }
  }
}

// Export all processors
export {
  BaseNodeProcessor,
  InputNodeProcessor,
  OutputNodeProcessor,
  ProcessNodeProcessor,
  TransformNodeProcessor,
  FilterNodeProcessor,
  AggregateNodeProcessor,
  ConditionNodeProcessor,
  ApiNodeProcessor,
  DatabaseNodeProcessor,
}
