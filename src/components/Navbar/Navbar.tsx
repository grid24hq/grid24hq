import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useLangStore } from '@/store/langStore'
import { logout } from '@/services/firebase'

const FIREBASE_RTDB = 'https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app'
const RACE_SERIES   = ['F1', 'MotoGP', 'WEC', 'GT3', 'IMSA', 'WorldSBK']

function useIsLive() {
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function check() {
      for (const serie of RACE_SERIES) {
        try {
          const r = await fetch(`${FIREBASE_RTDB}/${serie}.json`)
          if (!r.ok) continue
          const data = await r.json()
          if (!data) continue
          for (const jaren of Object.values(data) as any[]) {
            for (const gps of Object.values(jaren) as any[]) {
              if (gps?.Algemeen_Sessie) {
                setIsLive(true)
                return
              }
            }
          }
        } catch { continue }
      }
      setIsLive(false)
    }
    check()
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [])

  return isLive
}

export default function Navbar() {
  const { t }                = useTranslation()
  const { isLoggedIn, user } = useAuth()
  const { language, toggle } = useLangStore()
  const navigate             = useNavigate()
  const isLive               = useIsLive()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const navItems = [
    { to: '/',         label: t('nav.home') },
    { to: '/f1',       label: 'F1' },
    { to: '/wec',      label: 'WEC' },
    { to: '/motogp',   label: 'MotoGP' },
    { to: '/gt3',      label: 'GT3' },
    { to: '/imsa',     label: 'IMSA' },
    { to: '/worldsbk', label: 'WorldSBK' },
    { to: '/circuits', label: t('nav.circuits') },
    { to: '/live',     label: t('nav.live') },
    { to: '/kalender', label: t('nav.calendar') },
  ]

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16 bg-brand-black/95 backdrop-blur-sm border-b border-brand-border">

      {/* Logo */}
      <Link to="/" className="font-head font-black text-xl tracking-widest uppercase text-brand-light flex-shrink-0">
        GRID<span className="text-brand-orange">24</span>HQ
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-0.5">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Language toggle */}
        <button onClick={toggle} className="flex items-center gap-0.5 border border-brand-border rounded overflow-hidden">
          <span className={`px-2.5 py-1 text-xs font-ui font-semibold transition-colors ${
            language === 'nl' ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'
          }`}>NL</span>
          <span className={`px-2.5 py-1 text-xs font-ui font-semibold transition-colors ${
            language === 'en' ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'
          }`}>EN</span>
        </button>

        {/* Live button — groen als live, rood als niet */}
        <Link
          to="/live"
          className={`flex items-center gap-1.5 text-white px-3.5 py-1.5 rounded text-xs font-ui font-bold uppercase tracking-wider transition-colors ${
            isLive ? 'bg-green-600' : 'bg-brand-red'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isLive ? 'bg-green-200' : 'bg-red-200'
          }`} />
          {t('nav.liveNow')}
        </Link>

        {/* Auth */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-ui text-brand-muted hidden lg:block">
              {user?.displayName ?? user?.email}
            </span>
            <button onClick={handleLogout} className="btn-ghost text-xs">
              {t('nav.logout')}
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-ghost text-xs">
            {t('nav.login')}
          </Link>
        )}
      </div>
    </nav>
  )
}
