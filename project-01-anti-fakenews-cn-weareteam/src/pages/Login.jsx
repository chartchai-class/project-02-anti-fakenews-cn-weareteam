import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('jane@example.com')
  const [password, setPassword] = useState('pass1234')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      nav('/')
    } catch (err) {
      setError('Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          <div>Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <div>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

