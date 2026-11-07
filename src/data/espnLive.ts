import type { Match, SportId } from '../types'
import { ensureMarkets } from './markets'

interface EspnCompetitor {
  homeAway: 'home' | 'away'
  score?: string
  team: { displayName?: string; shortDisplayName?: string; name?: string }
}

interface EspnEvent {
  id: string
  name?: string
  season?: { slug?: string }
  competitions: Array<{
    status: {
      displayClock?: string
      period?: number
      type: { state?: string; detail?: string; shortDetail?: string }
    }
    competitors: EspnCompetitor[]
  }>
}

interface EspnBoard {
  leagues?: Array<{ name?: string }>
  events?: EspnEvent[]
}

const BOARDS: { sport: SportId; path: string }[] = [
  { sport: 'football', path: 'soccer/all/scoreboard' },
  { sport: 'football', path: 'soccer/eng.1/scoreboard' },
  { sport: 'football', path: 'soccer/esp.1/scoreboard' },
  { sport: 'football', path: 'soccer/ita.1/scoreboard' },
  { sport: 'football', path: 'soccer/ger.1/scoreboard' },
  { sport: 'football', path: 'soccer/uefa.champions/scoreboard' },
  { sport: 'basketball', path: 'basketball/nba/scoreboard' },
  { sport: 'tennis', path: 'tennis/atp/scoreboard' },
  { sport: 'tennis', path: 'tennis/wta/scoreboard' },
  { sport: 'hockey', path: 'hockey/nhl/scoreboard' },
]

function titleCaseSlug(slug?: string, fallback = 'Live'): string {
  if (!slug) return fallback
  return slug
    .replace(/^\d{4}(-\d{2})?-/, '')
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function mapStatus(state?: string): Match['status'] {
  if (state === 'in') return 'live'
  if (state === 'pre') return 'upcoming'
  return 'finished'
}

function mapEvent(sport: SportId, leagueFallback: string, e: EspnEvent): Match | null {
  const c = e.competitions?.[0]
  if (!c) return null
  const home = c.competitors.find((x) => x.homeAway === 'home')
  const away = c.competitors.find((x) => x.homeAway === 'away')
  if (!home || !away) return null

  const status = mapStatus(c.status?.type?.state)
  if (status === 'finished') return null

  const clock =
    c.status?.type?.shortDetail ||
    c.status?.displayClock ||
    c.status?.type?.detail ||
    '—'

  return ensureMarkets({
    id: `espn-${sport}-${e.id}`,
    sport,
    league: titleCaseSlug(e.season?.slug, leagueFallback),
    home: home.team.displayName || home.team.shortDisplayName || home.team.name || 'Home',
    away: away.team.displayName || away.team.shortDisplayName || away.team.name || 'Away',
    homeScore: Number(home.score ?? 0) || 0,
    awayScore: Number(away.score ?? 0) || 0,
    minute: clock,
    status,
    source: 'espn',
  })
}

async function fetchBoard(sport: SportId, path: string): Promise<Match[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${path}`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = (await res.json()) as EspnBoard
  const leagueFallback = data.leagues?.[0]?.name || 'Live'
  const out: Match[] = []
  for (const e of data.events ?? []) {
    const m = mapEvent(sport, leagueFallback, e)
    if (m) out.push(m)
  }
  return out
}

/** Prefer live, then upcoming; de-dupe by id. */
export async function fetchRealMatches(limit = 48): Promise<Match[]> {
  const batches = await Promise.allSettled(BOARDS.map((b) => fetchBoard(b.sport, b.path)))
  const byId = new Map<string, Match>()
  for (const batch of batches) {
    if (batch.status !== 'fulfilled') continue
    for (const m of batch.value) {
      if (!byId.has(m.id)) byId.set(m.id, m)
    }
  }

  const all = [...byId.values()]
  const live = all.filter((m) => m.status === 'live')
  const upcoming = all.filter((m) => m.status === 'upcoming')
  // Prefer live first
  const ordered = [...live, ...upcoming]
  return ordered.slice(0, limit)
}
