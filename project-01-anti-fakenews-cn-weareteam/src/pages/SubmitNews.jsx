import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNews } from '../api/news'

export default function SubmitNews() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = { title: title.trim(), summary: summary.trim(), imageUrl: imageUrl.trim() }
      const res = await createNews(data, file || undefined)
      if (res && res.id) nav(`/news/${res.id}`)
      else nav('/')
    } catch (err) {
      setError(err?.message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>Submit News</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          <div>Title</div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          <div>Summary</div>
          <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </label>
        <label>
          <div>Image URL</div>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://picsum.photos/seed/demo/640/360" />
        </label>
        <label>
          <div>Upload Image</div>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
      <div style={{ fontSize: 12, color: '#666', marginTop: '0.5rem' }}>Members or Admin can submit news.</div>
    </div>
  )
}

