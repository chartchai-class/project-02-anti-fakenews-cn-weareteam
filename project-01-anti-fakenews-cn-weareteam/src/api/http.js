const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

let token = localStorage.getItem('token') || ''

export function setToken(t) {
  token = t || ''
  if (t) localStorage.setItem('token', t)
  else localStorage.removeItem('token')
}

export function getToken() {
  return token
}

export async function apiFetch(path, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {})
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(BASE + path, { ...opts, headers })
  if (!res.ok) {
    let msg = `${res.status}`
    try {
      const text = await res.text()
      if (text) {
        try {
          const json = JSON.parse(text)
          msg = json.error || json.message || msg
        } catch {
          msg = text
        }
      }
    } catch {}
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export async function apiForm(path, formData, headers = {}) {
  const h = Object.assign({}, headers)
  if (token) h['Authorization'] = `Bearer ${token}`
  const res = await fetch(BASE + path, { method: 'POST', body: formData, headers: h })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}
