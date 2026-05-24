import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import styles from './MenuCard.module.css'

export default function MenuCard({ item }) {
  const [qty, setQty] = useState(1)
  const { addItem, openCart } = useCart()

  const handleAdd = () => {
    addItem(item, qty)
    setQty(1)
    toast.success(`Added to cart!`, { icon: '✅' })
  }

  if (!item.available) return (
    <div className={`${styles.card} ${styles.unavailable}`}>
      <div className={styles.imgWrap}>
        <img src={item.image_url} alt={item.name} className={styles.img} onError={e => { e.target.style.opacity = 0 }} />
        <div className={styles.overlay} />
        <span className={styles.badge}>{item.badge}</span>
        <span className={styles.unavailTag}>Unavailable</span>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.desc}>{item.description}</div>
        <div className={styles.footer}>
          <span className={styles.price}>₦{item.price.toLocaleString()}</span>
          <span className={styles.soldOut}>Sold Out</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={item.image_url} alt={item.name} className={styles.img} onError={e => { e.target.parentElement.style.background = 'linear-gradient(135deg,#FFE8D6,#D35400)'; e.target.style.opacity = 0 }} />
        <div className={styles.overlay} />
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
        <span className={styles.catTag}>{item.category_slug?.toUpperCase()}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.desc}>{item.description}</div>
        <div className={styles.footer}>
          <span className={styles.price}>₦{item.price.toLocaleString()}</span>
          <div className={styles.qtyCtrl}>
            <button className={styles.qBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className={styles.qNum}>{qty}</span>
            <button className={styles.qBtn} onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          <button className={styles.addBtn} onClick={handleAdd}>Add +</button>
        </div>
      </div>
    </div>
  )
}
