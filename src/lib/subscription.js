// Subscriptions using localStorage instead of Supabase

const SUBSCRIPTION_STORAGE_KEY = 'financial-flow-subscription'

/**
 * Get user's subscription from localStorage
 * @param {string} userId - The user ID
 * @returns {Promise<{subscription, error}>}
 */
export const getUserSubscription = async (userId) => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    const subscriptions = stored ? JSON.parse(stored) : {}
    const userSubscription = subscriptions[userId]

    if (userSubscription) {
      return { subscription: userSubscription, error: null }
    }

    // Default to free plan
    return {
      subscription: {
        user_id: userId,
        plan_code: 'free',
        status: 'active',
      },
      error: null,
    }
  } catch (error) {
    console.error('Error getting subscription:', error)
    return { subscription: null, error }
  }
}

/**
 * Create or update subscription in localStorage
 * @param {string} userId - The user ID
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<{data, error}>}
 */
export const upsertSubscription = async (userId, subscriptionData) => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    const subscriptions = stored ? JSON.parse(stored) : {}
    
    subscriptions[userId] = {
      user_id: userId,
      ...subscriptionData,
    }
    
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptions))

    return { data: subscriptions[userId], error: null }
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
