import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalItems: 0, available: 0, orders: 0, revenue: 0, recentOrders: [] })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const [items, orders] = await Promise.all([
        supabase.from('menu_items').select('id, available'),
        supabase.from('orders').select('id, total, status, customer_name, created_at, items').order('created_at', { ascending: false }).limit(5)
      ])
      const allItems = items.data || []
      const allOrders = orders.data || []
      const revenue = allOrders.reduce((s, o) => s + (o.total || 0), 0)
      setStats({
        totalItems: allItems.length,
        available: allItems.filter(i => i.available).length,
        orders: allOrders.length,
        revenue,
        recentOrders: allOrders
      })
      setLoading(false)
    }
    load()
  }, [])

  const statusColor = { pending: '#F59E0B', confirmed: '#3B82F6', ready: '#8B5CF6', delivered: '#22C55E', cancelled: '#EF4444' }

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>Welcome back! 👋</h1>
        <p className={styles.welcomeSub}>Here's what's happening at Riannie's Kitchen today.</p>
      </div>

      <div className={styles.statsGrid}>
        {[
          { icon: '🍜', label: 'Menu Items', value: stats.totalItems, sub: `${stats.available} available`, color: '#D35400' },
          { icon: '📋', label: 'Total Orders', value: stats.orders, sub: 'all time', color: '#3B82F6' },
          { icon: '💰', label: 'Revenue', value: `₦${stats.revenue.toLocaleString()}`, sub: 'all time', color: '#22C55E' },
          { icon: '🔥', label: 'Active Items', value: stats.available, sub: `of ${stats.totalItems} total`, color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid2}>
        {/* Recent Orders */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>📋 Recent Orders</h2>
            <button className={styles.viewAll} onClick={() => navigate('/admin/orders')}>View all →</button>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className={styles.empty}>No orders yet</div>
          ) : stats.recentOrders.map(order => (
            <div key={order.id} className={styles.orderRow}>
              <div>
                <div className={styles.orderName}>{order.customer_name}</div>
                <div className={styles.orderMeta}>{Array.isArray(order.items) ? order.items.length : 0} items · {new Date(order.created_at).toLocaleDateString('en-NG')}</div>
              </div>
              <div className={styles.orderRight}>
                <div className={styles.orderTotal}>₦{(order.total || 0).toLocaleString()}</div>
                <span className={styles.orderStatus} style={{ background: `${statusColor[order.status]}22`, color: statusColor[order.status] }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>⚡ Quick Actions</h2>
          </div>
          <div className={styles.quickGrid}>
            {[
              { icon: '➕', label: 'Add Menu Item', path: '/admin/menu', color: '#D35400' },
              { icon: '🗂', label: 'Manage Categories', path: '/admin/categories', color: '#8B5CF6' },
              { icon: '📋', label: 'View Orders', path: '/admin/orders', color: '#3B82F6' },
              { icon: '⚙️', label: 'Store Settings', path: '/admin/settings', color: '#22C55E' },
            ].map((a, i) => (
              <button key={i} className={styles.quickBtn} onClick={() => navigate(a.path)} style={{ '--c': a.color }}>
                <span className={styles.quickIcon}>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
