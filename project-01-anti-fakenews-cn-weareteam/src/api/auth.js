import { apiFetch, setToken } from './http'

export async function login(email, password) {
  const body = { email, password }
  const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) })
  setToken(res.token)
  return res.token
}

export async function ensureLogin() {
  if (localStorage.getItem('token')) return localStorage.getItem('token')
  const e = import.meta.env.VITE_DEV_EMAIL || 'jane@example.com'
  const p = import.meta.env.VITE_DEV_PASSWORD || 'pass1234'
  return login(e, p)
}

export async function register({ firstName, lastName, email, password, avatarUrl }) {
  const body = { firstName, lastName, email, password, avatarUrl: avatarUrl || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}` }
  await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) })
  return true
}

export async function getMe() {
  return apiFetch('/api/auth/me')
}
