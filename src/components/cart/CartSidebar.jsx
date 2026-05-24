import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import styles from './CartSidebar.module.css'

export default function CartSidebar({ waNumber, email }) {
  const { items, total, count, open, closeCart, removeItem, updateQty, clearCart } = useCart()
  const [showOrder, setShowOrder] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', type: 'pickup', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const buildMsg = () => {
    let m = `🍜 *NEW ORDER — Riannie's Kitchen*\n\n`
    m += `👤 *Customer:* ${form.name}\n📱 *Phone:* ${form.phone}\n`
    m += `📦 *Order Type:* ${form.type === 'pickup' ? 'Campus Pickup' : 'Delivery'}\n`
    if (form.type === 'delivery' && form.address) m += `📍 *Address:* ${form.address}\n`
    m += `\n🛒 *Order Items:*\n`
    items.forEach(i => m += `• ${i.qty}× ${i.name} — ₦${(i.price * i.qty).toLocaleString()}\n`)
    m += `\n💰 *Total: ₦${total.toLocaleString()}*`
    if (form.notes) m += `\n📝 *Notes:* ${form.notes}`
    m += `\n\n⏰ ${new Date().toLocaleString('en-NG')}`
    return m
  }

  const saveOrder = async () => {
    const { error } = await supabase.from('orders').insert({
      customer_name: form.name,
      customer_phone: form.phone,
      order_type: form.type,
      delivery_address: form.address || null,
      notes: form.notes || null,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total,
      status: 'pending'
    })
    if (error) console.error('Order save error:', error)
  }

  const handleWA = async () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return }
    if (!form.phone.trim()) { toast.error('Please enter your phone number'); return }
    setSubmitting(true)
    await saveOrder()
    const msg = buildMsg()
    const wa = waNumber || '2348084378019'
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
    toast.success('Opening WhatsApp...')
    clearCart(); setShowOrder(false); closeCart()
    setSubmitting(false)
  }

  const handleEmail = async () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return }
    setSubmitting(true)
    await saveOrder()
    const msg = buildMsg().replace(/\*/g, '')
    const subj = `New Order from ${form.name} — Riannie's Kitchen`
    const to = email || 'rianniekitchen@gmail.com'
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(msg)}`
    clearCart(); setShowOrder(false); closeCart()
    setSubmitting(false)
  }

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.on : ''}`} onClick={closeCart} />
      <div className={`${styles.sidebar} ${open ? styles.on : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>🛒 Your Order</h3>
          <button className={styles.closeBtn} onClick={closeCart}>✕</button>
        </div>

        {!showOrder ? (
          <>
            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🍜</div>
                  <p>Your cart is empty.<br />Add some deliciousness!</p>
                </div>
              ) : items.map(item => (
                <div key={item.id} className={styles.item}>
                  <img src={item.image_url} alt={item.name} className={styles.itemImg} onError={e => { e.target.style.background = '#FFE8D6'; e.target.style.opacity = 0 }} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPrice}>₦{(item.price * item.qty).toLocaleString()}</div>
                    <div className={styles.itemCtrl}>
                      <button className={styles.cqb} onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className={styles.cqn}>{item.qty}</span>
                      <button className={styles.cqb} onClick={() => updateQty(item.id, 1)}>+</button>
                      <span className={styles.unitPrice}>× ₦{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>🗑</button>
                </div>
              ))}
            </div>
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmt}>₦{total.toLocaleString()}</span>
              </div>
              <p className={styles.note}>📦 Box &amp; nylon packaging included</p>
              <button className={styles.orderBtn} disabled={count === 0} onClick={() => setShowOrder(true)}>
                Place Order →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.items} style={{ padding: '14px 22px' }}>
              <button className={styles.backBtn} onClick={() => setShowOrder(false)}>← Back to Cart</button>
              <h4 className={styles.formTitle}>📋 Complete Your Order</h4>

              <div className={styles.fg}>
                <label className={styles.fl}>Your Name</label>
                <input className={styles.fi} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter your full name" />
              </div>
              <div className={styles.fg}>
                <label className={styles.fl}>Phone Number</label>
                <input className={styles.fi} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 08012345678" />
              </div>
              <div className={styles.fg}>
                <label className={styles.fl}>Order Type</label>
                <div className={styles.dtog}>
                  <div className={`${styles.dopt} ${form.type === 'pickup' ? styles.on : ''}`} onClick={() => setForm(f => ({ ...f, type: 'pickup' }))}>🏪 Campus Pickup</div>
                  <div className={`${styles.dopt} ${form.type === 'delivery' ? styles.on : ''}`} onClick={() => setForm(f => ({ ...f, type: 'delivery' }))}>🛵 Delivery</div>
                </div>
              </div>
              {form.type === 'delivery' && (
                <div className={styles.fg}>
                  <label className={styles.fl}>Delivery Address</label>
                  <input className={styles.fi} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Enter delivery address on campus" />
                </div>
              )}
              <div className={styles.fg}>
                <label className={styles.fl}>Special Notes (Optional)</label>
                <textarea className={styles.fta} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. extra spicy, no onions..." />
              </div>

              <div className={styles.summary}>
                <div className={styles.sumTitle}>📝 Order Summary</div>
                {items.map(i => (
                  <div key={i.id} className={styles.sumRow}>
                    <span>{i.qty}× {i.name.length > 32 ? i.name.slice(0, 32) + '…' : i.name}</span>
                    <span>₦{(i.price * i.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className={styles.sumTotal}><span>Total</span><span>₦{total.toLocaleString()}</span></div>
              </div>
            </div>
            <div className={styles.footer}>
              <button className={styles.waBtn} onClick={handleWA} disabled={submitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send via WhatsApp
              </button>
              <button className={styles.emailBtn} onClick={handleEmail} disabled={submitting}>📧 Send via Email</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
