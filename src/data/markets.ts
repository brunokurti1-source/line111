import type { Market, Match, SportId } from '../types'

function m1x2(h: number, d: number, a: number): Market {
  return {
    id: '1x2',
    nameKey: 'market1x2',
    selections: [
      { key: 'home', labelKey: 'home', price: h },
      { key: 'draw', labelKey: 'draw', price: d },
      { key: 'away', labelKey: 'away', price: a },
    ],
  }
}

function totals(line: number, over: number, under: number): Market {
  return {
    id: `ou-${line}`,
    nameKey: 'marketTotals',
    selections: [
      { key: `over-${line}`, labelKey: 'over', price: over },
      { key: `under-${line}`, labelKey: 'under', price: under },
    ],
  }
}

function btts(yes: number, no: number): Market {
  return {
    id: 'btts',
    nameKey: 'marketBtts',
    selections: [
      { key: 'yes', labelKey: 'yes', price: yes },
      { key: 'no', labelKey: 'no', price: no },
    ],
  }
}

function moneyline(
  h: number,
  a: number,
  nameKey: 'marketMoneyline' | 'marketSet' | 'marketWinner' = 'marketMoneyline',
): Market {
  return {
    id: 'ml',
    nameKey,
    selections: [
      { key: 'home', labelKey: 'home', price: h },
      { key: 'away', labelKey: 'away', price: a },
    ],
  }
}

/** Seed fair-ish opening prices from score differential (LINE111 consensus, not a book scrape). */
export function buildMarketsFor(sport: SportId, homeScore: number, awayScore: number): Market[] {
  const diff = homeScore - awayScore
  const tilt = Math.tanh(diff / 2) * 0.35

  if (sport === 'football' || sport === 'hockey') {
    const home = +(2.2 - tilt).toFixed(2)
    const away = +(2.2 + tilt).toFixed(2)
    const draw = +(3.2 + Math.abs(tilt) * 0.2).toFixed(2)
    return [m1x2(home, draw, away), totals(sport === 'hockey' ? 5.5 : 2.5, 1.9, 1.9), btts(1.75, 2.05)]
  }

  if (sport === 'tennis') {
    return [moneyline(+(1.85 - tilt * 0.4).toFixed(2), +(1.95 + tilt * 0.4).toFixed(2)), moneyline(1.8, 2.0, 'marketSet')]
  }

  if (sport === 'basketball') {
    return [
      moneyline(+(1.9 - tilt * 0.5).toFixed(2), +(1.9 + tilt * 0.5).toFixed(2)),
      {
        id: 'spread',
        nameKey: 'marketSpread',
        selections: [
          { key: 'home+3.5', labelKey: 'home', price: 1.91 },
          { key: 'away-3.5', labelKey: 'away', price: 1.91 },
        ],
      },
      totals(220.5, 1.9, 1.9),
    ]
  }

  return [moneyline(+(1.9 - tilt * 0.4).toFixed(2), +(1.9 + tilt * 0.4).toFixed(2), 'marketWinner')]
}

export function ensureMarkets(match: Omit<Match, 'markets'> & { markets?: Market[] }): Match {
  if (match.markets?.length) return match as Match
  return {
    ...match,
    markets: buildMarketsFor(match.sport, match.homeScore, match.awayScore),
  }
}
