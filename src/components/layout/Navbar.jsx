import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { count, toggleCart } = useCart()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>Riannie's Kitchen</Link>
      <div className={styles.right}>
        {!isAdmin && (
          <>
            <div className={styles.hours}>
              <span className={styles.dot} />
              Pre-orders Open
            </div>
            <button className={styles.cartBtn} onClick={toggleCart}>
              🛒 Cart
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </button>
          </>
        )}
        {isAdmin && (
          <Link to="/" className={styles.backBtn}>← Back to Store</Link>
        )}
      </div>
    </nav>
  )
}
