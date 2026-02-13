import React, { useState } from 'react'
import { PLANS } from '../lib/stripe'
import { createCheckoutSession } from '../lib/subscription'
import { useAuth } from '../contexts/AuthContext'

const UpgradeModal = ({ isOpen, onClose, currentPlan }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      setError('')

      // In production, this would redirect to Stripe Checkout
      // For now, show a message
      setError('Stripe checkout is not yet configured. Please set up your Stripe account and webhook endpoint first.')
      
      // Example production code:
      // const { sessionUrl, error } = await createCheckoutSession(user.id, 'price_xxxx')
      // if (error) {
      //   setError(error.message)
      // } else {
      //   window.location.href = sessionUrl
      // }
    } catch (err) {
      console.error('Upgrade error:', err)
      setError('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const isPro = currentPlan === 'pro'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 font-bold text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <div className="text-4xl font-bold text-gray-900 my-3">$0</div>
                <p className="text-gray-600">Forever free</p>
              </div>
              <ul className="space-y-3 mb-6">
                {PLANS.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              {currentPlan === 'free' && (
                <div className="text-center py-2 bg-gray-100 rounded-lg font-semibold text-gray-600">
                  Current Plan
                </div>
              )}
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  RECOMMENDED
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <div className="text-4xl font-bold text-blue-600 my-3">$0.99</div>
                <p className="text-gray-600">Per month</p>
              </div>
              <ul className="space-y-3 mb-6">
                {PLANS.pro.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              {isPro ? (
                <div className="text-center py-2 bg-blue-100 rounded-lg font-semibold text-blue-600">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {loading ? 'Processing...' : 'Upgrade to Pro'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> {error}
              </p>
              <p className="text-yellow-700 text-xs mt-2">
                To enable billing, configure your Stripe keys in .env and set up a webhook endpoint.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal
