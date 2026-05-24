import { useState, useEffect } from 'react'
import { useMenuItems, useCategories, useStoreConfig } from '../hooks/useData'
import MenuCard from '../components/menu/MenuCard'
import BackgroundCanvas from '../components/ui/BackgroundCanvas'
import Footer from '../components/layout/Footer'
import styles from './Home.module.css'

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')
  const { items, loading: menuLoading } = useMenuItems(activeTab)
  const { categories } = useCategories()
  const { config } = useStoreConfig()

  const openWA = () => {
    const wa = config.whatsapp || '2348084378019'
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent("Hi! I'd like to place an order at Riannie's Kitchen 🍜")}`, '_blank')
  }

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  const allTabs = [{ slug: 'all', name: '🍽 All', icon: '🍽' }, ...categories.map(c => ({ slug: c.slug, name: `${c.icon} ${c.name}`, icon: c.icon }))]

  return (
    <div className={styles.page}>
      <BackgroundCanvas />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroCont}>
          <div className={styles.badge}>⚡ Pre-orders Open Daily!</div>
          <div className={styles.eyebrow}>🇳🇬 LASU Ojo Campus · Lagos</div>
          <span className={styles.bowl}>🍜</span>
          <h1 className={styles.title}>Riannie's Kitchen</h1>
          <p className={styles.sub}>Premium Noodles &amp; Spaghetti</p>
          <p className={styles.tagline}>
            Handcrafted daily — from rich Stir-Fry packs to spicy Native noodles loaded with smoked fish, dodo &amp; more. Box &amp; packaging always included. 📦
          </p>
          <div className={styles.ctas}>
            <button className="btn-primary" onClick={scrollToMenu}>🍽 Order Now</button>
            <button className="btn-ghost" onClick={openWA}>💬 WhatsApp Us</button>
          </div>
          <div className={styles.badges}>
            <span className={styles.bdg}>📦 Box &amp; Nylon Included</span>
            <span className={styles.bdg}>🕐 12PM – 7PM Mon–Sat</span>
            <span className={styles.bdg}>⚡ Pre-orders Welcome</span>
            <span className={styles.bdg}>🔥 Native &amp; Stir Fry</span>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <div className={styles.strip}>
        {[
          { icon: '📍', label: 'Location', val: config.location || 'LASU Ojo Campus' },
          { icon: '🕐', label: 'Opening Hours', val: '12PM – 7PM (Mon–Sat)' },
          { icon: '📱', label: 'Call / WhatsApp', val: '08084378019' },
          { icon: '🚀', label: 'Pre-orders', val: 'Open Daily!' },
        ].map((item, i) => (
          <div key={i} className={styles.infoCard}>
            <div className={styles.infoIcon}>{item.icon}</div>
            <div className={styles.infoLabel}>{item.label}</div>
            <div className={styles.infoVal}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* MENU */}
      <section className={styles.menuSec} id="menu">
        <p className={styles.secLabel}>✨ Fresh Every Day</p>
        <h2 className={`${styles.secTitle} grad-text`}>The Menu</h2>
        <div className={styles.divider} />

        <div className={styles.tabs}>
          {allTabs.map(tab => (
            <button
              key={tab.slug}
              className={`${styles.tab} ${activeTab === tab.slug ? styles.tabOn : ''}`}
              onClick={() => setActiveTab(tab.slug)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {menuLoading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(item => <MenuCard key={item.id} item={item} />)}
            {items.length === 0 && (
              <div className={styles.noItems}>No items in this category right now.</div>
            )}
          </div>
        )}
      </section>

      <Footer config={config} />
    </div>
  )
}
