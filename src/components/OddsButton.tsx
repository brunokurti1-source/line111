import { useLanguage } from '../i18n/LanguageContext'
import type { DictKey } from '../i18n/translations'
import type { OddsFlash } from '../types'

interface Props {
  labelKey: string
  price: number
  flash?: OddsFlash
  suspended?: boolean
  lineHint?: string
}

export function OddsButton({ labelKey, price, flash, suspended, lineHint }: Props) {
  const { tr } = useLanguage()
  const label = tr(labelKey as DictKey)

  return (
    <button
      type="button"
      className={`odds-btn${flash === 'up' ? ' flash-up' : ''}${flash === 'down' ? ' flash-down' : ''}${suspended ? ' is-suspended' : ''}`}
      disabled={suspended}
      aria-label={`${label} ${price.toFixed(2)}`}
    >
      <span className="odds-label">
        {label}
        {lineHint ? <em> {lineHint}</em> : null}
      </span>
      <span className="odds-price">{suspended ? '—' : price.toFixed(2)}</span>
    </button>
  )
}
