import React, { useEffect, useState } from 'react'
import { useNews } from '../store/NewsContext'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import NewsCard from '../components/NewsCard'
import { fetchNewsList } from '../api/news'

const sanitize = (s) => {
  const t = (s || '').replace(/[\u4e00-\u9fff]+/g, '').trim()
  return t || 'N/A'
}


function formatStatus(s) {
  if (s === 'FAKE') return 'Fake'
  if (s === 'REAL') return 'Not Fake'
  return 'Unverified'
}

export default function Home() {
  const { news, setNews } = useNews()
  const [filter, setFilter] = useState('all')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  useEffect(() => {
    const toStatus = (f) => (f === 'fake' ? 'FAKE' : f === 'not_fake' ? 'REAL' : f === 'unverified' ? 'UNVERIFIED' : undefined)
    const mapItem = (n) => ({
      id: String(n.id),
      topic: sanitize(n.title),
      shortDetail: sanitize(n.summary),
      fullDetail: sanitize(n.summary),
      reporter: sanitize(n.reporterName),
      reportedAt: n.createdAt,
      imageUrl: n.imageUrl,
      comments: [],
      votes: { fake: n.fakeVotes || 0, not_fake: n.realVotes || 0 },
      status: n.status,
    })
    fetchNewsList({ status: toStatus(filter), q, page: page - 1, size: pageSize })
      .then((p) => {
        setTotal(p.totalElements || 0)
        setPageItems(p.content.map(mapItem))
        setNews(p.content.map(mapItem))
      })
      .catch(() => {})
  }, [filter, pageSize, page, q])

  const [pageItems, setPageItems] = useState([])
  const [total, setTotal] = useState(0)

  return (
    <div>
      <h2>All News</h2>
      <div style={{ marginBottom: '0.5rem' }}>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="Search by title, summary, reporter, status"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <FilterBar
        filter={filter}
        onFilterChange={(v) => { setFilter(v); setPage(1) }}
        pageSize={pageSize}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
      />
      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
        {pageItems.map((n) => (
          <NewsCard key={n.id} news={n} status={formatStatus(n.status)} />
        ))}
        {pageItems.length === 0 && (
          <div style={{ color: '#666' }}>No news for the selected filter.</div>
        )}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>
    </div>
  )
}
