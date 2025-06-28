import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  isAdmin: boolean
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: { user: any; isAdmin: boolean } }
  | { type: 'SET_UNAUTHENTICATED' }

const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
} | null>(null)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_AUTHENTICATED':
      return { 
        isAuthenticated: true, 
        isLoading: false, 
        user: action.payload.user,
        isAdmin: action.payload.isAdmin
      }
    case 'SET_UNAUTHENTICATED':
      return { 
        isAuthenticated: false, 
        isLoading: false, 
        user: null,
        isAdmin: false
      }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    isAdmin: false
  })

  const checkAdminStatus = (user: any): boolean => {
    // Only allow the specific admin email
    return user?.email === 'instylebd86@gmail.com'
  }

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const isAdmin = checkAdminStatus(session.user)
          if (isAdmin) {
            dispatch({ type: 'SET_AUTHENTICATED', payload: { user: session.user, isAdmin } })
          } else {
            // If user is not admin, sign them out immediately
            await supabase.auth.signOut()
            dispatch({ type: 'SET_UNAUTHENTICATED' })
          }
        } else {
          dispatch({ type: 'SET_UNAUTHENTICATED' })
        }
      } catch (error) {
        console.error('Auth check error:', error)
        dispatch({ type: 'SET_UNAUTHENTICATED' })
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isAdmin = checkAdminStatus(session.user)
        if (isAdmin) {
          dispatch({ type: 'SET_AUTHENTICATED', payload: { user: session.user, isAdmin } })
        } else {
          // If user is not admin, sign them out immediately
          await supabase.auth.signOut()
          dispatch({ type: 'SET_UNAUTHENTICATED' })
        }
      } else {
        dispatch({ type: 'SET_UNAUTHENTICATED' })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    // Check if the email is the authorized admin email
    if (email !== 'instylebd86@gmail.com') {
      dispatch({ type: 'SET_UNAUTHENTICATED' })
      return { success: false, error: 'Access denied. Only authorized admin can login.' }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        dispatch({ type: 'SET_UNAUTHENTICATED' })
        return { success: false, error: error.message }
      }

      if (data.user) {
        const isAdmin = checkAdminStatus(data.user)
        if (isAdmin) {
          dispatch({ type: 'SET_AUTHENTICATED', payload: { user: data.user, isAdmin } })
          return { success: true }
        } else {
          // Sign out non-admin users immediately
          await supabase.auth.signOut()
          dispatch({ type: 'SET_UNAUTHENTICATED' })
          return { success: false, error: 'Access denied. Only authorized admin can login.' }
        }
      }

      dispatch({ type: 'SET_UNAUTHENTICATED' })
      return { success: false, error: 'Login failed' }
    } catch (error) {
      dispatch({ type: 'SET_UNAUTHENTICATED' })
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      dispatch({ type: 'SET_UNAUTHENTICATED' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}