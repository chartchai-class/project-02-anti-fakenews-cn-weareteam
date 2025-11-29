import { apiFetch, apiForm } from './http'

export async function fetchNewsList({ status, q, page = 0, size = 10 }) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (q) params.set('q', q)
  params.set('page', String(page))
  params.set('size', String(size))
  return apiFetch(`/api/news?${params.toString()}`)
}

export async function fetchNewsItem(id) {
  return apiFetch(`/api/news/${id}`)
}

export async function fetchVotes(newsId, page = 0, size = 10) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  return apiFetch(`/api/news/${newsId}/votes?${params.toString()}`)
}

export async function postVote(newsId, data, file) {
  if (file) {
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    fd.append('image', file)
    return apiForm(`/api/news/${newsId}/votes`, fd)
  }
  const fd = new FormData()
  fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  return apiForm(`/api/news/${newsId}/votes`, fd)
}

export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('image', file)
  return apiForm('/api/files/upload', fd)
}

export async function createNews(data, file) {
  if (file) {
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    fd.append('image', file)
    return apiForm('/api/news', fd)
  }
  return apiFetch('/api/news', { method: 'POST', body: JSON.stringify(data) })
}
