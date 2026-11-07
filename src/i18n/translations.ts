import type { Lang } from '../types'

const dict = {
  brandTag: {
    sq: 'Linjat live · API për kazino',
    en: 'Live lines · Casino-grade API',
  },
  live: { sq: 'Live', en: 'Live' },
  upcoming: { sq: 'Së shpejti', en: 'Upcoming' },
  sports: { sq: 'Sportet', en: 'Sports' },
  allSports: { sq: 'Të gjitha', en: 'All' },
  football: { sq: 'Futboll', en: 'Football' },
  tennis: { sq: 'Tenis', en: 'Tennis' },
  basketball: { sq: 'Basketboll', en: 'Basketball' },
  swimming: { sq: 'Not', en: 'Swimming' },
  volleyball: { sq: 'Volejboll', en: 'Volleyball' },
  hockey: { sq: 'Hokej', en: 'Hockey' },
  matchList: { sq: 'Ndeshjet live', en: 'Live matches' },
  markets: { sq: 'Tregjet', en: 'Markets' },
  selectMatch: {
    sq: 'Zgjidh një ndeshje për tregjet',
    en: 'Select a match to view markets',
  },
  home: { sq: '1', en: '1' },
  draw: { sq: 'X', en: 'X' },
  away: { sq: '2', en: '2' },
  over: { sq: 'Mbi', en: 'Over' },
  under: { sq: 'Nën', en: 'Under' },
  yes: { sq: 'Po', en: 'Yes' },
  no: { sq: 'Jo', en: 'No' },
  market1x2: { sq: 'Rezultati final', en: 'Full time result' },
  marketTotals: { sq: 'Golat total', en: 'Total goals' },
  marketBtts: { sq: 'Të dy shënojnë', en: 'Both teams to score' },
  marketMoneyline: { sq: 'Fituesi', en: 'Moneyline' },
  marketSet: { sq: 'Fituesi i setit', en: 'Set winner' },
  marketSpread: { sq: 'Handikapi', en: 'Spread' },
  marketWinner: { sq: 'Fituesi i garës', en: 'Race winner' },
  apiNav: { sq: 'API për kazino', en: 'Casino API' },
  boardNav: { sq: 'Sportsbook', en: 'Sportsbook' },
  apiHero: {
    sq: 'Odds API nga LINE111',
    en: 'Odds API by LINE111',
  },
  apiSub: {
    sq: 'Kazino dhe operatorë blejnë kontrata LINE111 — jo ushqim nga burime të treta. Linja live, të bardha për white-label.',
    en: 'Casinos and operators buy LINE111 contracts — not a third-party consumer feed. Live lines, white-label ready.',
  },
  apiAuth: { sq: 'Autentifikimi', en: 'Authentication' },
  apiAuthHint: {
    sq: 'Vendos çelësin e kontratës në header. Placeholder demo — pa sekret real.',
    en: 'Pass your contract key in the header. Demo placeholder — no real secret.',
  },
  apiEndpoints: { sq: 'Endpoint-e shembull', en: 'Sample endpoints' },
  apiPricing: { sq: 'Kontrata & çmime', en: 'Contracts & pricing' },
  apiPricingBody: {
    sq: 'Starter · Pro · Enterprise. Volume i ndeshjeve live, vonesë <150ms, SLA 99.9%, white-label SDK. Kontaktoni për ofertë.',
    en: 'Starter · Pro · Enterprise. Live match volume, <150ms lag, 99.9% SLA, white-label SDK. Contact for a quote.',
  },
  apiSample: { sq: 'Shembull JSON', en: 'JSON sample' },
  apiCopy: { sq: 'Kopjo', en: 'Copy' },
  apiCopied: { sq: 'U kopjua', en: 'Copied' },
  providerBadge: { sq: 'Ofrues odds', en: 'Odds provider' },
  demoNote: {
    sq: 'Skorë reale live (scoreboard publik). Odds LINE111 (konsensus) — jo scraping librash.',
    en: 'Real live scores (public scoreboard). LINE111 consensus odds — not book scraping.',
  },
  demoNoteLoading: {
    sq: 'Duke ngarkuar ndeshjet reale…',
    en: 'Loading real matches…',
  },
  demoNoteFallback: {
    sq: 'Scoreboard i jashtëm i paarritshëm — fallback demo.',
    en: 'External scoreboard unreachable — demo fallback.',
  },
  feedStatus: { sq: 'Feed live', en: 'Live feed' },
  ticks: { sq: 'përditësime', en: 'ticks' },
  embedHint: {
    sq: 'Struktura e bardhë për embed / white-label — pa wallet ose cashier.',
    en: 'White-label friendly structure — no wallet or cashier.',
  },
  suspended: { sq: 'Pezulluar', en: 'Suspended' },
  aligned: { sq: 'I përputhur me tregun', en: 'Market-aligned' },
  consensusTitle: {
    sq: 'Si përputhemi me librat e tjerë',
    en: 'How we match other books',
  },
  consensusBody: {
    sq: 'Motor konsensusi: probabilitet i drejtë + marzh → kalibrim drejt snapshot-it të tregut. Demo përdor mostra publike, jo scraping. Me kontratë të licencuar lidhet adapteri wholesale.',
    en: 'Consensus engine: fair probability + margin → calibrate toward a market snapshot. Demo uses public samples, not scraping. A licensed wholesale adapter plugs in when contracted.',
  },
  legalNote: {
    sq: 'Nuk gërryejmë bet365 ose libra të tjerë. Pa licencë tregtare nuk riprodhojmë çmime të mbrojtura.',
    en: 'We do not scrape bet365 or other books. Without a commercial license we do not reproduce protected price feeds.',
  },
  liveEndpoint: { sq: 'Live REST + WebSocket', en: 'Live REST + WebSocket' },
  liveEndpointHint: {
    sq: 'GET /v1/live · WS /v1/stream — ticks, pezullime, skor/orë.',
    en: 'GET /v1/live · WS /v1/stream — ticks, suspensions, score/clock.',
  },
  adapterTitle: { sq: 'Adapter i licencuar (më vonë)', en: 'Licensed adapter (later)' },
  adapterBody: {
    sq: 'OddsFeedAdapter → LicensedFeedAdapter. Sportradar / Genius / wholesale. Demo: PublicSampleAdapter.',
    en: 'OddsFeedAdapter → LicensedFeedAdapter. Sportradar / Genius / wholesale. Demo: PublicSampleAdapter.',
  },
  liveTickJson: { sq: 'Tick live (WS)', en: 'Live tick (WS)' },
  architecture: { sq: 'Arkitektura', en: 'Architecture' },
  adminNav: { sq: 'Admin', en: 'Admin' },
  adminBadge: { sq: 'Hyrje admin', en: 'Admin access' },
  adminLoginTitle: { sq: 'Hyrje në panelin admin', en: 'Admin panel sign-in' },
  adminLoginSub: {
    sq: 'Demo — kredencialet shfaqen më poshtë. Nuk është autentifikim i vërtetë.',
    en: 'Demo — credentials are shown below. Not real authentication.',
  },
  adminDemoCreds: { sq: 'Kredencialet demo', en: 'Demo credentials' },
  adminUser: { sq: 'Përdoruesi', en: 'Username' },
  adminPass: { sq: 'Fjalëkalimi', en: 'Password' },
  adminSignIn: { sq: 'Hyr', en: 'Sign in' },
  adminLoginError: {
    sq: 'Përdorues ose fjalëkalim i gabuar.',
    en: 'Wrong username or password.',
  },
  adminDashTitle: { sq: 'Paneli admin LINE111', en: 'LINE111 admin panel' },
  adminLogout: { sq: 'Dil', en: 'Log out' },
  adminEvents: { sq: 'Ndeshjet', en: 'Events' },
  adminKeys: { sq: 'Çelësa API', en: 'API keys' },
  adminEventsHint: {
    sq: 'Ndrysho koeficientet mock ose pezullo tregjet — ndryshimet shfaqen në sportsbook.',
    en: 'Nudge mock prices or suspend markets — changes show on the sportsbook.',
  },
  adminKeysHint: {
    sq: 'Çelësa demo për kontrata kazino (placeholder).',
    en: 'Demo contract API keys (placeholders).',
  },
  adminEvent: { sq: 'Ndeshja', en: 'Event' },
  adminClock: { sq: 'Ora', en: 'Clock' },
  adminPrimaryOdds: { sq: 'Odds kryesor', en: 'Primary odds' },
  adminControls: { sq: 'Kontrollet', en: 'Controls' },
  adminSuspend: { sq: 'Pezullo', en: 'Suspend' },
  adminResume: { sq: 'Rifillo', en: 'Resume' },
  adminKeyActive: { sq: 'Aktiv', en: 'Active' },
  adminKeyPending: { sq: 'Në pritje', en: 'Pending' },
  // teams / leagues
  league_ucl: { sq: 'Champions League', en: 'Champions League' },
  league_serie_a: { sq: 'Serie A', en: 'Serie A' },
  league_epl: { sq: 'Premier League', en: 'Premier League' },
  league_atp: { sq: 'ATP Masters', en: 'ATP Masters' },
  league_wta: { sq: 'WTA 1000', en: 'WTA 1000' },
  league_nba: { sq: 'NBA', en: 'NBA' },
  league_euroleague: { sq: 'EuroLeague', en: 'EuroLeague' },
  league_fina: { sq: 'FINA World Cup', en: 'FINA World Cup' },
  league_cev: { sq: 'CEV Champions League', en: 'CEV Champions League' },
  league_nhl: { sq: 'NHL', en: 'NHL' },
  team_milan: { sq: 'AC Milan', en: 'AC Milan' },
  team_inter: { sq: 'Inter', en: 'Inter' },
  team_arsenal: { sq: 'Arsenal', en: 'Arsenal' },
  team_liverpool: { sq: 'Liverpool', en: 'Liverpool' },
  team_barca: { sq: 'Barcelona', en: 'Barcelona' },
  team_bayern: { sq: 'Bayern', en: 'Bayern' },
  team_napoli: { sq: 'Napoli', en: 'Napoli' },
  team_juve: { sq: 'Juventus', en: 'Juventus' },
  team_alcaraz: { sq: 'Alcaraz', en: 'Alcaraz' },
  team_sinner: { sq: 'Sinner', en: 'Sinner' },
  team_swiatek: { sq: 'Świątek', en: 'Świątek' },
  team_gauff: { sq: 'Gauff', en: 'Gauff' },
  team_lakers: { sq: 'Lakers', en: 'Lakers' },
  team_celtics: { sq: 'Celtics', en: 'Celtics' },
  team_real: { sq: 'Real Madrid', en: 'Real Madrid' },
  team_olympiacos: { sq: 'Olympiacos', en: 'Olympiacos' },
  team_dressel: { sq: 'Dressel', en: 'Dressel' },
  team_popovici: { sq: 'Popovici', en: 'Popovici' },
  team_mckeown: { sq: 'McKeown', en: 'McKeown' },
  team_ledecky: { sq: 'Ledecky', en: 'Ledecky' },
  team_perugia: { sq: 'Perugia', en: 'Perugia' },
  team_kazan: { sq: 'Zenit Kazan', en: 'Zenit Kazan' },
  team_rangers: { sq: 'Rangers', en: 'Rangers' },
  team_bruins: { sq: 'Bruins', en: 'Bruins' },
} as const

export type DictKey = keyof typeof dict

export function t(lang: Lang, key: DictKey): string {
  return dict[key][lang]
}

export const sampleApiJson = `{
  "provider": "LINE111",
  "product": "odds-feed",
  "contract": "casino-pro",
  "alignment": {
    "mode": "hybrid",
    "engine": "fair_prob + overround + consensus_calibrate",
    "consensus_source": "public-sample",
    "licensed_adapter": "OddsFeedAdapter (stub until contract)"
  },
  "event": {
    "id": "fb-milan-inter",
    "sport": "football",
    "league": "Serie A",
    "status": "live",
    "clock": "67'",
    "score": { "home": 1, "away": 1 },
    "participants": ["AC Milan", "Inter"]
  },
  "markets": [
    {
      "id": "1x2",
      "name": "full_time_result",
      "suspended": false,
      "selections": [
        { "key": "home", "price": 2.45, "ts": "2026-11-07T14:52:01Z" },
        { "key": "draw", "price": 3.20, "ts": "2026-11-07T14:52:01Z" },
        { "key": "away", "price": 2.90, "ts": "2026-11-07T14:52:01Z" }
      ]
    }
  ],
  "latency_ms": 42
}`

export const sampleLiveTickJson = `{
  "channel": "ws://api.line111.example/v1/stream",
  "type": "odds.tick",
  "event_id": "fb-milan-inter",
  "market_id": "1x2",
  "selection": "home",
  "price": 2.38,
  "prev": 2.45,
  "direction": "down",
  "suspended": false,
  "clock": "68'",
  "score": { "home": 1, "away": 1 },
  "ts": "2026-11-07T14:52:08Z"
}`
