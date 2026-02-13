import { supabase } from './supabase'

// Achievement definitions
export const ACHIEVEMENTS = {
  first_income: {
    id: 'first_income',
    title: 'First Step',
    description: 'Create your first income box',
    icon: '💰',
  },
  triple_income: {
    id: 'triple_income',
    title: 'Triple Income',
    description: 'Reach 3 income sources',
    icon: '🎯',
  },
  first_expense: {
    id: 'first_expense',
    title: 'Budget Builder',
    description: 'Create your first expense box',
    icon: '💳',
  },
  balanced_map: {
    id: 'balanced_map',
    title: 'Balanced Map',
    description: 'Reach at least 2 income and 2 expense boxes',
    icon: '⚖️',
  },
  five_connections: {
    id: 'five_connections',
    title: 'Connector',
    description: 'Create 5 valid connections',
    icon: '🔗',
  },
  first_save: {
    id: 'first_save',
    title: 'Data Keeper',
    description: 'Save your flow for the first time',
    icon: '💾',
  },
}

/**
 * Get all achievements for a user
 * @param {string} userId - The user ID
 * @returns {Promise<{unlockedAchievements: string[], error: any}>}
 */
export const getUserAchievements = async (userId) => {
  try {
    if (!userId) {
      return { unlockedAchievements: [], error: null }
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)

    if (error) throw error

    return {
      unlockedAchievements: data.map((a) => a.achievement_id),
      error: null,
    }
  } catch (error) {
    console.error('Error getting user achievements:', error)
    return { unlockedAchievements: [], error }
  }
}

/**
 * Unlock an achievement for a user
 * @param {string} userId - The user ID
 * @param {string} achievementId - The achievement ID
 * @returns {Promise<{success: boolean, alreadyUnlocked: boolean, error: any}>}
 */
export const unlockAchievement = async (userId, achievementId) => {
  try {
    if (!userId) {
      throw new Error('User must be authenticated to unlock achievements')
    }

    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    if (existing) {
      return { success: false, alreadyUnlocked: true, error: null }
    }

    // Insert new achievement
    const { error } = await supabase
      .from('user_achievements')
      .insert([
        {
          user_id: userId,
          achievement_id: achievementId,
        },
      ])

    if (error) {
      // Check for unique constraint violation (race condition)
      if (error.code === '23505') {
        return { success: false, alreadyUnlocked: true, error: null }
      }
      throw error
    }

    return { success: true, alreadyUnlocked: false, error: null }
  } catch (error) {
    console.error('Error unlocking achievement:', error)
    return { success: false, alreadyUnlocked: false, error }
  }
}

/**
 * Check and unlock achievements based on current flow state
 * @param {string} userId - The user ID
 * @param {Array} nodes - Current flow nodes
 * @param {Array} edges - Current flow edges
 * @param {Array} unlockedAchievements - Already unlocked achievement IDs
 * @param {boolean} justSaved - Whether the user just saved
 * @returns {Promise<Array>} Array of newly unlocked achievement IDs
 */
export const checkAchievements = async (
  userId,
  nodes,
  edges,
  unlockedAchievements,
  justSaved = false
) => {
  const newlyUnlocked = []

  // Count income and expense nodes (excluding status node)
  const incomeNodes = nodes.filter(
    (n) => n.data?.nodeType === 'income'
  )
  const expenseNodes = nodes.filter(
    (n) => n.data?.nodeType === 'expense'
  )
  const connectionCount = edges.length

  // Check: First income
  if (
    !unlockedAchievements.includes('first_income') &&
    incomeNodes.length >= 1
  ) {
    const { success } = await unlockAchievement(userId, 'first_income')
    if (success) newlyUnlocked.push('first_income')
  }

  // Check: Triple income
  if (
    !unlockedAchievements.includes('triple_income') &&
    incomeNodes.length >= 3
  ) {
    const { success } = await unlockAchievement(userId, 'triple_income')
    if (success) newlyUnlocked.push('triple_income')
  }

  // Check: First expense
  if (
    !unlockedAchievements.includes('first_expense') &&
    expenseNodes.length >= 1
  ) {
    const { success } = await unlockAchievement(userId, 'first_expense')
    if (success) newlyUnlocked.push('first_expense')
  }

  // Check: Balanced map
  if (
    !unlockedAchievements.includes('balanced_map') &&
    incomeNodes.length >= 2 &&
    expenseNodes.length >= 2
  ) {
    const { success } = await unlockAchievement(userId, 'balanced_map')
    if (success) newlyUnlocked.push('balanced_map')
  }

  // Check: Five connections
  if (
    !unlockedAchievements.includes('five_connections') &&
    connectionCount >= 5
  ) {
    const { success } = await unlockAchievement(userId, 'five_connections')
    if (success) newlyUnlocked.push('five_connections')
  }

  // Check: First save
  if (!unlockedAchievements.includes('first_save') && justSaved) {
    const { success } = await unlockAchievement(userId, 'first_save')
    if (success) newlyUnlocked.push('first_save')
  }

  return newlyUnlocked
}
