import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user:       User | null
  isLoading:  boolean
  isLoggedIn: boolean

  setUser:    (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearUser:  () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:       null,
      isLoading:  true,
      isLoggedIn: false,

      setUser: (user) =>
        set({ user, isLoggedIn: user !== null, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      clearUser: () =>
        set({ user: null, isLoggedIn: false, isLoading: false }),
    }),
    {
      name:    'grid24hq-auth',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    },
  ),
)
