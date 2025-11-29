import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NewsCard({ news, status }) {
  const navigate = useNavigate()
  const clean = (s) => {
    const t = (s || '').replace(/[\u4e00-\u9fff]+/g, '').trim()
    return t || 'N/A'
  }
  const reportedDate = new Date(news.reportedAt)
  const badgeClass = status === 'Fake' ? 'badge badge--fake' : status === 'Not Fake' ? 'badge badge--real' : 'badge badge--unverified'
  return (
    <div
      className="card card--clickable"
      style={{ display: 'grid', gap: '0.5rem', minWidth: 0 }}
      onClick={() => navigate(`/news/${news.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/news/${news.id}`) } }}
      role="button"
      tabIndex={0}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
        <h3 className="line-clamp-2" style={{ margin: 0 }}>{clean(news.topic)}</h3>
        <span className={badgeClass}>{status}</span>
      </div>
      <p className="line-clamp-3" style={{ margin: 0, color: '#444' }}>{clean(news.shortDetail)}</p>
      <div style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Reporter: {clean(news.reporter)} • {reportedDate.toLocaleString()}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Link to={`/news/${news.id}/vote`} onClick={(e) => e.stopPropagation()}>Vote</Link>
      </div>
    </div>
  )
}
