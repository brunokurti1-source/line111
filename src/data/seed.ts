import type { Match, SportId } from '../types'
import { buildMarketsFor } from './markets'

export const SPORTS: { id: SportId; icon: string }[] = [
  { id: 'football', icon: '⚽' },
  { id: 'tennis', icon: '🎾' },
  { id: 'basketball', icon: '🏀' },
  { id: 'swimming', icon: '🏊' },
  { id: 'volleyball', icon: '🏐' },
  { id: 'hockey', icon: '🏒' },
]

/** Offline fallback only — used if the live public scoreboard is unreachable. */
export const SEED_MATCHES: Match[] = [
  {
    id: 'seed-fb-1',
    sport: 'football',
    league: 'Demo League',
    home: 'Home FC',
    away: 'Away United',
    homeScore: 1,
    awayScore: 1,
    minute: "67'",
    status: 'live',
    source: 'seed',
    markets: buildMarketsFor('football', 1, 1),
  },
]
