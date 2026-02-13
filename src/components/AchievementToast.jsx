import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

const AchievementToast = ({ achievement, onClose }) => {
  useEffect(() => {
    // Trigger confetti effect
    const duration = 1500
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      )
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      )
    }, 250)

    // Auto-close after 4 seconds
    const closeTimer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(closeTimer)
    }
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-lg mb-1">
              🎉 Achievement Unlocked!
            </div>
            <div className="font-semibold">{achievement.title}</div>
            <div className="text-sm opacity-90 mt-1">
              {achievement.description}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 font-bold text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default AchievementToast
