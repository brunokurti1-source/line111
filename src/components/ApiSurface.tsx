import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { sampleApiJson, sampleLiveTickJson } from '../i18n/translations'

interface Props {
  livePayload: unknown
}

const ENDPOINTS = [
  { method: 'GET', path: '/v1/sports', descEn: 'Sport catalog', descSq: 'Katalogu i sporteve' },
  { method: 'GET', path: '/v1/events', descEn: 'Pre-match events', descSq: 'Ndeshjet para fillimit' },
  { method: 'GET', path: '/v1/live', descEn: 'In-play events + markets', descSq: 'Ndeshjet live + tregjet' },
  { method: 'GET', path: '/v1/events/:id', descEn: 'Single event snapshot', descSq: 'Snapshot i një ndeshjeje' },
  { method: 'WS', path: '/v1/stream', descEn: 'Odds ticks, suspend, score/clock', descSq: 'Ticks odds, pezullim, skor/orë' },
]

function CopyBlock({ title, code }: { title: string; code: string }) {
  const { tr } = useLanguage()
  const [copied, setCopied] = useState(false)

  return (
    <div className="code-block">
      <div className="code-head">
        <span>{title}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1600)
            } catch {
              /* ignore */
            }
          }}
        >
          {copied ? tr('apiCopied') : tr('apiCopy')}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function ApiSurface({ livePayload }: Props) {
  const { tr, lang, switching } = useLanguage()

  const authSnippet = `curl -s https://api.line111.example/v1/live \\
  -H "Authorization: Bearer lk_live_YOUR_CONTRACT_KEY" \\
  -H "X-LINE111-Owner: Bruno-Kurti"`

  const livePreview =
    livePayload != null
      ? JSON.stringify(livePayload, null, 2).slice(0, 1800) +
        (JSON.stringify(livePayload).length > 1800 ? '\n  …' : '')
      : '{ "events": [] }'

  return (
    <div className={`api-surface${switching ? ' lang-fade' : ''}`}>
      <section className="api-hero">
        <span className="provider-badge">{tr('providerBadge')}</span>
        <h1>{tr('apiHero')}</h1>
        <p>{tr('apiSub')}</p>
        <p className="embed-hint">{tr('embedHint')}</p>
      </section>

      <div className="api-grid">
        <section className="api-panel">
          <h2>{tr('apiAuth')}</h2>
          <p>{tr('apiAuthHint')}</p>
          <CopyBlock title="Authorization" code={authSnippet} />
        </section>

        <section className="api-panel">
          <h2>{tr('apiEndpoints')}</h2>
          <ul className="endpoint-list">
            {ENDPOINTS.map((ep) => (
              <li key={ep.path}>
                <code className="method">{ep.method}</code>
                <code className="path">{ep.path}</code>
                <span>{lang === 'sq' ? ep.descSq : ep.descEn}</span>
              </li>
            ))}
          </ul>
          <p className="muted">{tr('liveEndpointHint')}</p>
        </section>

        <section className="api-panel wide">
          <h2>{tr('consensusTitle')}</h2>
          <p>{tr('consensusBody')}</p>
          <p className="legal">{tr('legalNote')}</p>
          <div className="arch-steps">
            <div>
              <strong>1</strong>
              <span>Fair P → margin</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Calibrate ↔ consensus</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Live drift + suspend</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Licensed adapter</span>
            </div>
          </div>
          <h3>{tr('adapterTitle')}</h3>
          <p>{tr('adapterBody')}</p>
        </section>

        <section className="api-panel">
          <h2>{tr('apiPricing')}</h2>
          <p>{tr('apiPricingBody')}</p>
          <ul className="pricing-tiers">
            <li>
              <strong>Starter</strong>
              <span>REST · delayed live</span>
            </li>
            <li>
              <strong>Pro</strong>
              <span>WS ticks · &lt;150ms</span>
            </li>
            <li>
              <strong>Enterprise</strong>
              <span>SLA · white-label SDK</span>
            </li>
          </ul>
        </section>

        <section className="api-panel">
          <h2>{tr('apiSample')}</h2>
          <CopyBlock title="GET /v1/events/:id" code={sampleApiJson} />
        </section>

        <section className="api-panel">
          <h2>{tr('liveTickJson')}</h2>
          <CopyBlock title="WS /v1/stream" code={sampleLiveTickJson} />
        </section>

        <section className="api-panel wide">
          <h2>
            {tr('liveEndpoint')} — live payload
          </h2>
          <CopyBlock title="GET /v1/live (demo stream)" code={livePreview} />
        </section>
      </div>
    </div>
  )
}
