import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const { signIn, user }        = useAuth()
  const navigate                = useNavigate()

  // If already logged in, go straight to dashboard
  if (user) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in both fields')
      return
    }
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? '❌ Wrong email or password'
        : error.message)
    } else {
      toast.success('Welcome back, Riannie! 🍜')
      navigate('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      {/* Floating food emojis background */}
      <div className={styles.bgEmojis} aria-hidden>
        {['🍜','🌶️','🔥','🥚','🍝','✨','🍃','🌟'].map((e, i) => (
          <span key={i} className={styles.floatEmoji} style={{ '--i': i }}>{e}</span>
        ))}
      </div>

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <span className={styles.bowl}>🍜</span>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.sub}>Riannie's Kitchen — Management Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fg}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@riannies.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className={styles.fg}>
            <label className={styles.label}>Password</label>
            <div className={styles.pwWrap}>
              <input
                className={styles.input}
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(s => !s)}
                tabIndex={-1}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading
              ? <><span className={styles.spinner} /> Signing in…</>
              : '🔐 Sign In to Dashboard'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <Link to="/" className={styles.backLink}>
          ← Back to Riannie's Kitchen Store
        </Link>

        <p className={styles.hint}>
          This panel is for Riannie only.<br />
          Login uses your Supabase Auth credentials.
        </p>
      </div>
    </div>
  )
}
