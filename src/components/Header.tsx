import { useLanguage } from '../i18n/LanguageContext'
import type { ViewMode } from '../types'

interface Props {
  view: ViewMode
  onView: (v: ViewMode) => void
  tickCount: number
}

export function Header({ view, onView, tickCount }: Props) {
  const { lang, setLang, tr, switching } = useLanguage()

  return (
    <header className="topbar">
      <div className="brand-block">
        <a href="#board" className="brand" onClick={() => onView('board')}>
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">LINE<span>111</span></span>
        </a>
        <p className={`brand-tag${switching ? ' lang-fade' : ''}`}>{tr('brandTag')}</p>
      </div>

      <nav className="view-nav" aria-label="Primary">
        <button
          type="button"
          className={view === 'board' ? 'active' : ''}
          onClick={() => onView('board')}
        >
          {tr('boardNav')}
        </button>
        <button
          type="button"
          className={view === 'api' ? 'active' : ''}
          onClick={() => onView('api')}
        >
          {tr('apiNav')}
        </button>
      </nav>

      <div className="topbar-meta">
        <div className="live-pill" title={tr('feedStatus')}>
          <span className="live-dot" aria-hidden />
          <span>{tr('feedStatus')}</span>
          <span className="tick-count">
            {tickCount} {tr('ticks')}
          </span>
        </div>

        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'sq' ? 'active' : ''}
            onClick={() => setLang('sq')}
          >
            SQ
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  )
}
