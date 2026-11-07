import { useEffect, useRef, useState } from 'react'
import { SEED_MATCHES } from '../data/seed'
import { LiveOddsFeed, type LiveEventState, type PriceTick } from '../odds/liveFeed'
import type { FlashMap, Match } from '../types'

export function useLiveOdds() {
  const feedRef = useRef<LiveOddsFeed | null>(null)
  const [matches, setMatches] = useState<Match[]>(SEED_MATCHES)
  const [suspended, setSuspended] = useState<Record<string, Set<string>>>({})
  const [flashes, setFlashes] = useState<FlashMap>({})
  const [tickCount, setTickCount] = useState(0)
  const [alignment, setAlignment] = useState<Record<string, string>>({})
  const [livePayload, setLivePayload] = useState<unknown>(null)
  const flashTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const feed = new LiveOddsFeed(SEED_MATCHES)
    feedRef.current = feed

    const unsub = feed.subscribe((states: LiveEventState[], ticks: PriceTick[], count) => {
      setMatches(states.map((s) => s.match))
      setTickCount(count)
      setLivePayload(feed.getLivePayload())

      const sus: Record<string, Set<string>> = {}
      const align: Record<string, string> = {}
      for (const s of states) {
        sus[s.match.id] = s.suspendedMarkets
        align[s.match.id] = s.alignment
      }
      setSuspended(sus)
      setAlignment(align)

      if (ticks.length) {
        setFlashes((prev) => {
          const next = { ...prev }
          for (const t of ticks) {
            const key = `${t.eventId}:${t.marketId}:${t.selectionKey}`
            next[key] = t.direction
            const existing = flashTimers.current.get(key)
            if (existing) clearTimeout(existing)
            flashTimers.current.set(
              key,
              setTimeout(() => {
                setFlashes((p) => {
                  const n = { ...p }
                  delete n[key]
                  return n
                })
              }, 650),
            )
          }
          return next
        })
      }
    })

    feed.start(1400)
    return () => {
      unsub()
      feed.stop()
      for (const t of flashTimers.current.values()) clearTimeout(t)
    }
  }, [])

  return {
    matches,
    suspended,
    flashes,
    tickCount,
    alignment,
    livePayload,
    getEvent: (id: string) => feedRef.current?.getEventPayload(id) ?? null,
  }
}
