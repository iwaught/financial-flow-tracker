import React, { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  // Mock user for offline mode - always authenticated
  const [user] = useState({ id: 'offline-user', email: 'guest@local' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Stub methods - authentication is disabled
  const signUp = async () => {
    return { data: null, error: { message: 'Authentication disabled in offline mode' } }
  }

  const signIn = async () => {
    return { data: null, error: { message: 'Authentication disabled in offline mode' } }
  }

  const signOut = async () => {
    return { error: { message: 'Authentication disabled in offline mode' } }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
