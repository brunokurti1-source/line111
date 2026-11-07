import { useLanguage } from '../i18n/LanguageContext'
import type { DictKey } from '../i18n/translations'
import type { FlashMap, Match } from '../types'
import { OddsButton } from './OddsButton'

interface Props {
  match: Match | null
  flashes: FlashMap
  suspendedMarkets: Set<string>
  alignment?: string
}

export function MatchDetail({ match, flashes, suspendedMarkets, alignment }: Props) {
  const { tr, switching } = useLanguage()

  if (!match) {
    return (
      <aside className="match-detail empty">
        <p>{tr('selectMatch')}</p>
      </aside>
    )
  }

  return (
    <aside className={`match-detail${switching ? ' lang-fade' : ''}`}>
      <header className="detail-head">
        <div>
          <p className="detail-league">{tr(match.leagueKey as DictKey)}</p>
          <h2>
            {tr(match.homeKey as DictKey)}
            <span className="score">
              {match.homeScore} – {match.awayScore}
            </span>
            {tr(match.awayKey as DictKey)}
          </h2>
          <div className="detail-status">
            {match.status === 'live' ? (
              <span className="mini-live">
                <span className="live-dot" />
                {tr('live')} · {match.minute}
              </span>
            ) : (
              <span>
                {tr('upcoming')} · {match.minute}
              </span>
            )}
            {alignment ? <span className="align-badge">{tr('aligned')}</span> : null}
          </div>
        </div>
      </header>

      <h3 className="markets-title">{tr('markets')}</h3>
      <div className="markets-list">
        {match.markets.map((market) => {
          const sus = suspendedMarkets.has(market.id)
          return (
            <section key={market.id} className={`market-block${sus ? ' suspended' : ''}`}>
              <div className="market-head">
                <h4>{tr(market.nameKey as DictKey)}</h4>
                {sus ? <span className="sus-tag">{tr('suspended')}</span> : null}
              </div>
              <div className="market-sels">
                {market.selections.map((sel) => {
                  const flashKey = `${match.id}:${market.id}:${sel.key}`
                  const lineHint =
                    sel.key.includes('-') && (sel.key.startsWith('over') || sel.key.startsWith('under'))
                      ? sel.key.split('-')[1]
                      : sel.key.includes('+') || sel.key.includes('-')
                        ? sel.key.replace(/^(home|away)/, '')
                        : undefined
                  return (
                    <OddsButton
                      key={sel.key}
                      labelKey={sel.labelKey}
                      price={sel.price}
                      flash={flashes[flashKey] ?? null}
                      suspended={sus}
                      lineHint={lineHint}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </aside>
  )
}
