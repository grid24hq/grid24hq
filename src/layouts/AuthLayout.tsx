import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <header className="px-8 py-5 border-b border-brand-border">
        <Link to="/" className="font-head font-black text-2xl tracking-widest uppercase text-brand-light">
          GRID<span className="text-brand-orange">24</span>HQ
        </Link>
      </header>
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(230,51,0,0.06) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(230,51,0,0.06) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-full py-16 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
