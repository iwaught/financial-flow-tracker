// Flow persistence using localStorage instead of Supabase
// Data is stored locally in the browser

const STORAGE_KEY = 'financial-flow-data'

/**
 * Save flow data to localStorage
 * @param {string} userId - The authenticated user ID
 * @param {Array} nodes - Array of flow nodes
 * @param {Array} edges - Array of flow edges
 * @param {string} flowName - Optional name for the flow
 * @returns {Promise<{data, error}>}
 */
export const saveFlow = async (userId, nodes, edges, flowName = 'My Flow') => {
  try {
    const flowData = {
      user_id: userId,
      name: flowName,
      nodes_json: nodes,
      edges_json: edges,
      updated_at: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowData))

    return { data: flowData, error: null }
  } catch (error) {
    console.error('Error saving flow to localStorage:', error)
    return { data: null, error }
  }
}

/**
 * Load flow data from localStorage
 * @param {string} userId - The authenticated user ID
 * @returns {Promise<{data, error}>}
 */
export const loadFlow = async (userId) => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)
    
    if (storedData) {
      const flowData = JSON.parse(storedData)
      return {
        data: {
          nodes: flowData.nodes_json || [],
          edges: flowData.edges_json || [],
          name: flowData.name || 'My Flow',
        },
        error: null,
      }
    }

    // No saved flow found
    return { data: null, error: null }
  } catch (error) {
    console.error('Error loading flow from localStorage:', error)
    return { data: null, error }
  }
}
