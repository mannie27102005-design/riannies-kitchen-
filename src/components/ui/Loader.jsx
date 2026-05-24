import { useState, useEffect } from 'react'
import styles from './Loader.module.css'

export default function Loader() {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1800)
    return () => clearTimeout(t)
  }, [])

  if (gone) return null

  return (
    <div className={styles.loader}>
      <span className={styles.bowl}>🍜</span>
      <div className={styles.text}>RIANNIE'S KITCHEN</div>
    </div>
  )
}
