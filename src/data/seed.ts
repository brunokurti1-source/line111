import type { Match, SportId } from '../types'

export const SPORTS: { id: SportId; icon: string }[] = [
  { id: 'football', icon: '⚽' },
  { id: 'tennis', icon: '🎾' },
  { id: 'basketball', icon: '🏀' },
  { id: 'swimming', icon: '🏊' },
  { id: 'volleyball', icon: '🏐' },
  { id: 'hockey', icon: '🏒' },
]

function m1x2(h: number, d: number, a: number) {
  return {
    id: '1x2',
    nameKey: 'market1x2' as const,
    selections: [
      { key: 'home' as const, labelKey: 'home' as const, price: h },
      { key: 'draw' as const, labelKey: 'draw' as const, price: d },
      { key: 'away' as const, labelKey: 'away' as const, price: a },
    ],
  }
}

function totals(line: number, over: number, under: number) {
  return {
    id: `ou-${line}`,
    nameKey: 'marketTotals' as const,
    selections: [
      { key: `over-${line}`, labelKey: 'over' as const, price: over },
      { key: `under-${line}`, labelKey: 'under' as const, price: under },
    ],
  }
}

function btts(yes: number, no: number) {
  return {
    id: 'btts',
    nameKey: 'marketBtts' as const,
    selections: [
      { key: 'yes', labelKey: 'yes' as const, price: yes },
      { key: 'no', labelKey: 'no' as const, price: no },
    ],
  }
}

function moneyline(h: number, a: number, nameKey: 'marketMoneyline' | 'marketSet' | 'marketWinner' = 'marketMoneyline') {
  return {
    id: 'ml',
    nameKey,
    selections: [
      { key: 'home' as const, labelKey: 'home' as const, price: h },
      { key: 'away' as const, labelKey: 'away' as const, price: a },
    ],
  }
}

export const SEED_MATCHES: Match[] = [
  {
    id: 'fb-milan-inter',
    sport: 'football',
    leagueKey: 'league_serie_a',
    homeKey: 'team_milan',
    awayKey: 'team_inter',
    homeScore: 1,
    awayScore: 1,
    minute: "67'",
    status: 'live',
    markets: [m1x2(2.45, 3.2, 2.9), totals(2.5, 1.85, 1.95), btts(1.72, 2.1)],
  },
  {
    id: 'fb-arsenal-liv',
    sport: 'football',
    leagueKey: 'league_epl',
    homeKey: 'team_arsenal',
    awayKey: 'team_liverpool',
    homeScore: 2,
    awayScore: 1,
    minute: "78'",
    status: 'live',
    markets: [m1x2(1.95, 3.6, 3.8), totals(3.5, 2.05, 1.75), btts(1.55, 2.4)],
  },
  {
    id: 'fb-barca-bayern',
    sport: 'football',
    leagueKey: 'league_ucl',
    homeKey: 'team_barca',
    awayKey: 'team_bayern',
    homeScore: 0,
    awayScore: 0,
    minute: "23'",
    status: 'live',
    markets: [m1x2(2.1, 3.5, 3.25), totals(2.5, 1.9, 1.9), btts(1.65, 2.2)],
  },
  {
    id: 'fb-napoli-juve',
    sport: 'football',
    leagueKey: 'league_serie_a',
    homeKey: 'team_napoli',
    awayKey: 'team_juve',
    homeScore: 0,
    awayScore: 0,
    minute: '20:00',
    status: 'upcoming',
    markets: [m1x2(2.3, 3.1, 3.15), totals(2.5, 2.0, 1.8)],
  },
  {
    id: 'tn-alcaraz-sinner',
    sport: 'tennis',
    leagueKey: 'league_atp',
    homeKey: 'team_alcaraz',
    awayKey: 'team_sinner',
    homeScore: 1,
    awayScore: 1,
    minute: 'S3',
    status: 'live',
    markets: [
      moneyline(1.85, 1.95),
      moneyline(1.7, 2.15, 'marketSet'),
    ],
  },
  {
    id: 'tn-swiatek-gauff',
    sport: 'tennis',
    leagueKey: 'league_wta',
    homeKey: 'team_swiatek',
    awayKey: 'team_gauff',
    homeScore: 1,
    awayScore: 0,
    minute: 'S2',
    status: 'live',
    markets: [moneyline(1.55, 2.45), moneyline(1.9, 1.9, 'marketSet')],
  },
  {
    id: 'bb-lakers-celtics',
    sport: 'basketball',
    leagueKey: 'league_nba',
    homeKey: 'team_lakers',
    awayKey: 'team_celtics',
    homeScore: 88,
    awayScore: 92,
    minute: 'Q4 4:12',
    status: 'live',
    markets: [
      moneyline(2.2, 1.7),
      {
        id: 'spread',
        nameKey: 'marketSpread',
        selections: [
          { key: 'home+3.5', labelKey: 'home', price: 1.91 },
          { key: 'away-3.5', labelKey: 'away', price: 1.91 },
        ],
      },
      totals(220.5, 1.88, 1.92),
    ],
  },
  {
    id: 'bb-real-oly',
    sport: 'basketball',
    leagueKey: 'league_euroleague',
    homeKey: 'team_real',
    awayKey: 'team_olympiacos',
    homeScore: 64,
    awayScore: 61,
    minute: 'Q3 2:40',
    status: 'live',
    markets: [moneyline(1.75, 2.1), totals(162.5, 1.86, 1.94)],
  },
  {
    id: 'sw-dressel-pop',
    sport: 'swimming',
    leagueKey: 'league_fina',
    homeKey: 'team_dressel',
    awayKey: 'team_popovici',
    homeScore: 0,
    awayScore: 0,
    minute: '100m Free',
    status: 'live',
    markets: [moneyline(1.95, 1.85, 'marketWinner')],
  },
  {
    id: 'sw-mck-led',
    sport: 'swimming',
    leagueKey: 'league_fina',
    homeKey: 'team_mckeown',
    awayKey: 'team_ledecky',
    homeScore: 0,
    awayScore: 0,
    minute: '400m Free',
    status: 'upcoming',
    markets: [moneyline(2.35, 1.6, 'marketWinner')],
  },
  {
    id: 'vb-perugia-kazan',
    sport: 'volleyball',
    leagueKey: 'league_cev',
    homeKey: 'team_perugia',
    awayKey: 'team_kazan',
    homeScore: 2,
    awayScore: 1,
    minute: 'S4',
    status: 'live',
    markets: [moneyline(1.65, 2.25), moneyline(1.8, 2.0, 'marketSet')],
  },
  {
    id: 'hk-rangers-bruins',
    sport: 'hockey',
    leagueKey: 'league_nhl',
    homeKey: 'team_rangers',
    awayKey: 'team_bruins',
    homeScore: 2,
    awayScore: 2,
    minute: 'P3 8:14',
    status: 'live',
    markets: [m1x2(2.6, 3.8, 2.35), totals(5.5, 1.9, 1.9)],
  },
]
