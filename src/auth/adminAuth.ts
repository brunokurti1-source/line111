/** Demo-only admin auth. Not real security. */
export const DEMO_ADMIN_USER = 'admin'
export const DEMO_ADMIN_PASS = 'line111-admin'

const STORAGE_KEY = 'line111.admin.session'

export function isAdminSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function tryAdminLogin(user: string, pass: string): boolean {
  const ok =
    user.trim().toLowerCase() === DEMO_ADMIN_USER && pass === DEMO_ADMIN_PASS
  if (ok) {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }
  return ok
}

export function adminLogout(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
