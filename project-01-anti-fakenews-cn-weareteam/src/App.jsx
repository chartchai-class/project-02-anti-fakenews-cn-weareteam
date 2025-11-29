import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import NewsDetail from './pages/NewsDetail'
import Vote from './pages/Vote'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import SubmitNews from './pages/SubmitNews'
import './App.css'
import { getToken, setToken, apiFetch } from './api/http'
import { getMe } from './api/auth'

function App() {
  const nav = useNavigate()
  const loggedIn = !!getToken()
  const [isAdmin, setIsAdmin] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  useEffect(() => {
    if (!loggedIn) { setIsAdmin(false); return }
    apiFetch('/api/admin/news?page=0&size=1').then(() => setIsAdmin(true)).catch(() => setIsAdmin(false))
  }, [loggedIn])
  useEffect(() => {
    if (!loggedIn) { setCanSubmit(false); return }
    getMe().then(me => setCanSubmit(me.role === 'MEMBER' || me.role === 'ADMIN')).catch(() => setCanSubmit(false))
  }, [loggedIn])
  function logout() { setToken(''); nav('/') }
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: '#f8fafc', borderRadius: 12 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          Social Anti-Fake News
        </Link>
        <span style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {loggedIn ? (
            <>
              <span style={{ fontSize: 12, color: '#666' }}>Logged in</span>
              <button onClick={logout}>Logout</button>
              {isAdmin && <Link to="/admin" style={{ paddingLeft: 8, paddingRight: 8 }}>Admin</Link>}
              {canSubmit && <Link to="/news/new" style={{ paddingLeft: 8, paddingRight: 8 }}>Submit</Link>}
            </>
          ) : (
            <>
              <Link to="/login" style={{ paddingLeft: 8, paddingRight: 8 }}>Login</Link>
              <Link to="/register" style={{ paddingLeft: 8, paddingRight: 8 }}>Register</Link>
            </>
          )}
        </span>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/news/:id/vote" element={<Vote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/news/new" element={<SubmitNews />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
