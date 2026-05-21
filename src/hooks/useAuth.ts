import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getUserProfile } from '@/services/firebase'
import { useAuthStore } from '@/store/authStore'

export function useAuthInit(): void {
  const { setUser, setLoading, clearUser } = useAuthStore()

  useEffect(() => {
    const auth = getAuth()
    setLoading(true)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid)
        if (profile) {
          setUser(profile)
        } else {
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

export function useAuth() {
  const { user, isLoading, isLoggedIn } = useAuthStore()
  return { user, isLoading, isLoggedIn }
}