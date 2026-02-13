import { supabase } from './supabase'

/**
 * Save flow data to Supabase
 * @param {string} userId - The authenticated user ID
 * @param {Array} nodes - Array of flow nodes
 * @param {Array} edges - Array of flow edges
 * @param {string} flowName - Optional name for the flow
 * @returns {Promise<{data, error}>}
 */
export const saveFlow = async (userId, nodes, edges, flowName = 'My Flow') => {
  try {
    if (!userId) {
      throw new Error('User must be authenticated to save flow')
    }

    // Check if user already has a flow
    const { data: existingFlows, error: fetchError } = await supabase
      .from('flows')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (fetchError) throw fetchError

    const flowData = {
      user_id: userId,
      name: flowName,
      nodes_json: nodes,
      edges_json: edges,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existingFlows && existingFlows.length > 0) {
      // Update existing flow
      result = await supabase
        .from('flows')
        .update(flowData)
        .eq('id', existingFlows[0].id)
        .select()
    } else {
      // Insert new flow
      result = await supabase
        .from('flows')
        .insert([flowData])
        .select()
    }

    if (result.error) throw result.error

    return { data: result.data, error: null }
  } catch (error) {
    console.error('Error saving flow:', error)
    return { data: null, error }
  }
}

/**
 * Load flow data from Supabase
 * @param {string} userId - The authenticated user ID
 * @returns {Promise<{data, error}>}
 */
export const loadFlow = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User must be authenticated to load flow')
    }

    const { data, error } = await supabase
      .from('flows')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (error) throw error

    if (data && data.length > 0) {
      return {
        data: {
          nodes: data[0].nodes_json || [],
          edges: data[0].edges_json || [],
          name: data[0].name || 'My Flow',
        },
        error: null,
      }
    }

    // No saved flow found
    return { data: null, error: null }
  } catch (error) {
    console.error('Error loading flow:', error)
    return { data: null, error }
  }
}
