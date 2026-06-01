import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
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
  const location             = useLocation()
  const isLive               = useIsLive()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Sluit menu bij route wissel
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Sluit menu bij klik buiten
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  // Voorkom scrollen als menu open is
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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
    <nav ref={menuRef} className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-brand-border">
      <div className="flex items-center justify-between px-4 md:px-8 h-16">

        {/* Logo */}
        <Link to="/" className="font-head font-black text-xl tracking-widest uppercase text-brand-light flex-shrink-0">
          GRID<span className="text-brand-orange">24</span>HQ
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0.5">
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

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Language toggle */}
          <button onClick={toggle} className="flex items-center gap-0.5 border border-brand-border rounded overflow-hidden">
            <span className={`px-2.5 py-1 text-xs font-ui font-semibold transition-colors ${
              language === 'nl' ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'
            }`}>NL</span>
            <span className={`px-2.5 py-1 text-xs font-ui font-semibold transition-colors ${
              language === 'en' ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'
            }`}>EN</span>
          </button>

          {/* Live button */}
          <Link
            to="/live"
            className="flex items-center gap-1.5 text-white px-3.5 py-1.5 rounded text-xs font-ui font-bold uppercase tracking-wider bg-brand-orange hover:bg-orange-600 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isLive
                ? 'bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]'
                : 'bg-white opacity-70'
            }`} />
            {t('nav.liveNow')}
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-ui text-brand-muted hidden xl:block">
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

        {/* Mobile right: live + hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to="/live"
            className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded text-xs font-ui font-bold uppercase tracking-wider bg-brand-orange hover:bg-orange-600 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isLive
                ? 'bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]'
                : 'bg-white opacity-70'
            }`} />
            Live
          </Link>

          {/* Hamburger knop */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu openen"
            className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded border border-brand-border hover:border-white/30 transition-colors"
          >
            <span className={`block h-0.5 bg-brand-light transition-all duration-300 ${menuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
            <span className={`block h-0.5 bg-brand-light transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-4'}`} />
            <span className={`block h-0.5 bg-brand-light transition-all duration-300 ${menuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-brand-black/98">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded font-ui text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-brand-orange/15 text-brand-orange'
                      : 'text-brand-muted hover:text-brand-light hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile bottom: taal + auth */}
          <div className="px-4 py-3 border-t border-brand-border flex items-center justify-between">
            <button onClick={toggle} className="flex items-center gap-0.5 border border-brand-border rounded overflow-hidden">
              <span className={`px-3 py-1.5 text-xs font-ui font-semibold transition-colors ${
                language === 'nl' ? 'bg-brand-orange text-white' : 'text-brand-muted'
              }`}>NL</span>
              <span className={`px-3 py-1.5 text-xs font-ui font-semibold transition-colors ${
                language === 'en' ? 'bg-brand-orange text-white' : 'text-brand-muted'
              }`}>EN</span>
            </button>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn-ghost text-xs">
                {t('nav.logout')}
              </button>
            ) : (
              <Link to="/login" className="btn-ghost text-xs">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
