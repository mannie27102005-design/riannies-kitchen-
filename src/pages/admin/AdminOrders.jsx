import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useOrders } from '../../hooks/useData'
import toast from 'react-hot-toast'
import styles from './AdminOrders.module.css'

const STATUS_COLORS = {
  pending:   { bg: 'rgba(245,158,11,.15)',  color: '#B45309' },
  confirmed: { bg: 'rgba(59,130,246,.15)',  color: '#1D4ED8' },
  ready:     { bg: 'rgba(139,92,246,.15)',  color: '#6D28D9' },
  delivered: { bg: 'rgba(34,197,94,.15)',   color: '#15803D' },
  cancelled: { bg: 'rgba(239,68,68,.15)',   color: '#DC2626' },
}
const STATUSES = ['pending', 'confirmed', 'ready', 'delivered', 'cancelled']

export default function AdminOrders() {
  const { orders, loading, refetch } = useOrders()
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const matchSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search)
    return matchStatus && matchSearch
  })

  const updateStatus = async (id, status) => {
    setUpdating(id)
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success(`Order marked as ${status}`)
      refetch()
      if (selected?.id === id) setSelected(s => ({ ...s, status }))
    }
    setUpdating(null)
  }

  const formatDate = (d) => new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const totals = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      {/* Stats bar */}
      <div className={styles.statsRow}>
        {[{ label: 'All', value: orders.length, s: 'all' }, ...STATUSES.map(s => ({ label: s, value: totals[s] || 0, s }))].map(item => (
          <button
            key={item.s}
            className={`${styles.statChip} ${filterStatus === item.s ? styles.statChipOn : ''}`}
            onClick={() => setFilterStatus(item.s)}
            style={filterStatus === item.s && item.s !== 'all' ? { background: STATUS_COLORS[item.s]?.bg, color: STATUS_COLORS[item.s]?.color, borderColor: STATUS_COLORS[item.s]?.color } : {}}
          >
            {item.label} <span className={styles.chipCount}>{item.value}</span>
          </button>
        ))}
      </div>

      <div className={styles.topBar}>
        <input className={styles.search} placeholder="🔍 Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className={styles.refreshBtn} onClick={refetch}>🔄 Refresh</button>
      </div>

      <div className={styles.layout}>
        {/* Orders list */}
        <div className={styles.list}>
          {filtered.length === 0 && <div className={styles.empty}>No orders found.</div>}
          {filtered.map(order => (
            <div
              key={order.id}
              className={`${styles.orderCard} ${selected?.id === order.id ? styles.orderCardActive : ''}`}
              onClick={() => setSelected(order)}
            >
              <div className={styles.ocTop}>
                <div className={styles.ocName}>{order.customer_name}</div>
                <span className={styles.ocStatus} style={{ background: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.color }}>
                  {order.status}
                </span>
              </div>
              <div className={styles.ocMeta}>
                📱 {order.customer_phone} &nbsp;·&nbsp;
                {order.order_type === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'} &nbsp;·&nbsp;
                {Array.isArray(order.items) ? order.items.length : 0} items
              </div>
              <div className={styles.ocBottom}>
                <span className={styles.ocTotal}>₦{(order.total || 0).toLocaleString()}</span>
                <span className={styles.ocDate}>{formatDate(order.created_at)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order detail */}
        <div className={styles.detail}>
          {!selected ? (
            <div className={styles.noSelect}>
              <div className={styles.noSelectIcon}>📋</div>
              <p>Select an order to view details</p>
            </div>
          ) : (
            <div className={styles.detailInner}>
              <div className={styles.detailHeader}>
                <div>
                  <h3 className={styles.detailName}>{selected.customer_name}</h3>
                  <div className={styles.detailId}>Order #{selected.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <span className={styles.ocStatus} style={{ background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>
                  {selected.status}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}><span className={styles.infoLbl}>Phone</span><span>{selected.customer_phone}</span></div>
                <div className={styles.infoItem}><span className={styles.infoLbl}>Type</span><span>{selected.order_type === 'delivery' ? '🛵 Delivery' : '🏪 Campus Pickup'}</span></div>
                <div className={styles.infoItem}><span className={styles.infoLbl}>Date</span><span>{formatDate(selected.created_at)}</span></div>
                {selected.delivery_address && <div className={styles.infoItem}><span className={styles.infoLbl}>Address</span><span>{selected.delivery_address}</span></div>}
                {selected.notes && <div className={`${styles.infoItem} ${styles.fullSpan}`}><span className={styles.infoLbl}>Notes</span><span>{selected.notes}</span></div>}
              </div>

              <div className={styles.itemsList}>
                <div className={styles.itemsTitle}>🛒 Items</div>
                {(Array.isArray(selected.items) ? selected.items : []).map((item, i) => (
                  <div key={i} className={styles.detailItem}>
                    <span className={styles.diQty}>{item.qty}×</span>
                    <span className={styles.diName}>{item.name}</span>
                    <span className={styles.diPrice}>₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                  </div>
                ))}
                <div className={styles.detailTotal}>
                  <span>Total</span>
                  <span>₦{(selected.total || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.statusUpdate}>
                <div className={styles.statusTitle}>Update Status</div>
                <div className={styles.statusBtns}>
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      className={`${styles.statusBtn} ${selected.status === s ? styles.statusBtnActive : ''}`}
                      style={selected.status === s ? { background: STATUS_COLORS[s]?.bg, color: STATUS_COLORS[s]?.color, borderColor: STATUS_COLORS[s]?.color } : {}}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={updating === selected.id || selected.status === s}
                    >
                      {updating === selected.id ? <span className={styles.miniSpin} /> : s}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.detailActions}>
                <a
                  href={`https://wa.me/${selected.customer_phone?.replace(/^0/, '234')}?text=${encodeURIComponent(`Hi ${selected.customer_name}! Your order at Riannie's Kitchen is now ${selected.status}. 🍜`)}`}
                  target="_blank" rel="noreferrer"
                  className={styles.waBtn}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Notify Customer
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
