import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useMenuItems, useCategories } from '../../hooks/useData'
import toast from 'react-hot-toast'
import styles from './AdminMenu.module.css'

const EMPTY = { name: '', description: '', price: '', category_slug: '', badge: '', image_url: '', available: true }

export default function AdminMenu() {
  const { items, loading, refetch } = useMenuItems()
  const { categories } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const openAdd = () => { setForm(EMPTY); setEditItem(null); setShowModal(true) }
  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price, category_slug: item.category_slug, badge: item.badge || '', image_url: item.image_url || '', available: item.available })
    setEditItem(item)
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditItem(null); setForm(EMPTY) }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setUploadingImg(true)
    const ext = file.name.split('.').pop()
    const filename = `menu-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('menu-images').upload(filename, file, { upsert: true })
    if (error) {
      toast.error('Upload failed: ' + error.message)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(filename)
      setForm(f => ({ ...f, image_url: publicUrl }))
      toast.success('Image uploaded!')
    }
    setUploadingImg(false)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.price || isNaN(form.price)) { toast.error('Valid price is required'); return }
    if (!form.category_slug) { toast.error('Category is required'); return }
    setSaving(true)
    const payload = { name: form.name.trim(), description: form.description.trim(), price: parseInt(form.price), category_slug: form.category_slug, badge: form.badge.trim(), image_url: form.image_url.trim(), available: form.available }
    let error
    if (editItem) {
      ({ error } = await supabase.from('menu_items').update(payload).eq('id', editItem.id))
    } else {
      ({ error } = await supabase.from('menu_items').insert(payload))
    }
    if (error) { toast.error(error.message) } else { toast.success(editItem ? 'Item updated!' : 'Item added!'); closeModal(); refetch() }
    setSaving(false)
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    setDeleting(item.id)
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id)
    if (error) toast.error(error.message)
    else { toast.success('Item deleted'); refetch() }
    setDeleting(null)
  }

  const toggleAvail = async (item) => {
    const { error } = await supabase.from('menu_items').update({ available: !item.available }).eq('id', item.id)
    if (error) toast.error(error.message)
    else { toast.success(item.available ? 'Marked unavailable' : 'Marked available'); refetch() }
  }

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || i.category_slug === filterCat
    return matchSearch && matchCat
  })

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <input className={styles.search} placeholder="🔍 Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className={styles.catFilter} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Item</button>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>{[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Badge</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className={!item.available ? styles.rowDisabled : ''}>
                  <td>
                    <div className={styles.imgCell}>
                      {item.image_url ? <img src={item.image_url} alt={item.name} className={styles.tableImg} /> : <div className={styles.noImg}>🍜</div>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemDesc}>{(item.description || '').slice(0, 60)}{item.description?.length > 60 ? '…' : ''}</div>
                  </td>
                  <td><span className={styles.catBadge}>{item.category_slug}</span></td>
                  <td><span className={styles.priceCell}>₦{item.price.toLocaleString()}</span></td>
                  <td>{item.badge && <span className={styles.badgeTag}>{item.badge}</span>}</td>
                  <td>
                    <label className={styles.toggle}>
                      <input type="checkbox" checked={item.available} onChange={() => toggleAvail(item)} />
                      <span className={styles.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(item)}>✏️ Edit</button>
                      <button className={styles.delBtn} onClick={() => handleDelete(item)} disabled={deleting === item.id}>
                        {deleting === item.id ? <span className={styles.miniSpin} /> : '🗑'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className={styles.noItems}>No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editItem ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            <div className={styles.modalBody}>
              {/* Image Upload */}
              <div className={styles.imgUploadArea}>
                {form.image_url ? (
                  <div className={styles.previewWrap}>
                    <img src={form.image_url} alt="preview" className={styles.imgPreview} />
                    <button className={styles.removeImg} onClick={() => setForm(f => ({ ...f, image_url: '' }))}>✕</button>
                  </div>
                ) : (
                  <label className={styles.uploadBox}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    {uploadingImg ? <span className={styles.spinner} /> : <>📷<span>Click to upload image</span><small>JPG, PNG, WebP — max 5MB</small></>}
                  </label>
                )}
                <div className={styles.orDivider}>or paste URL</div>
                <input className={styles.fi} value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://example.com/image.jpg" />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fg}>
                  <label className={styles.fl}>Item Name *</label>
                  <input className={styles.fi} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rich Stir-Fry Noodles" />
                </div>
                <div className={styles.fg}>
                  <label className={styles.fl}>Price (₦) *</label>
                  <input className={styles.fi} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 2500" min="0" />
                </div>
                <div className={styles.fg}>
                  <label className={styles.fl}>Category *</label>
                  <select className={styles.fi} value={form.category_slug} onChange={e => setForm(f => ({ ...f, category_slug: e.target.value }))}>
                    <option value="">Select category…</option>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className={styles.fg}>
                  <label className={styles.fl}>Badge Label</label>
                  <input className={styles.fi} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. Best Value, 🔥 Hot!" />
                </div>
                <div className={`${styles.fg} ${styles.fullWidth}`}>
                  <label className={styles.fl}>Description</label>
                  <textarea className={styles.fta} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the dish…" rows={3} />
                </div>
                <div className={styles.fg}>
                  <label className={styles.fl}>Available</label>
                  <label className={styles.toggleLg}>
                    <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                    <span className={styles.toggleSlider} />
                    <span className={styles.toggleLabel}>{form.available ? 'Available' : 'Unavailable'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? <span className={styles.miniSpin} /> : (editItem ? '💾 Save Changes' : '✅ Add Item')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
