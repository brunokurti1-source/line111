import type { Match, Market, OddsSelection } from '../types'
import {
  applyMargin,
  calibrateToConsensus,
  defaultAdapter,
  impliedProbs,
  roundPrice,
  type OddsFeedAdapter,
  type ConsensusSnapshot,
} from './consensus'

export type TickDirection = 'up' | 'down' | null

export interface PriceTick {
  eventId: string
  marketId: string
  selectionKey: string
  price: number
  prev: number
  direction: TickDirection
  suspended: boolean
  ts: string
}

export interface LiveEventState {
  match: Match
  suspendedMarkets: Set<string>
  consensus: ConsensusSnapshot | null
  alignment: 'consensus' | 'engine' | 'hybrid'
}

export type LiveListener = (state: LiveEventState[], ticks: PriceTick[], tickCount: number) => void

function cloneMatch(m: Match): Match {
  return {
    ...m,
    markets: m.markets.map((mk) => ({
      ...mk,
      selections: mk.selections.map((s) => ({ ...s })),
    })),
  }
}

function bumpClock(match: Match): void {
  if (match.status !== 'live') return
  if (match.sport === 'football') {
    const n = parseInt(match.minute, 10)
    if (!Number.isNaN(n) && n < 90) {
      match.minute = `${n + (Math.random() < 0.35 ? 1 : 0)}'`
    }
  }
  // occasional score tick for football / hockey / basketball
  if (Math.random() < 0.04) {
    if (Math.random() < 0.5) match.homeScore += 1
    else match.awayScore += 1
    // suspend 1x2 briefly on goal
    // handled by caller via suspendMarket
  }
}

function fairFromSelections(sels: OddsSelection[]): Record<string, number> {
  const prices: Record<string, number> = {}
  for (const s of sels) prices[s.key] = s.price
  const raw = impliedProbs(prices)
  const sum = Object.values(raw).reduce((a, b) => a + b, 0)
  const fair: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw)) fair[k] = v / sum
  return fair
}

function shockFair(fair: Record<string, number>, match: Match): Record<string, number> {
  const next = { ...fair }
  const keys = Object.keys(next)
  if (keys.length === 0) return next

  // Prefer home/away bias from score differential for 1x2-like markets
  if (keys.includes('home') && keys.includes('away')) {
    const diff = match.homeScore - match.awayScore
    const bias = Math.tanh(diff / 3) * 0.03
    next.home = Math.max(0.05, next.home + bias)
    next.away = Math.max(0.05, next.away - bias)
    if (next.draw != null) next.draw = Math.max(0.05, next.draw - Math.abs(bias) * 0.4)
  }

  // Random micro-drift
  for (const k of keys) {
    next[k] = Math.max(0.02, next[k] * (1 + (Math.random() - 0.5) * 0.04))
  }
  const sum = keys.reduce((s, k) => s + next[k], 0)
  for (const k of keys) next[k] /= sum
  return next
}

export class LiveOddsFeed {
  private states: LiveEventState[] = []
  private listeners = new Set<LiveListener>()
  private timer: ReturnType<typeof setInterval> | null = null
  private tickCount = 0
  private adapter: OddsFeedAdapter
  private recentGoalSuspendUntil = new Map<string, number>()

  constructor(
    seed: Match[],
    adapter: OddsFeedAdapter = defaultAdapter,
  ) {
    this.adapter = adapter
    this.states = seed.map((m) => ({
      match: cloneMatch(m),
      suspendedMarkets: new Set<string>(),
      consensus: null,
      alignment: 'hybrid' as const,
    }))
  }

  async warmConsensus(): Promise<void> {
    await Promise.all(
      this.states.map(async (st) => {
        st.consensus = await this.adapter.fetchConsensus(st.match.id)
        if (st.consensus) {
          for (const market of st.match.markets) {
            const engine = Object.fromEntries(market.selections.map((s) => [s.key, s.price]))
            const calibrated = calibrateToConsensus(engine, st.consensus, 0.9)
            for (const sel of market.selections) {
              if (calibrated[sel.key] != null) sel.price = calibrated[sel.key]
            }
          }
          st.alignment = 'hybrid'
        } else {
          st.alignment = 'engine'
        }
      }),
    )
    this.emit([])
  }

  start(intervalMs = 1400): void {
    if (this.timer) return
    void this.warmConsensus()
    this.timer = setInterval(() => this.tick(), intervalMs)
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }

  subscribe(fn: LiveListener): () => void {
    this.listeners.add(fn)
    fn(this.snapshot(), [], this.tickCount)
    return () => this.listeners.delete(fn)
  }

  getTickCount(): number {
    return this.tickCount
  }

  /** Simulated REST: GET /v1/live */
  getLivePayload() {
    return {
      provider: 'LINE111',
      channel: '/v1/live',
      tick: this.tickCount,
      ts: new Date().toISOString(),
      events: this.states
        .filter((s) => s.match.status === 'live')
        .map((s) => this.serializeEvent(s)),
    }
  }

  /** Simulated REST: GET /v1/events/:id */
  getEventPayload(id: string) {
    const st = this.states.find((s) => s.match.id === id)
    if (!st) return null
    return this.serializeEvent(st)
  }

  /** Admin: nudge a selection price (demo). */
  nudgePrice(eventId: string, marketId: string, selectionKey: string, delta: number): void {
    const st = this.states.find((s) => s.match.id === eventId)
    if (!st) return
    const market = st.match.markets.find((m) => m.id === marketId)
    const sel = market?.selections.find((s) => s.key === selectionKey)
    if (!sel) return
    const prev = sel.price
    sel.price = roundPrice(Math.max(1.01, prev + delta))
    this.emit([
      {
        eventId,
        marketId,
        selectionKey,
        price: sel.price,
        prev,
        direction: sel.price > prev ? 'up' : sel.price < prev ? 'down' : null,
        suspended: st.suspendedMarkets.has(marketId),
        ts: new Date().toISOString(),
      },
    ])
  }

  /** Admin: toggle durable market suspension (demo). */
  toggleSuspend(eventId: string, marketId: string): void {
    const st = this.states.find((s) => s.match.id === eventId)
    if (!st) return
    if (st.suspendedMarkets.has(marketId)) st.suspendedMarkets.delete(marketId)
    else st.suspendedMarkets.add(marketId)
    this.emit([])
  }

  private serializeEvent(st: LiveEventState) {
    const m = st.match
    return {
      id: m.id,
      sport: m.sport,
      status: m.status,
      clock: m.minute,
      score: { home: m.homeScore, away: m.awayScore },
      alignment: st.alignment,
      consensus_source: st.consensus?.source ?? null,
      markets: m.markets.map((mk) => ({
        id: mk.id,
        suspended: st.suspendedMarkets.has(mk.id) || this.isTempSuspended(m.id, mk.id),
        selections: mk.selections.map((s) => ({
          key: s.key,
          price: s.price,
        })),
      })),
    }
  }

  private isTempSuspended(eventId: string, marketId: string): boolean {
    const until = this.recentGoalSuspendUntil.get(`${eventId}:${marketId}`)
    return until != null && Date.now() < until
  }

  private snapshot(): LiveEventState[] {
    return this.states.map((s) => ({
      match: cloneMatch(s.match),
      suspendedMarkets: new Set(
        [...s.suspendedMarkets].concat(
          s.match.markets
            .filter((mk) => this.isTempSuspended(s.match.id, mk.id))
            .map((mk) => mk.id),
        ),
      ),
      consensus: s.consensus,
      alignment: s.alignment,
    }))
  }

  private emit(ticks: PriceTick[]): void {
    const snap = this.snapshot()
    for (const fn of this.listeners) fn(snap, ticks, this.tickCount)
  }

  private tick(): void {
    this.tickCount += 1
    const ticks: PriceTick[] = []
    const now = Date.now()

    for (const st of this.states) {
      if (st.match.status !== 'live') continue

      const prevScores = { h: st.match.homeScore, a: st.match.awayScore }
      bumpClock(st.match)
      const scored = st.match.homeScore !== prevScores.h || st.match.awayScore !== prevScores.a
      if (scored) {
        // suspend primary markets briefly on score change
        for (const mk of st.match.markets.slice(0, 2)) {
          this.recentGoalSuspendUntil.set(`${st.match.id}:${mk.id}`, now + 2800)
        }
      }

      // random brief suspension (~3%)
      if (!scored && Math.random() < 0.03) {
        const mk = st.match.markets[Math.floor(Math.random() * st.match.markets.length)]
        if (mk) this.recentGoalSuspendUntil.set(`${st.match.id}:${mk.id}`, now + 2000)
      }

      for (const market of st.match.markets) {
        if (st.suspendedMarkets.has(market.id)) continue
        if (this.isTempSuspended(st.match.id, market.id)) continue
        this.retickMarket(st, market, ticks)
      }
    }

    this.emit(ticks)
  }

  private retickMarket(st: LiveEventState, market: Market, ticks: PriceTick[]): void {
    const fair = shockFair(fairFromSelections(market.selections), st.match)
    let priced = applyMargin(fair, 1.05)
    priced = calibrateToConsensus(priced, st.consensus, 0.55)

    for (const sel of market.selections) {
      const next = priced[sel.key]
      if (next == null) continue
      // soft clamp move size
      const prev = sel.price
      let price = next
      const maxMove = prev * 0.06
      if (price > prev + maxMove) price = roundPrice(prev + maxMove)
      if (price < prev - maxMove) price = roundPrice(prev - maxMove)
      price = roundPrice(price)
      if (price === prev) continue
      sel.price = price
      ticks.push({
        eventId: st.match.id,
        marketId: market.id,
        selectionKey: sel.key,
        price,
        prev,
        direction: price > prev ? 'up' : 'down',
        suspended: false,
        ts: new Date().toISOString(),
      })
    }
  }
}
