import { apiFetch } from './http'

export async function listUsers({ q = '', page = 0, size = 10 } = {}) {
  const p = new URLSearchParams()
  if (q) p.set('q', q)
  p.set('page', page)
  p.set('size', size)
  return apiFetch(`/api/admin/users?${p.toString()}`)
}

export async function updateUserRole(id, role) {
  return apiFetch(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })
}

export async function listAdminNews({ q = '', page = 0, size = 10 } = {}) {
  const p = new URLSearchParams()
  if (q) p.set('q', q)
  p.set('page', page)
  p.set('size', size)
  return apiFetch(`/api/admin/news?${p.toString()}`)
}

export async function softDeleteNews(id) {
  return apiFetch(`/api/admin/news/${id}`, { method: 'DELETE' })
}

export async function restoreNews(id) {
  return apiFetch(`/api/admin/news/${id}/restore`, { method: 'PATCH' })
}

export async function setNewsStatus(id, status) {
  return apiFetch(`/api/admin/news/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export async function listVotes(newsId, { page = 0, size = 10 } = {}) {
  const p = new URLSearchParams()
  p.set('page', page)
  p.set('size', size)
  return apiFetch(`/api/news/${newsId}/votes?${p.toString()}`)
}

export async function deleteVote(newsId, voteId) {
  return apiFetch(`/api/news/${newsId}/votes/${voteId}`, { method: 'DELETE' })
}
