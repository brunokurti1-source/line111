/**
 * LINE111 consensus engine — produces book-aligned coefficients without scraping.
 *
 * Pipeline:
 *   1. Fair probabilities (from seed / model / licensed adapter)
 *   2. Apply overround (book margin) → published prices
 *   3. Optional calibration toward a known market snapshot (public sample or licensed)
 *   4. Live drift: score/clock shocks + mean-reversion toward consensus
 *
 * Legal note: we do NOT scrape bet365 or other books. A licensed feed plugs in
 * via OddsFeedAdapter when the provider has a commercial contract.
 */

export type FairVector = Record<string, number>

export interface ConsensusSnapshot {
  source: 'seed' | 'public-sample' | 'licensed' | 'model'
  label: string
  /** Selection key → consensus decimal price (already margined market level) */
  prices: Record<string, number>
  capturedAt: string
}

export interface OddsFeedAdapter {
  id: string
  label: string
  licensed: boolean
  /** Fetch consensus / raw prices for an event. Returns null if offline. */
  fetchConsensus(eventId: string): Promise<ConsensusSnapshot | null>
}

/** Convert fair probs to decimal odds with overround (e.g. 1.05 = 5% margin). */
export function applyMargin(fair: FairVector, overround = 1.05): Record<string, number> {
  const keys = Object.keys(fair)
  const sum = keys.reduce((s, k) => s + fair[k], 0)
  const normalized: FairVector = {}
  for (const k of keys) normalized[k] = fair[k] / sum

  const scaledSum = overround
  const out: Record<string, number> = {}
  for (const k of keys) {
    const implied = normalized[k] * scaledSum
    out[k] = roundPrice(1 / implied)
  }
  return out
}

/** Blend engine prices toward a consensus market snapshot (0 = ignore, 1 = mirror). */
export function calibrateToConsensus(
  enginePrices: Record<string, number>,
  consensus: ConsensusSnapshot | null,
  weight = 0.85,
): Record<string, number> {
  if (!consensus) return { ...enginePrices }
  const out: Record<string, number> = {}
  for (const key of Object.keys(enginePrices)) {
    const c = consensus.prices[key]
    if (c == null) {
      out[key] = enginePrices[key]
      continue
    }
    out[key] = roundPrice(enginePrices[key] * (1 - weight) + c * weight)
  }
  return out
}

export function roundPrice(n: number): number {
  if (n < 1.01) return 1.01
  if (n >= 10) return Math.round(n * 10) / 10
  return Math.round(n * 100) / 100
}

/** Invert decimal prices → implied probs (raw, before renormalize). */
export function impliedProbs(prices: Record<string, number>): FairVector {
  const out: FairVector = {}
  for (const [k, p] of Object.entries(prices)) out[k] = 1 / p
  return out
}

/**
 * Demo public-sample adapter: static “market levels” that mimic typical book
 * consensus for seeded events. Replace with a licensed HTTP/WS client later.
 */
export class PublicSampleAdapter implements OddsFeedAdapter {
  id = 'public-sample'
  label = 'Public sample snapshot (demo)'
  licensed = false

  private readonly table: Record<string, Record<string, number>> = {
    'fb-milan-inter': { home: 2.4, draw: 3.25, away: 2.95, 'over-2.5': 1.88, 'under-2.5': 1.98, yes: 1.7, no: 2.15 },
    'fb-arsenal-liv': { home: 1.98, draw: 3.55, away: 3.7, 'over-3.5': 2.0, 'under-3.5': 1.8, yes: 1.52, no: 2.45 },
    'fb-barca-bayern': { home: 2.15, draw: 3.45, away: 3.2, 'over-2.5': 1.92, 'under-2.5': 1.92, yes: 1.62, no: 2.25 },
    'tn-alcaraz-sinner': { home: 1.88, away: 1.92 },
    'bb-lakers-celtics': { home: 2.15, away: 1.72 },
  }

  async fetchConsensus(eventId: string): Promise<ConsensusSnapshot | null> {
    const prices = this.table[eventId]
    if (!prices) return null
    return {
      source: 'public-sample',
      label: 'Demo consensus snapshot',
      prices,
      capturedAt: new Date().toISOString(),
    }
  }
}

/**
 * Stub for a future commercial feed (Sportradar, Genius, OddsJam wholesale, etc.).
 * Throws until the provider wires a real contract + credentials.
 */
export class LicensedFeedAdapter implements OddsFeedAdapter {
  id = 'licensed'
  label = 'Licensed wholesale feed (adapter stub)'
  licensed = true
  private readonly endpoint?: string

  constructor(endpoint?: string) {
    this.endpoint = endpoint
  }

  async fetchConsensus(_eventId: string): Promise<ConsensusSnapshot | null> {
    if (!this.endpoint) return null
    // When contracted: GET/WS licensed snapshot → map to ConsensusSnapshot
    return null
  }
}

export const defaultAdapter: OddsFeedAdapter = new PublicSampleAdapter()
export const licensedStub: OddsFeedAdapter = new LicensedFeedAdapter()
