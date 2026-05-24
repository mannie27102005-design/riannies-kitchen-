import { useState } from 'react'
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './AdminLayout.module.css'

const NAV = [
  { path: '/admin/dashboard', icon: '📊', label: 'Overview' },
  { path: '/admin/menu', icon: '🍜', label: 'Menu Items' },
  { path: '/admin/categories', icon: '🗂', label: 'Categories' },
  { path: '/admin/orders', icon: '📋', label: 'Orders' },
  { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>
  if (!user) return <Navigate to="/admin/login" replace />

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <span>🍜</span>
            <div>
              <div className={styles.logoName}>Riannie's</div>
              <div className={styles.logoSub}>Kitchen Admin</div>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <button
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.navActive : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false) }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <a href="/" target="_blank" rel="noreferrer" className={styles.viewStore}>
            🌐 View Store
          </a>
          <button className={styles.signOut} onClick={handleSignOut}>
            🔓 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(s => !s)}>☰</button>
          <div className={styles.headerTitle}>
            {NAV.find(n => n.path === location.pathname)?.icon}{' '}
            {NAV.find(n => n.path === location.pathname)?.label || 'Admin'}
          </div>
          <div className={styles.userBadge}>
            <span className={styles.userDot} />
            {user.email}
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
