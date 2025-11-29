import React, { useEffect, useState } from 'react'
import { listUsers, updateUserRole, listAdminNews, softDeleteNews, restoreNews, listVotes, deleteVote, setNewsStatus } from '../api/admin'
import { getToken } from '../api/http'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [uPage, setUPage] = useState(0)
  const [uTotal, setUTotal] = useState(0)
  const [uQ, setUQ] = useState('')
  const [news, setNews] = useState([])
  const [nPage, setNPage] = useState(0)
  const [nTotal, setNTotal] = useState(0)
  const [nQ, setNQ] = useState('')
  const [votes, setVotes] = useState({ newsId: null, items: [], page: 0, total: 0 })
  const [voteSize, setVoteSize] = useState(10)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    if (!getToken()) { setIsAdmin(false); return }
    // Probe admin access by calling admin news endpoint
    listAdminNews({ page: 0, size: 1 }).then(() => setIsAdmin(true)).catch(() => setIsAdmin(false))
  }, [])

  useEffect(() => {
    if (!isAdmin || tab !== 'users') return
    listUsers({ q: uQ, page: uPage, size: 10 }).then(p => { setUsers(p.content || []); setUTotal(p.totalElements || 0) }).catch(() => {})
  }, [isAdmin, tab, uQ, uPage])

  useEffect(() => {
    if (!isAdmin || tab !== 'news') return
    listAdminNews({ q: nQ, page: nPage, size: 15 }).then(p => { setNews(p.content || []); setNTotal(p.totalElements || 0) }).catch(() => {})
  }, [isAdmin, tab, nQ, nPage])

  async function changeRole(id, role) {
    setError('')
    try { await updateUserRole(id, role); listUsers({ q: uQ, page: uPage, size: 10 }).then(p => { setUsers(p.content || []); setUTotal(p.totalElements || 0) }) }
    catch (e) { setError('Failed to update role') }
  }

  async function toggleDelete(n) {
    setError('')
    try { if (n.deleted) await restoreNews(n.id); else await softDeleteNews(n.id); listAdminNews({ q: nQ, page: nPage, size: 15 }).then(p => { setNews(p.content || []); setNTotal(p.totalElements || 0) }) }
    catch (e) { setError('Failed to update news') }
  }

  async function openVotes(newsId) {
    setError('')
    try { const p = await listVotes(newsId, { page: 0, size: voteSize }); setVotes({ newsId, items: p.content || [], page: 0, total: p.totalElements || 0 }) }
    catch (e) { setError('Failed to load votes') }
  }

  async function removeVote(voteId) {
    setError('')
    try { await deleteVote(votes.newsId, voteId); const p = await listVotes(votes.newsId, { page: votes.page, size: voteSize }); setVotes({ newsId: votes.newsId, items: p.content || [], page: votes.page, total: p.totalElements || 0 }) }
    catch (e) { setError('Failed to delete vote') }
  }

  async function changeNewsStatus(id, status) {
    setError('')
    try { await setNewsStatus(id, status); const p = await listAdminNews({ q: nQ, page: nPage, size: 15 }); setNews(p.content || []); setNTotal(p.totalElements || 0) }
    catch (e) { setError('Failed to update status') }
  }

  async function votesPrev() {
    if (votes.page <= 0) return
    const p = await listVotes(votes.newsId, { page: votes.page - 1, size: voteSize })
    setVotes({ newsId: votes.newsId, items: p.content || [], page: votes.page - 1, total: p.totalElements || 0 })
  }

  async function votesNext() {
    const pages = Math.max(1, Math.ceil((votes.total || 0) / voteSize))
    if (votes.page + 1 >= pages) return
    const p = await listVotes(votes.newsId, { page: votes.page + 1, size: voteSize })
    setVotes({ newsId: votes.newsId, items: p.content || [], page: votes.page + 1, total: p.totalElements || 0 })
  }

  if (!isAdmin) return (<div><h2>Admin</h2><div style={{ color: '#666' }}>Forbidden or not logged in.</div></div>)

  return (
    <div>
      <h2>Admin</h2>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setTab('users')} disabled={tab==='users'}>Users</button>
        <button onClick={() => setTab('news')} disabled={tab==='news'}>News</button>
      </div>
      {tab === 'users' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input placeholder="Search by name or email" value={uQ} onChange={(e) => setUQ(e.target.value)} />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th align="left">Name</th><th align="left">Email</th><th>Role</th><th>Enabled</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{String(u.enabled)}</td>
                  <td>
                    <select defaultValue={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                      <option value="READER">READER</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '0.5rem', fontSize: 12 }}>Total: {uTotal}</div>
        </div>
      )}
      {tab === 'news' && (
        <div style={{ display:'grid', gridTemplateColumns: votes.newsId ? '1fr 360px' : '1fr', gap:'1rem', alignItems:'start' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input placeholder="Search by title/reporter" value={nQ} onChange={(e) => { setNQ(e.target.value); setNPage(0) }} />
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {news.map(n => (
                <div key={n.id} className="card" style={{ padding: '0.75rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ fontSize: 12 }}>
                      <span className={n.status === 'FAKE' ? 'badge badge--fake' : n.status === 'REAL' ? 'badge badge--real' : 'badge badge--unverified'}>
                        {n.status}
                      </span>
                      {n.deleted ? ' • Deleted' : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems:'center' }}>
                    <button onClick={() => toggleDelete(n)}>{n.deleted ? 'Restore' : 'Delete'}</button>
                    <button onClick={() => openVotes(n.id)}>View Votes</button>
                    <span style={{ marginLeft:'auto', display:'flex', gap:'0.25rem', alignItems:'center' }}>
                      <span style={{ fontSize:12 }}>Status:</span>
                      <select defaultValue={n.status} onChange={(e) => changeNewsStatus(n.id, e.target.value)}>
                        <option value="UNVERIFIED">UNVERIFIED</option>
                        <option value="FAKE">FAKE</option>
                        <option value="REAL">REAL</option>
                      </select>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginTop:'0.75rem' }}>
              <button onClick={() => setNPage(Math.max(0, nPage - 1))}>Prev</button>
              <span style={{ fontSize:12 }}>Page {nPage + 1} / {Math.max(1, Math.ceil((nTotal || 0) / 15))}</span>
              <button onClick={() => setNPage(Math.min(Math.max(0, Math.ceil((nTotal || 0) / 15) - 1), nPage + 1))}>Next</button>
              <span style={{ marginLeft:'auto', fontSize:12, color:'#666' }}>Per page: 15</span>
            </div>
          </div>
          {votes.newsId && (
            <aside style={{ border:'1px solid #ddd', borderRadius:8, padding:'0.75rem', position:'sticky', top:'1rem', height:'calc(100vh - 4rem)', overflow:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ margin:0 }}>Votes #{votes.newsId}</h3>
                <button onClick={() => setVotes({ newsId:null, items:[], page:0, total:0 })}>Close</button>
              </div>
              <div style={{ display:'grid', gap:'0.5rem', marginTop:'0.5rem' }}>
                {votes.items.map(v => (
                  <div key={v.id} style={{ border:'1px solid #eee', padding:'0.5rem', borderRadius:6, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ maxWidth:'220px' }}>
                      <div style={{ fontSize:12 }}>{v.voterName} • {new Date(v.createdAt).toLocaleString()}</div>
                      <div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {(v.vote === true || v.vote === 'not_fake') ? 'Not Fake' : 'Fake'}{v.commentText ? ' • ' + v.commentText : ''}
                      </div>
                    </div>
                    <button onClick={() => removeVote(v.id)}>Remove</button>
                  </div>
                ))}
                {votes.items.length === 0 && (<div style={{ color:'#666' }}>No votes on this page.</div>)}
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginTop:'0.5rem' }}>
                <button onClick={votesPrev}>Prev</button>
                <span style={{ fontSize:12 }}>Page {votes.page + 1} / {Math.max(1, Math.ceil((votes.total || 0) / voteSize))}</span>
                <button onClick={votesNext}>Next</button>
                <span style={{ marginLeft:'auto' }}>
                  <select value={voteSize} onChange={(e) => setVoteSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </span>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  )
}
