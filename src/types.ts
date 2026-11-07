export type Lang = 'sq' | 'en'

export type SportId =
  | 'football'
  | 'tennis'
  | 'basketball'
  | 'swimming'
  | 'volleyball'
  | 'hockey'

export type SelectionKey = 'home' | 'draw' | 'away' | string

export interface OddsSelection {
  key: SelectionKey
  labelKey: string
  price: number
}

export interface Market {
  id: string
  nameKey: string
  selections: OddsSelection[]
}

export interface Match {
  id: string
  sport: SportId
  leagueKey: string
  homeKey: string
  awayKey: string
  homeScore: number
  awayScore: number
  minute: string
  status: 'live' | 'upcoming'
  markets: Market[]
}

export type OddsFlash = 'up' | 'down' | null

export type ViewMode = 'board' | 'api'

export interface FlashMap {
  [eventMarketSel: string]: OddsFlash
}
