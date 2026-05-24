import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { useAuthInit } from '@/hooks/useAuth'

import MainLayout     from '@/layouts/MainLayout'
import AuthLayout     from '@/layouts/AuthLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/UI/LoadingSpinner'

// ── Eager (always loaded) ─────────────────────────────────────────────────────
import Home      from '@/pages/Home'
import LiveCenter from '@/pages/LiveCenter'
import { Login, Register } from '@/pages/Auth'

// ── Lazy (loaded only when visited — smaller initial bundle) ──────────────────
const WEC      = lazy(() => import('@/pages/WEC'))
const MotoGP   = lazy(() => import('@/pages/MotoGP'))
const GT3      = lazy(() => import('@/pages/GT3'))
const IMSA     = lazy(() => import('@/pages/IMSA'))
const WorldSBK = lazy(() => import('@/pages/WorldSBK'))
const F1       = lazy(() => import('@/pages/F1'))
const Circuits = lazy(() => import('@/pages/Circuits'))
const Teams    = lazy(() => import('@/pages/Teams'))
const Kalender = lazy(() => import('@/pages/Kalender'))

// ── React Query client ────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
    },
  },
})

// ── Auth initialiser — runs Firebase onAuthStateChanged listener ──────────────
function AuthInit() {
  useAuthInit()
  return null
}

// ── 404 page ──────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center text-center px-8">
      <div>
        <div className="font-head font-black text-[96px] text-brand-orange leading-none">404</div>
        <div className="font-head text-2xl font-bold uppercase mb-6">Pagina niet gevonden</div>
        <a href="/" className="btn-primary">Terug naar Home</a>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInit />

        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>

            {/* ── Main layout: navbar + footer ── */}
            <Route element={<MainLayout />}>
              <Route index          element={<Home />} />
              <Route path="wec"     element={<WEC />} />
              <Route path="motogp"  element={<MotoGP />} />
              <Route path="gt3"     element={<GT3 />} />
              <Route path="imsa"    element={<IMSA />} />
              <Route path="f1"      element={<F1 />} />
              <Route path="worldsbk"element={<WorldSBK />} />
              <Route path="circuits"element={<Circuits />} />
              <Route path="teams"   element={<Teams />} />
              <Route path="kalender" element={<Kalender />} />

              {/* 🔒 Protected — login required */}
              <Route
                path="live"
                element={
                  <ProtectedRoute>
                    <LiveCenter />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ── Auth layout: clean, no navbar ── */}
            <Route element={<AuthLayout />}>
              <Route path="login"    element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
