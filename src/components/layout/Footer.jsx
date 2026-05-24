import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer({ config = {} }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Riannie's Kitchen 🍜</div>
      <p className={styles.info}>
        📍 {config.location || 'LASU Ojo Campus, Lagos'} &nbsp;|&nbsp; 📱 Call/WhatsApp: 08084378019<br />
        🕐 {config.hours || 'Monday – Saturday | 12:00 PM – 7:00 PM'}<br />
        📦 Box &amp; Nylon Packaging Included in All Prices
      </p>
      <Link to="/admin/login" className={styles.adminLink}>⚙ Manage</Link>
    </footer>
  )
}
