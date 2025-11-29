import React from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max))
}

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = clamp(page, 1, totalPages)

  const goto = (p) => onPageChange(clamp(p, 1, totalPages))

  const pages = []
  const start = clamp(current - 2, 1, totalPages)
  const end = clamp(start + 4, 1, totalPages)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={() => goto(current - 1)} disabled={current === 1}>Prev</button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goto(p)}
          style={{ fontWeight: p === current ? 700 : 400 }}
        >
          {p}
        </button>
      ))}
      <button onClick={() => goto(current + 1)} disabled={current === totalPages}>Next</button>
      <span style={{ marginLeft: '0.5rem', color: '#666' }}>
        Page {current} of {totalPages}
      </span>
    </div>
  )
}