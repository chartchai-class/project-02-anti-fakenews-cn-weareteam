import React from 'react'

export default function FilterBar({ filter, onFilterChange, pageSize, onPageSizeChange }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
      <label>
        <span style={{ marginRight: 4 }}>Filter:</span>
        <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All</option>
          <option value="fake">Fake</option>
          <option value="not_fake">Not Fake</option>
          <option value="unverified">Unverified</option>
        </select>
      </label>
      <label>
        <span style={{ marginRight: 4 }}>Per page:</span>
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>
    </div>
  )
}