import { useEffect } from 'react'
import { onAuthStateChanged } from '@/services/firebase'
import { getUserProfile } from '@/services/firebase'
import { useAuthStore } from '@/store/authStore'

/**
 * Initialises Firebase auth listener and keeps Zustand store in sync.
 * Call once at the top of your app (in App.tsx or a provider).
 */
export function useAuthInit(): void {
  const { setUser, setLoading, clearUser } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Load full profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid)
        if (profile) {
          setUser(profile)
        } else {
          // Fallback: use Firebase user data directly
          setUser({
            uid:         firebaseUser.uid,
            email:       firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? undefined,
            photoURL:    firebaseUser.photoURL ?? undefined,
            createdAt:   new Date().toISOString(),
            preferences: {
              language:           'nl',
              favoriteSeries:     [],
              favoriteDrivers:    [],
              favoriteTeams:      [],
              favoriteCircuits:   [],
              theme:              'dark',
              emailNotifications: true,
            },
          })
        }
      } else {
        clearUser()
      }
    })

    return () => unsubscribe()
  }, [setUser, setLoading, clearUser])
}

/**
 * Returns auth state for use in any component.
 */
export function useAuth() {
  const { user, isLoading, isLoggedIn } = useAuthStore()
  return { user, isLoading, isLoggedIn }
}
