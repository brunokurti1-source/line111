import { SPORTS } from '../data/seed'
import { useLanguage } from '../i18n/LanguageContext'
import type { DictKey } from '../i18n/translations'
import type { SportId } from '../types'

interface Props {
  active: SportId | 'all'
  onSelect: (id: SportId | 'all') => void
  counts: Partial<Record<SportId | 'all', number>>
}

export function SportsNav({ active, onSelect, counts }: Props) {
  const { tr, switching } = useLanguage()

  return (
    <nav className={`sports-nav${switching ? ' lang-fade' : ''}`} aria-label={tr('sports')}>
      <button
        type="button"
        className={active === 'all' ? 'sport-chip active' : 'sport-chip'}
        onClick={() => onSelect('all')}
      >
        <span className="sport-ico" aria-hidden>
          ◆
        </span>
        <span>{tr('allSports')}</span>
        <span className="sport-count">{counts.all ?? 0}</span>
      </button>
      {SPORTS.map((s) => (
        <button
          key={s.id}
          type="button"
          className={active === s.id ? 'sport-chip active' : 'sport-chip'}
          onClick={() => onSelect(s.id)}
        >
          <span className="sport-ico" aria-hidden>
            {s.icon}
          </span>
          <span>{tr(s.id as DictKey)}</span>
          <span className="sport-count">{counts[s.id] ?? 0}</span>
        </button>
      ))}
    </nav>
  )
}
