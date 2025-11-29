import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import { fetchNewsItem, fetchVotes } from '../api/news'

const sanitize = (s) => {
  const t = (s || '').replace(/[\u4e00-\u9fff]+/g, '').trim()
  return t || 'N/A'
}

export default function NewsDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  useEffect(() => {
    fetchNewsItem(id).then((n) => {
      setItem({
        id: String(n.id),
        topic: sanitize(n.title),
        shortDetail: sanitize(n.summary),
        fullDetail: sanitize(n.summary),
        reporter: sanitize(n.reporterName),
        reportedAt: n.createdAt,
        imageUrl: n.imageUrl,
        votes: { fake: n.fakeVotes || 0, not_fake: n.realVotes || 0 },
        status: n.status,
      })
    })
  }, [id])

  useEffect(() => {
    fetchVotes(id, page - 1, pageSize).then((p) => {
      const mapped = p.content.map((v) => ({
        id: String(v.id),
        voterName: sanitize(v.voterName),
        vote: v.value ? 'not_fake' : 'fake',
        commentText: sanitize(v.commentText || ''),
        imageUrl: v.imageUrl || '',
        createdAt: v.createdAt,
      }))
      setComments(mapped)
      setTotal(p.totalElements || 0)
    })
  }, [id, page, pageSize])

  if (!item) {
    return <div>News not found. <Link to="/">Back to Home</Link></div>
  }
  
  const status = item.status === 'FAKE' ? 'Fake' : item.status === 'REAL' ? 'Not Fake' : 'Unverified'
  const reportedDate = new Date(item.reportedAt)

  const commentsPage = comments

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0 }}>{item.topic}</h2>
        <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc' }}>{status}</span>
      </div>
      <div style={{ color: '#666', marginBottom: '0.5rem' }}>
        Reporter: {item.reporter} • {reportedDate.toLocaleString()}
      </div>
      <p style={{ marginTop: '0.5rem' }}>{item.fullDetail}</p>
      <div style={{ margin: '0.5rem 0' }}>
        <a href={item.imageUrl} target="_blank" rel="noreferrer">Event Image Link</a>
      </div>
      <div style={{ margin: '0.5rem 0' }}>
        <img src={item.imageUrl} alt="Event" style={{ maxWidth: '100%', borderRadius: 8 }} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <strong>Votes:</strong>
        <span>Fake: {item.votes.fake}</span>
        <span>Not Fake: {item.votes.not_fake}</span>
        <Link to={`/news/${item.id}/vote`} style={{ marginLeft: 'auto' }}>Vote on this news</Link>
      </div>

      <hr style={{ margin: '1rem 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Comments</h3>
        <label>
          <span style={{ marginRight: 4 }}>Per page:</span>
          <select value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
        {commentsPage.map((c) => (
          <div key={c.id} className="card" style={{ padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong>{c.voterName}</strong>
              <span className={c.vote === 'fake' ? 'badge badge--fake' : 'badge badge--real'}>{c.vote === 'fake' ? 'Fake' : 'Not Fake'}</span>
            </div>
            <div style={{ color: '#444', marginTop: 4 }}>{c.commentText}</div>
            {c.imageUrl && (
              <div style={{ marginTop: 6 }}>
                <a href={c.imageUrl} target="_blank" rel="noreferrer">Evidence Image Link</a>
              </div>
            )}
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {commentsPage.length === 0 && <div style={{ color: '#666' }}>No comments yet.</div>}
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>
    </div>
  )
}
