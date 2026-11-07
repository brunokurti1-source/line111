import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '../types'
import { t, type DictKey } from './translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  tr: (key: DictKey) => string
  switching: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('sq')
  const [switching, setSwitching] = useState(false)

  const setLang = useCallback((next: Lang) => {
    setSwitching(true)
    setLangState(next)
    window.setTimeout(() => setSwitching(false), 280)
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'sq' ? 'en' : 'sq')
  }, [lang, setLang])

  const tr = useCallback((key: DictKey) => t(lang, key), [lang])

  const value = useMemo(
    () => ({ lang, setLang, toggle, tr, switching }),
    [lang, setLang, toggle, tr, switching],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
