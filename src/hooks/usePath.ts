import { useCallback, useEffect, useState } from 'react'

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((next: string) => {
    if (next === window.location.pathname) {
      setPath(next)
      return
    }
    window.history.pushState({}, '', next)
    setPath(next)
  }, [])

  return { path, navigate }
}
