import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import type { FlashMap, Match, SportId } from '../types'
import { MatchDetail } from './MatchDetail'
import { MatchRow } from './MatchRow'
import { SportsNav } from './SportsNav'

interface Props {
  matches: Match[]
  flashes: FlashMap
  suspended: Record<string, Set<string>>
  alignment: Record<string, string>
  feedSource: 'espn' | 'seed' | 'loading'
}

export function LiveBoard({ matches, flashes, suspended, alignment, feedSource }: Props) {
  const { tr, switching } = useLanguage()
  const [sport, setSport] = useState<SportId | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedId || !matches.some((m) => m.id === selectedId)) {
      setSelectedId(matches.find((m) => m.status === 'live')?.id ?? matches[0]?.id ?? null)
    }
  }, [matches, selectedId])

  const counts = useMemo(() => {
    const c: Partial<Record<SportId | 'all', number>> = { all: matches.length }
    for (const m of matches) c[m.sport] = (c[m.sport] ?? 0) + 1
    return c
  }, [matches])

  const filtered = useMemo(
    () => (sport === 'all' ? matches : matches.filter((m) => m.sport === sport)),
    [matches, sport],
  )

  const live = filtered.filter((m) => m.status === 'live')
  const upcoming = filtered.filter((m) => m.status === 'upcoming')
  const selected = matches.find((m) => m.id === selectedId) ?? null

  const noteKey =
    feedSource === 'loading'
      ? 'demoNoteLoading'
      : feedSource === 'seed'
        ? 'demoNoteFallback'
        : 'demoNote'

  return (
    <div className="board-layout">
      <SportsNav active={sport} onSelect={setSport} counts={counts} />

      <div className="board-main">
        <section className={`match-list${switching ? ' lang-fade' : ''}`}>
          <header className="list-head">
            <h2>{tr('matchList')}</h2>
            <p className="demo-note">{tr(noteKey)}</p>
          </header>

          <div className="list-body">
            {live.map((m) => (
              <MatchRow
                key={m.id}
                match={m}
                selected={m.id === selectedId}
                onSelect={() => setSelectedId(m.id)}
                flashes={flashes}
                suspendedMarkets={suspended[m.id] ?? new Set()}
                aligned={Boolean(alignment[m.id])}
              />
            ))}
            {upcoming.length > 0 && (
              <>
                <h3 className="subhead">{tr('upcoming')}</h3>
                {upcoming.map((m) => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    selected={m.id === selectedId}
                    onSelect={() => setSelectedId(m.id)}
                    flashes={flashes}
                    suspendedMarkets={suspended[m.id] ?? new Set()}
                    aligned={Boolean(alignment[m.id])}
                  />
                ))}
              </>
            )}
          </div>
        </section>

        <MatchDetail
          match={selected}
          flashes={flashes}
          suspendedMarkets={selected ? suspended[selected.id] ?? new Set() : new Set()}
          alignment={selected ? alignment[selected.id] : undefined}
        />
      </div>
    </div>
  )
}
