import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useCategories } from '../../hooks/useData'
import toast from 'react-hot-toast'
import styles from './AdminCategories.module.css'

const EMPTY = { name: '', slug: '', icon: '🍜', sort_order: 0 }

export default function AdminCategories() {
  const { categories, loading } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  // Re-fetch hack: bump a counter to remount
  const [tick, setTick] = useState(0)
  const refresh = () => setTick(t => t + 1)

  const openAdd = () => { setForm(EMPTY); setEditCat(null); setShowModal(true) }
  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '🍜', sort_order: cat.sort_order || 0 })
    setEditCat(cat)
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditCat(null); setForm(EMPTY) }

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }
    setSaving(true)
    const payload = { name: form.name.trim(), slug: form.slug.trim(), icon: form.icon.trim() || '🍜', sort_order: parseInt(form.sort_order) || 0 }
    let error
    if (editCat) {
      ;({ error } = await supabase.from('categories').update(payload).eq('id', editCat.id))
    } else {
      ;({ error } = await supabase.from('categories').insert(payload))
    }
    if (error) { toast.error(error.message) }
    else { toast.success(editCat ? 'Category updated!' : 'Category added!'); closeModal(); window.location.reload() }
    setSaving(false)
  }

  const handleDelete = async (cat) => {
    const count = await supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('category_slug', cat.slug)
    if ((count.count || 0) > 0) {
      toast.error(`Cannot delete — ${count.count} menu items use this category.`)
      return
    }
    if (!window.confirm(`Delete category "${cat.name}"?`)) return
    setDeleting(cat.id)
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); window.location.reload() }
    setDeleting(null)
  }

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <p className={styles.hint}>Categories organise your menu. The slug must be unique and lowercase (e.g. <code>stir</code>, <code>native</code>).</p>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Category</button>
      </div>

      <div className={styles.grid}>
        {categories.map(cat => (
          <div key={cat.id} className={styles.card}>
            <div className={styles.cardIcon}>{cat.icon}</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardName}>{cat.name}</div>
              <div className={styles.cardSlug}>/{cat.slug}</div>
              <div className={styles.cardOrder}>Sort: {cat.sort_order}</div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.editBtn} onClick={() => openEdit(cat)}>✏️</button>
              <button className={styles.delBtn} onClick={() => handleDelete(cat)} disabled={deleting === cat.id}>
                {deleting === cat.id ? <span className={styles.miniSpin} /> : '🗑'}
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <div className={styles.empty}>No categories yet.</div>}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            <div className={styles.mhdr}>
              <h3 className={styles.mtit}>{editCat ? '✏️ Edit Category' : '➕ Add Category'}</h3>
              <button className={styles.mclose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.mbody}>
              <div className={styles.formRow}>
                <div className={styles.fg}>
                  <label className={styles.fl}>Icon (emoji)</label>
                  <input className={styles.fi} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🍜" maxLength={4} />
                </div>
                <div className={`${styles.fg} ${styles.grow}`}>
                  <label className={styles.fl}>Category Name *</label>
                  <input className={styles.fi} value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editCat ? f.slug : autoSlug(e.target.value) }))}
                    placeholder="e.g. Stir Fry" />
                </div>
              </div>
              <div className={styles.fg}>
                <label className={styles.fl}>Slug (URL-safe) *</label>
                <input className={styles.fi} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: autoSlug(e.target.value) }))} placeholder="e.g. stir-fry" />
                <small className={styles.hint2}>Used in the database — lowercase letters, numbers, hyphens only.</small>
              </div>
              <div className={styles.fg}>
                <label className={styles.fl}>Sort Order</label>
                <input className={styles.fi} type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} placeholder="0" min="0" />
                <small className={styles.hint2}>Lower number = appears first on store.</small>
              </div>
            </div>
            <div className={styles.mftr}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? <span className={styles.miniSpin} /> : (editCat ? '💾 Save' : '✅ Add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
