import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useNews } from '../store/NewsContext'
import { getToken } from '../api/http'
import { postVote, uploadImage } from '../api/news'

export default function Vote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { news, addVote } = useNews()
  const item = news.find((n) => n.id === id)

  const clean = (s) => {
    const t = (s || '').replace(/[\u4e00-\u9fff]+/g, '').trim()
    return t || 'N/A'
  }

  const [vote, setVote] = useState('fake')
  const [commentText, setCommentText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)

  if (!item) {
    return <div>News not found. <Link to="/">Back to Home</Link></div>
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!getToken()) { navigate('/login'); return }
    let url = imageUrl.trim()
    const v = vote === 'not_fake'
    if (file && !url) {
      const r = await uploadImage(file)
      url = r.url
    }
    await postVote(item.id, { value: v, commentText: commentText.trim(), imageUrl: url || '' }, file)
    addVote(item.id, v ? 'not_fake' : 'fake', commentText.trim(), url)
    navigate(`/news/${item.id}`)
  }

  return (
    <div>
      <h2 style={{ textAlign: 'left' }}>Vote on: {clean(item.topic)}</h2>
      <div className="card" style={{ padding: '1rem', textAlign: 'left', maxWidth: 760 }}>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Your choice:</span>
            <button
              type="button"
              onClick={() => setVote('fake')}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid #d1d5db',
                background: vote === 'fake' ? '#fee2e2' : '#f3f4f6',
                color: vote === 'fake' ? '#b91c1c' : '#1f2937',
                fontWeight: vote === 'fake' ? 700 : 500
              }}
            >
              Fake
            </button>
            <button
              type="button"
              onClick={() => setVote('not_fake')}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid #d1d5db',
                background: vote === 'not_fake' ? '#dcfce7' : '#f3f4f6',
                color: vote === 'not_fake' ? '#166534' : '#1f2937',
                fontWeight: vote === 'not_fake' ? 700 : 500
              }}
            >
              Not Fake
            </button>
          </div>

          <label>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Comment</div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              placeholder="Explain why you think this is fake or not."
            />
          </label>

          <label>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Image URL (optional)</div>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
          </label>

          <label>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Upload Image (optional)</div>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" style={{ background: '#111827', color: '#fff' }}>Submit Vote</button>
            <Link to={`/news/${item.id}`}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
