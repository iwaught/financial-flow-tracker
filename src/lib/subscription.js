import { supabase } from './supabase'

/**
 * Get user's subscription
 * @param {string} userId - The user ID
 * @returns {Promise<{subscription, error}>}
 */
export const getUserSubscription = async (userId) => {
  try {
    if (!userId) {
      return { subscription: null, error: new Error('User ID required') }
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no subscription found, return free plan
      if (error.code === 'PGRST116') {
        return {
          subscription: {
            user_id: userId,
            plan_code: 'free',
            status: 'active',
          },
          error: null,
        }
      }
      throw error
    }

    return { subscription: data, error: null }
  } catch (error) {
    console.error('Error getting subscription:', error)
    return { subscription: null, error }
  }
}

/**
 * Create or update subscription
 * @param {string} userId - The user ID
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<{data, error}>}
 */
export const upsertSubscription = async (userId, subscriptionData) => {
  try {
    if (!userId) {
      throw new Error('User ID required')
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          ...subscriptionData,
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error upserting subscription:', error)
    return { data: null, error }
  }
}

/**
 * Create Stripe checkout session
 * Note: This would typically call a backend endpoint
 * For now, this is a placeholder
 * @param {string} userId - The user ID
 * @param {string} priceId - The Stripe price ID
 * @returns {Promise<{sessionUrl, error}>}
 */
export const createCheckoutSession = async (userId, priceId) => {
  try {
    // In production, this would call a backend API endpoint or Supabase Edge Function
    // Example:
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, priceId }),
    // })
    // const data = await response.json()
    // return { sessionUrl: data.url, error: null }

    // For now, return a placeholder
    console.warn('createCheckoutSession: Not yet implemented - requires backend endpoint')
    return {
      sessionUrl: null,
      error: new Error('Checkout not yet configured. Please contact support.'),
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { sessionUrl: null, error }
  }
}
