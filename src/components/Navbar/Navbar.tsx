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
              if (gps?.Algemeen_Sessie) { setIsLive(true); return }
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

// ─── WEC dropdown items ───────────────────────────────────────────────────────
const WEC_ITEMS = [
  { to: '/wec',        label: 'WEC',                     sub: 'Hypercar · GT3 (LMGT3)',    color: '#3b82f6' },
  { to: '/elms',       label: 'European Le Mans Series',  sub: 'LMP2 · LMGT3 · LMP3',      color: '#f97316' },
  { to: '/lemanscup',  label: 'Michelin Le Mans Cup',     sub: 'GT3 · LMP3 · LMP3 Pro/Am', color: '#f59e0b' },
  { to: '/klassement', label: 'Klassement 2026',          sub: 'WEC · ELMS · LM Cup',       color: '#22c55e' },
]

function WecDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-brand-black border border-brand-border rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-orange-500 to-yellow-500" />
      {WEC_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${isActive ? 'bg-white/5' : ''}`
          }
        >
          <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: item.color }} />
          <div>
            <div className="font-head font-bold text-sm text-brand-light leading-tight">{item.label}</div>
            <div className="font-ui text-[11px] text-brand-muted">{item.sub}</div>
          </div>
        </NavLink>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { t }                = useTranslation()
  const { isLoggedIn, user } = useAuth()
  const { language, toggle } = useLangStore()
  const navigate             = useNavigate()
  const location             = useLocation()
  const isLive               = useIsLive()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [wecOpen, setWecOpen]     = useState(false)
  const menuRef  = useRef<HTMLDivElement>(null)
  const wecRef   = useRef<HTMLDivElement>(null)

  const isWecActive = ['/wec', '/elms', '/lemanscup'].some(p => location.pathname.startsWith(p))

  useEffect(() => { setMenuOpen(false); setWecOpen(false) }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
      if (wecRef.current  && !wecRef.current.contains(e.target as Node))  setWecOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  async function handleLogout() { await logout(); navigate('/') }

  const navItems = [
    { to: '/',         label: t('nav.home') },
    { to: '/f1',       label: 'F1' },
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

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/f1" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>F1</NavLink>

          {/* WEC dropdown */}
          <div ref={wecRef} className="relative">
            <button
              onClick={() => setWecOpen(v => !v)}
              onMouseEnter={() => setWecOpen(true)}
              className={`nav-link flex items-center gap-1 ${isWecActive ? 'active' : ''}`}
            >
              WEC
              <svg
                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform duration-200 ${wecOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {wecOpen && (
              <div onMouseLeave={() => setWecOpen(false)}>
                <WecDropdown onClose={() => setWecOpen(false)} />
              </div>
            )}
          </div>

          {navItems.filter(i => !['/','f1','/f1'].includes(i.to)).map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop rechts */}
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={toggle} className="flex items-center gap-0.5 border border-brand-border rounded overflow-hidden">
            <span className={`px-2.5 py-1 text-xs font-ui font-semibold transition-colors ${language === 'nl' ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'}`}>NL</span>
            <span className={`px-2.5 py-1 text-xs font-ui font-semibold transition-colors ${language === 'en' ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'}`}>EN</span>
          </button>
          <Link to="/live" className="flex items-center gap-1.5 text-white px-3.5 py-1.5 rounded text-xs font-ui font-bold uppercase tracking-wider bg-brand-orange hover:bg-orange-600 transition-colors">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? 'bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]' : 'bg-white opacity-70'}`} />
            {t('nav.liveNow')}
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-ui text-brand-muted hidden xl:block">{user?.displayName ?? user?.email}</span>
              <button onClick={handleLogout} className="btn-ghost text-xs">{t('nav.logout')}</button>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost text-xs">{t('nav.login')}</Link>
          )}
        </div>

        {/* Mobile rechts */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/live" className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded text-xs font-ui font-bold uppercase tracking-wider bg-brand-orange hover:bg-orange-600 transition-colors">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? 'bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]' : 'bg-white opacity-70'}`} />
            Live
          </Link>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu openen"
            className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded border border-brand-border hover:border-white/30 transition-colors"
          >
            <span className={`block h-0.5 bg-brand-light transition-all duration-300 ${menuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
            <span className={`block h-0.5 bg-brand-light transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-4'}`} />
            <span className={`block h-0.5 bg-brand-light transition-all duration-300 ${menuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-brand-black/98">
          <div className="px-4 py-3 space-y-1">
            <NavLink to="/" end className={({ isActive }) => `block px-4 py-3 rounded font-ui text-sm font-semibold uppercase tracking-wider transition-colors ${isActive ? 'bg-brand-orange/15 text-brand-orange' : 'text-brand-muted hover:text-brand-light hover:bg-white/5'}`}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/f1" className={({ isActive }) => `block px-4 py-3 rounded font-ui text-sm font-semibold uppercase tracking-wider transition-colors ${isActive ? 'bg-brand-orange/15 text-brand-orange' : 'text-brand-muted hover:text-brand-light hover:bg-white/5'}`}>
              F1
            </NavLink>

            {/* WEC sectie in mobiel menu */}
            <div className="border border-brand-border/50 rounded-lg overflow-hidden">
              <div className="px-4 py-2 font-ui text-[10px] text-brand-muted uppercase tracking-widest bg-white/[0.02]">
                WEC & Endurance
              </div>
              {WEC_ITEMS.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 transition-colors border-t border-brand-border/30 ${isActive ? 'bg-brand-orange/10 text-brand-orange' : 'text-brand-muted hover:text-brand-light hover:bg-white/5'}`
                  }
                >
                  <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div>
                    <div className="font-ui text-sm font-semibold">{item.label}</div>
                    <div className="font-ui text-[11px] opacity-60">{item.sub}</div>
                  </div>
                </NavLink>
              ))}
            </div>

            {navItems.filter(i => i.to !== '/').map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `block px-4 py-3 rounded font-ui text-sm font-semibold uppercase tracking-wider transition-colors ${isActive ? 'bg-brand-orange/15 text-brand-orange' : 'text-brand-muted hover:text-brand-light hover:bg-white/5'}`}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-brand-border flex items-center justify-between">
            <button onClick={toggle} className="flex items-center gap-0.5 border border-brand-border rounded overflow-hidden">
              <span className={`px-3 py-1.5 text-xs font-ui font-semibold transition-colors ${language === 'nl' ? 'bg-brand-orange text-white' : 'text-brand-muted'}`}>NL</span>
              <span className={`px-3 py-1.5 text-xs font-ui font-semibold transition-colors ${language === 'en' ? 'bg-brand-orange text-white' : 'text-brand-muted'}`}>EN</span>
            </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn-ghost text-xs">{t('nav.logout')}</button>
            ) : (
              <Link to="/login" className="btn-ghost text-xs">{t('nav.login')}</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
