import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loginWithEmail, loginWithGoogle } from '@/services/firebase'

export default function Login() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const from     = (location.state as { from?: string })?.from ?? '/'
  const message  = (location.state as { message?: string })?.message

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Inloggen mislukt')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google login mislukt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-head font-black text-3xl tracking-widest uppercase mb-2">
            GRID<span className="text-brand-orange">24</span>HQ
          </div>
          <h1 className="font-head text-xl font-bold uppercase tracking-wide text-brand-light">
            {t('auth.login')}
          </h1>
        </div>

        {/* Redirect message */}
        {message && (
          <div className="bg-brand-red/10 border border-brand-red/30 text-brand-light text-xs font-ui px-4 py-3 rounded mb-5">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-700/40 text-red-300 text-xs font-ui px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-ui text-xs font-medium uppercase tracking-wider text-brand-muted mb-1.5">
              {t('auth.email')}
            </label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jou@email.nl"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-ui text-xs font-medium uppercase tracking-wider text-brand-muted">
                {t('auth.password')}
              </label>
              <Link to="/forgot-password" className="font-ui text-xs text-brand-orange hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Laden...' : t('auth.login')}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="font-ui text-xs text-brand-muted uppercase tracking-wider">{t('auth.orContinueWith')}</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 border border-brand-border hover:border-white/20 text-brand-light font-ui text-sm py-2.5 rounded transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {t('auth.loginGoogle')}
        </button>

        {/* Register link */}
        <p className="text-center font-ui text-xs text-brand-muted mt-6">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-brand-orange hover:underline font-medium">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
