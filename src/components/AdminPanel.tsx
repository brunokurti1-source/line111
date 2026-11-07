import { useMemo, useState } from 'react'
import { adminLogout } from '../auth/adminAuth'
import { useLanguage } from '../i18n/LanguageContext'
import type { DictKey } from '../i18n/translations'
import type { Match } from '../types'
// DictKey still used for market/selection labels

interface Props {
  matches: Match[]
  onLogout: () => void
  onBack: () => void
  onNudgePrice: (eventId: string, marketId: string, selectionKey: string, delta: number) => void
  onToggleSuspend: (eventId: string, marketId: string) => void
  suspended: Record<string, Set<string>>
}

const DEMO_KEYS = [
  { id: 'lk_live_demo_starter', tier: 'Starter', status: 'active' },
  { id: 'lk_live_demo_pro', tier: 'Pro', status: 'active' },
  { id: 'lk_live_demo_enterprise', tier: 'Enterprise', status: 'pending' },
]

export function AdminPanel({
  matches,
  onLogout,
  onBack,
  onNudgePrice,
  onToggleSuspend,
  suspended,
}: Props) {
  const { tr, switching } = useLanguage()
  const [tab, setTab] = useState<'events' | 'keys'>('events')

  const liveCount = useMemo(
    () => matches.filter((m) => m.status === 'live').length,
    [matches],
  )

  return (
    <div className={`admin-panel${switching ? ' lang-fade' : ''}`}>
      <header className="admin-panel-head">
        <div>
          <p className="provider-badge">{tr('adminBadge')}</p>
          <h1>{tr('adminDashTitle')}</h1>
          <p className="admin-sub">
            {liveCount} {tr('live')} · {matches.length} {tr('adminEvents')}
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-ghost" onClick={onBack}>
            {tr('boardNav')}
          </button>
          <button
            type="button"
            className="admin-ghost danger"
            onClick={() => {
              adminLogout()
              onLogout()
            }}
          >
            {tr('adminLogout')}
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'events' ? 'active' : ''}
          onClick={() => setTab('events')}
        >
          {tr('adminEvents')}
        </button>
        <button
          type="button"
          className={tab === 'keys' ? 'active' : ''}
          onClick={() => setTab('keys')}
        >
          {tr('adminKeys')}
        </button>
      </div>

      {tab === 'events' ? (
        <div className="admin-table-wrap">
          <p className="admin-hint">{tr('adminEventsHint')}</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{tr('adminEvent')}</th>
                <th>{tr('adminClock')}</th>
                <th>{tr('adminPrimaryOdds')}</th>
                <th>{tr('adminControls')}</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => {
                const primary = m.markets[0]
                const sus = primary ? suspended[m.id]?.has(primary.id) : false
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="admin-event-cell">
                        <span className={m.status === 'live' ? 'mini-live' : 'mini-up'}>
                          {m.status === 'live' ? tr('live') : tr('upcoming')}
                        </span>
                        <strong>
                          {m.home} {m.homeScore}–{m.awayScore} {m.away}
                        </strong>
                        <span className="muted">{m.league}</span>
                      </div>
                    </td>
                    <td className="mono">{m.minute}</td>
                    <td>
                      <div className="admin-odds-row">
                        {primary?.selections.map((sel) => (
                          <div key={sel.key} className="admin-odd-chip">
                            <span>{tr(sel.labelKey as DictKey)}</span>
                            <strong>{sel.price.toFixed(2)}</strong>
                            <div className="nudge">
                              <button
                                type="button"
                                aria-label="-"
                                onClick={() =>
                                  onNudgePrice(m.id, primary.id, sel.key, -0.05)
                                }
                              >
                                −
                              </button>
                              <button
                                type="button"
                                aria-label="+"
                                onClick={() =>
                                  onNudgePrice(m.id, primary.id, sel.key, 0.05)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      {primary ? (
                        <button
                          type="button"
                          className={`admin-ghost${sus ? ' warn' : ''}`}
                          onClick={() => onToggleSuspend(m.id, primary.id)}
                        >
                          {sus ? tr('adminResume') : tr('adminSuspend')}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-keys">
          <p className="admin-hint">{tr('adminKeysHint')}</p>
          <ul className="key-list">
            {DEMO_KEYS.map((k) => (
              <li key={k.id}>
                <code>{k.id}</code>
                <span>{k.tier}</span>
                <span className={`key-status ${k.status}`}>
                  {k.status === 'active' ? tr('adminKeyActive') : tr('adminKeyPending')}
                </span>
              </li>
            ))}
          </ul>
          <section className="admin-contract-tease">
            <h2>{tr('apiPricing')}</h2>
            <p>{tr('apiPricingBody')}</p>
          </section>
        </div>
      )}
    </div>
  )
}
