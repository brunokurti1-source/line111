import { useState, type FormEvent } from 'react'
import {
  DEMO_ADMIN_PASS,
  DEMO_ADMIN_USER,
  tryAdminLogin,
} from '../auth/adminAuth'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  onSuccess: () => void
  onBack: () => void
}

export function AdminLogin({ onSuccess, onBack }: Props) {
  const { tr, switching } = useLanguage()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (tryAdminLogin(user, pass)) {
      setError(false)
      onSuccess()
      return
    }
    setError(true)
  }

  return (
    <div className={`admin-login${switching ? ' lang-fade' : ''}`}>
      <button type="button" className="admin-back" onClick={onBack}>
        ← {tr('boardNav')}
      </button>

      <div className="admin-card">
        <p className="provider-badge">{tr('adminBadge')}</p>
        <h1>{tr('adminLoginTitle')}</h1>
        <p className="admin-sub">{tr('adminLoginSub')}</p>

        <div className="demo-creds" role="note">
          <strong>{tr('adminDemoCreds')}</strong>
          <code>
            {DEMO_ADMIN_USER} / {DEMO_ADMIN_PASS}
          </code>
        </div>

        <form onSubmit={onSubmit} className="admin-form">
          <label>
            <span>{tr('adminUser')}</span>
            <input
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={DEMO_ADMIN_USER}
            />
          </label>
          <label>
            <span>{tr('adminPass')}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error ? <p className="admin-error">{tr('adminLoginError')}</p> : null}
          <button type="submit" className="admin-submit">
            {tr('adminSignIn')}
          </button>
        </form>
      </div>
    </div>
  )
}
