const AUTH_KEY = 'ketabuna_admin_auth'

export function setAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(AUTH_KEY, '1')
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function clearAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_KEY)
  }
}
