import { useLanguage } from '../i18n/LanguageContext'
import type { FlashMap, Match } from '../types'
import { OddsButton } from './OddsButton'

interface Props {
  match: Match
  selected: boolean
  onSelect: () => void
  flashes: FlashMap
  suspendedMarkets: Set<string>
  aligned?: boolean
}

export function MatchRow({
  match,
  selected,
  onSelect,
  flashes,
  suspendedMarkets,
  aligned,
}: Props) {
  const { tr } = useLanguage()
  const primary = match.markets[0]
  const primarySuspended = primary ? suspendedMarkets.has(primary.id) : false

  return (
    <article
      className={`match-row${selected ? ' selected' : ''}${match.status === 'live' ? ' is-live' : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
    >
      <div className="match-meta">
        <div className="match-league">
          {match.status === 'live' ? (
            <span className="mini-live">
              <span className="live-dot" />
              {tr('live')}
            </span>
          ) : (
            <span className="mini-up">{tr('upcoming')}</span>
          )}
          <span>{match.league}</span>
          {aligned ? <span className="align-badge">{tr('aligned')}</span> : null}
        </div>
        <div className="match-teams">
          <div className="team">
            <span>{match.home}</span>
            <strong>{match.homeScore}</strong>
          </div>
          <div className="team">
            <span>{match.away}</span>
            <strong>{match.awayScore}</strong>
          </div>
        </div>
        <div className="match-clock">{match.minute}</div>
      </div>

      <div className="match-odds" onClick={(e) => e.stopPropagation()}>
        {primary?.selections.map((sel) => {
          const flashKey = `${match.id}:${primary.id}:${sel.key}`
          const lineHint =
            sel.key.startsWith('over-') || sel.key.startsWith('under-')
              ? sel.key.split('-')[1]
              : undefined
          return (
            <OddsButton
              key={sel.key}
              labelKey={sel.labelKey}
              price={sel.price}
              flash={flashes[flashKey] ?? null}
              suspended={primarySuspended}
              lineHint={lineHint}
            />
          )
        })}
      </div>
    </article>
  )
}
