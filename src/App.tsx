import { useState } from 'react'
import { ApiSurface } from './components/ApiSurface'
import { Header } from './components/Header'
import { LiveBoard } from './components/LiveBoard'
import { useLiveOdds } from './hooks/useLiveOdds'
import { LanguageProvider } from './i18n/LanguageContext'
import type { ViewMode } from './types'

function Shell() {
  const [view, setView] = useState<ViewMode>('board')
  const { matches, flashes, suspended, alignment, tickCount, livePayload } = useLiveOdds()

  return (
    <div className="app-shell">
      <div className="atmosphere" aria-hidden />
      <Header view={view} onView={setView} tickCount={tickCount} />
      <main>
        {view === 'board' ? (
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
        <span>Bruno Kurti · Odds provider</span>
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
