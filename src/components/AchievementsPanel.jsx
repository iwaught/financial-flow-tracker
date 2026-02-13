import React, { useState, useEffect } from 'react'
import { ACHIEVEMENTS, getUserAchievements } from '../lib/achievements'
import { useAuth } from '../contexts/AuthContext'

const AchievementsPanel = ({ isOpen, onClose, unlockedAchievementIds, nodes, edges }) => {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    // Transform achievements into array with unlock status
    const achievementList = Object.values(ACHIEVEMENTS).map((achievement) => {
      const isUnlocked = unlockedAchievementIds.includes(achievement.id)
      const progress = getProgress(achievement.id, nodes, edges)
      
      return {
        ...achievement,
        isUnlocked,
        progress,
      }
    })

    setAchievements(achievementList)
  }, [unlockedAchievementIds, nodes, edges])

  // Calculate progress for each achievement
  const getProgress = (achievementId, nodes, edges) => {
    const incomeNodes = nodes.filter((n) => n.data?.nodeType === 'income')
    const expenseNodes = nodes.filter((n) => n.data?.nodeType === 'expense')
    const connectionCount = edges.length

    switch (achievementId) {
      case 'first_income':
        return incomeNodes.length >= 1 ? '1/1' : '0/1'
      case 'triple_income':
        return `${Math.min(incomeNodes.length, 3)}/3`
      case 'first_expense':
        return expenseNodes.length >= 1 ? '1/1' : '0/1'
      case 'balanced_map':
        return `${Math.min(incomeNodes.length, 2)}/2 income, ${Math.min(expenseNodes.length, 2)}/2 expense`
      case 'five_connections':
        return `${Math.min(connectionCount, 5)}/5`
      case 'first_save':
        return unlockedAchievementIds.includes('first_save') ? '1/1' : '0/1'
      default:
        return ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🏆 Achievements</h2>
              <p className="text-sm opacity-90 mt-1">
                {unlockedAchievementIds.length} / {Object.keys(ACHIEVEMENTS).length} unlocked
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 font-bold text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Achievement List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`border rounded-lg p-4 transition-all ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`text-4xl ${
                      achievement.isUnlocked ? 'grayscale-0' : 'grayscale opacity-40'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-lg ${
                          achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      {achievement.isUnlocked && (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        achievement.isUnlocked ? 'text-gray-700' : 'text-gray-500'
                      }`}
                    >
                      {achievement.description}
                    </p>
                    {!achievement.isUnlocked && achievement.progress && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-600">
                          Progress: {achievement.progress}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default AchievementsPanel
