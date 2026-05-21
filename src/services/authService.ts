/**
 * authService.ts
 * Higher-level auth operations used by pages/components.
 * Wraps firebase.ts and adds error message translation.
 */

import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout,
  resetPassword,
  updateUserPreferences,
} from './firebase'
import type { UserPreferences } from '@/types'

// ─── Error message mapping (Firebase → Dutch) ─────────────────────────────────

function translateFirebaseError(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use':   'Dit e-mailadres is al in gebruik.',
    'auth/invalid-email':          'Ongeldig e-mailadres.',
    'auth/weak-password':          'Wachtwoord moet minimaal 6 tekens zijn.',
    'auth/user-not-found':         'Geen account gevonden met dit e-mailadres.',
    'auth/wrong-password':         'Onjuist wachtwoord.',
    'auth/too-many-requests':      'Te veel pogingen. Probeer het later opnieuw.',
    'auth/network-request-failed': 'Netwerkfout. Controleer je verbinding.',
    'auth/popup-closed-by-user':   'Google login geannuleerd.',
    'auth/cancelled-popup-request':'Google login geannuleerd.',
  }
  return messages[code] ?? 'Er is iets misgegaan. Probeer het opnieuw.'
}

function extractCode(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    return (err as { code: string }).code
  }
  return 'unknown'
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
  displayName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await registerWithEmail(email, password, displayName)
    return { success: true }
  } catch (err) {
    return { success: false, error: translateFirebaseError(extractCode(err)) }
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await loginWithEmail(email, password)
    return { success: true }
  } catch (err) {
    return { success: false, error: translateFirebaseError(extractCode(err)) }
  }
}

export async function loginGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    await loginWithGoogle()
    return { success: true }
  } catch (err) {
    return { success: false, error: translateFirebaseError(extractCode(err)) }
  }
}

export async function signOut(): Promise<void> {
  await logout()
}

export async function sendPasswordReset(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await resetPassword(email)
    return { success: true }
  } catch (err) {
    return { success: false, error: translateFirebaseError(extractCode(err)) }
  }
}

export async function savePreferences(
  uid: string,
  prefs: Partial<UserPreferences>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateUserPreferences(uid, prefs)
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Voorkeuren opslaan mislukt.' }
  }
}
