// Stripe is disabled for simplified deployment
// Billing feature is not available in this version

// Feature flag for billing - always disabled
export const BILLING_ENABLED = false

// Stripe stub - returns null
export const getStripe = () => null

// Plan definitions
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceMonthly: 0,
    maxBoxes: 5,
    features: [
      'Up to 5 income/expense boxes',
      'Unlimited connections',
      'Save & load flows',
      'Achievement tracking',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '$0.99/month',
    priceMonthly: 0.99,
    maxBoxes: null, // unlimited
    features: [
      'Unlimited income/expense boxes',
      'Unlimited connections',
      'Save & load flows',
      'Achievement tracking',
      'Priority support',
    ],
  },
}

// Get plan limits
export const getPlanLimit = (planCode) => {
  const plan = PLANS[planCode] || PLANS.free
  return plan.maxBoxes
}

// Check if user has reached plan limit
export const hasReachedPlanLimit = (nodes, planCode) => {
  const limit = getPlanLimit(planCode)
  if (limit === null) return false // unlimited
  
  const boxCount = nodes.filter(
    (n) => n.data?.nodeType === 'income' || n.data?.nodeType === 'expense'
  ).length
  
  return boxCount >= limit
}
