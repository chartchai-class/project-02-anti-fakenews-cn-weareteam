import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '../api/auth'

export default function Register() {
  const nav = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, avatarUrl: avatarUrl.trim() })
      await login(email.trim(), password)
      nav('/')
    } catch (err) {
      setError(err?.message || 'Registration failed')
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          <div>First Name</div>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label>
          <div>Last Name</div>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label>
          <div>Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <div>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          <div>Avatar URL</div>
          <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder={`https://i.pravatar.cc/150?u=${encodeURIComponent(email || 'user')}`} />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}
