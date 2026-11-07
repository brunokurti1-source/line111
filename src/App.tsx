import { useEffect, useState } from 'react'
import { isAdminSession } from './auth/adminAuth'
import { AdminLogin } from './components/AdminLogin'
import { AdminPanel } from './components/AdminPanel'
import { ApiSurface } from './components/ApiSurface'
import { Header } from './components/Header'
import { LiveBoard } from './components/LiveBoard'
import { useLiveOdds } from './hooks/useLiveOdds'
import { usePath } from './hooks/usePath'
import { LanguageProvider } from './i18n/LanguageContext'
import type { ViewMode } from './types'

function Shell() {
  const { path, navigate } = usePath()
  const isAdminRoute = path === '/admin' || path.startsWith('/admin/')
  const [view, setView] = useState<ViewMode>('board')
  const [adminAuthed, setAdminAuthed] = useState(() => isAdminSession())
  const {
    matches,
    flashes,
    suspended,
    alignment,
    tickCount,
    livePayload,
    nudgePrice,
    toggleSuspend,
  } = useLiveOdds()

  useEffect(() => {
    if (isAdminRoute) setAdminAuthed(isAdminSession())
  }, [isAdminRoute])

  function goBoard() {
    navigate('/')
    setView('board')
  }

  function onView(next: ViewMode) {
    if (path !== '/') navigate('/')
    setView(next)
  }

  return (
    <div className="app-shell">
      <div className="atmosphere" aria-hidden />
      <Header
        view={isAdminRoute ? 'admin' : view}
        onView={onView}
        onAdmin={() => navigate('/admin')}
        tickCount={tickCount}
      />
      <main>
        {isAdminRoute ? (
          adminAuthed ? (
            <AdminPanel
              matches={matches}
              suspended={suspended}
              onBack={goBoard}
              onLogout={() => setAdminAuthed(false)}
              onNudgePrice={nudgePrice}
              onToggleSuspend={toggleSuspend}
            />
          ) : (
            <AdminLogin onSuccess={() => setAdminAuthed(true)} onBack={goBoard} />
          )
        ) : view === 'board' ? (
          <LiveBoard
            matches={matches}
            flashes={flashes}
            suspended={suspended}
            alignment={alignment}
          />
        ) : (
          <ApiSurface livePayload={livePayload} />
        )}
      </main>
      <footer className="site-foot">
        <span>LINE111</span>
        <span>·</span>
        <span>Odds provider</span>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  )
}
