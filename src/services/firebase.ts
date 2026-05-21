import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import type { User, UserPreferences } from '@/types'

// ─── Firebase config ──────────────────────────────────────────────────────────
// Values come from .env — never commit real keys to GitHub!

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

// ─── Default preferences ──────────────────────────────────────────────────────

const defaultPreferences: UserPreferences = {
  language:           'nl',
  favoriteSeries:     ['wec', 'motogp'],
  favoriteDrivers:    [],
  favoriteTeams:      [],
  favoriteCircuits:   [],
  theme:              'dark',
  emailNotifications: true,
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName })

  const newUser: User = {
    uid:         user.uid,
    email:       user.email!,
    displayName,
    photoURL:    user.photoURL ?? undefined,
    createdAt:   new Date().toISOString(),
    preferences: defaultPreferences,
  }

  // Save profile to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    ...newUser,
    createdAt: serverTimestamp(),
  })

  return newUser
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const { user } = await signInWithPopup(auth, googleProvider)

  // Create Firestore profile if first login
  const userRef  = doc(db, 'users', user.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName,
      photoURL:    user.photoURL,
      createdAt:   serverTimestamp(),
      preferences: defaultPreferences,
    })
  }

  return user
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, 'users', uid))
  if (!snapshot.exists()) return null
  return snapshot.data() as User
}

export async function updateUserPreferences(
  uid: string,
  preferences: Partial<UserPreferences>,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    preferences: preferences,
  })
}

// ─── Auth state listener ──────────────────────────────────────────────────────

export { onAuthStateChanged }
export type { FirebaseUser }
