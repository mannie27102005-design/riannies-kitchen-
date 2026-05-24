import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useStoreConfig } from '../../hooks/useData'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './AdminSettings.module.css'

export default function AdminSettings() {
  const { config, loading, refetch } = useStoreConfig()
  const { user } = useAuth()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ newPassword: '', confirm: '' })
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    if (!loading) setForm({ ...config })
  }, [config, loading])

  const handleSave = async () => {
    setSaving(true)
    const updates = Object.entries(form).map(([key, value]) =>
      supabase.from('store_config').upsert({ key, value, updated_at: new Date().toISOString() })
    )
    const results = await Promise.all(updates)
    const err = results.find(r => r.error)
    if (err) toast.error(err.error.message)
    else { toast.success('Settings saved!'); refetch() }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    if (!pwForm.newPassword) { toast.error('Enter a new password'); return }
    if (pwForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPassword })
    if (error) toast.error(error.message)
    else { toast.success('Password updated!'); setPwForm({ newPassword: '', confirm: '' }) }
    setSavingPw(false)
  }

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      {/* Store Info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🏪 Store Information</h2>
        <p className={styles.sectionDesc}>This info appears in the footer and order messages.</p>
        <div className={styles.formGrid}>
          <div className={styles.fg}>
            <label className={styles.fl}>WhatsApp Number</label>
            <input className={styles.fi} value={form.whatsapp || ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="2348084378019" />
            <small className={styles.hint}>Include country code, no + (e.g. 2348012345678)</small>
          </div>
          <div className={styles.fg}>
            <label className={styles.fl}>Business Email</label>
            <input className={styles.fi} type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="rianniekitchen@gmail.com" />
          </div>
          <div className={styles.fg}>
            <label className={styles.fl}>Location</label>
            <input className={styles.fi} value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="LASU Ojo Campus, Lagos" />
          </div>
          <div className={styles.fg}>
            <label className={styles.fl}>Opening Hours</label>
            <input className={styles.fi} value={form.hours || ''} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="Monday – Saturday, 12:00 PM – 7:00 PM" />
          </div>
        </div>
      </div>

      {/* Store Status */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Store Status</h2>
        <p className={styles.sectionDesc}>Control what customers can see and do on the store.</p>
        <div className={styles.toggleRow}>
          <div className={styles.toggleItem}>
            <div>
              <div className={styles.toggleLabel}>Store Open</div>
              <div className={styles.toggleDesc}>Show "Pre-orders Open" badge on the storefront</div>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" checked={form.store_open === 'true'} onChange={e => setForm(f => ({ ...f, store_open: e.target.checked ? 'true' : 'false' }))} />
              <span className={styles.toggleSlider} />
            </label>
          </div>
          <div className={styles.toggleItem}>
            <div>
              <div className={styles.toggleLabel}>Delivery Available</div>
              <div className={styles.toggleDesc}>Allow customers to choose delivery as an option</div>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" checked={form.delivery_available === 'true'} onChange={e => setForm(f => ({ ...f, delivery_available: e.target.checked ? 'true' : 'false' }))} />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
        {saving ? <span className={styles.spinner2} /> : '💾 Save All Settings'}
      </button>

      {/* Password */}
      <div className={styles.section} style={{ marginTop: 32 }}>
        <h2 className={styles.sectionTitle}>🔐 Change Password</h2>
        <p className={styles.sectionDesc}>Signed in as <strong>{user?.email}</strong></p>
        <div className={styles.formGrid}>
          <div className={styles.fg}>
            <label className={styles.fl}>New Password</label>
            <input className={styles.fi} type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Min 8 characters" />
          </div>
          <div className={styles.fg}>
            <label className={styles.fl}>Confirm Password</label>
            <input className={styles.fi} type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" />
          </div>
        </div>
        <button className={styles.pwBtn} onClick={handlePasswordChange} disabled={savingPw}>
          {savingPw ? <span className={styles.spinner2} /> : '🔑 Update Password'}
        </button>
      </div>

      {/* Supabase Setup Guide */}
      <div className={styles.section} style={{ marginTop: 32 }}>
        <h2 className={styles.sectionTitle}>📖 Supabase Setup Guide</h2>
        <div className={styles.guide}>
          <div className={styles.guideStep}>
            <span className={styles.guideNum}>1</span>
            <div>
              <strong>Create a Supabase project</strong>
              <p>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a> → New Project. Choose a name, database password, and region closest to Nigeria (eu-west or us-east).</p>
            </div>
          </div>
          <div className={styles.guideStep}>
            <span className={styles.guideNum}>2</span>
            <div>
              <strong>Run the SQL schema</strong>
              <p>In your Supabase dashboard → SQL Editor → paste the contents of <code>supabase_schema.sql</code> (included in the zip) and click Run. This creates all tables, seed data, and security policies.</p>
            </div>
          </div>
          <div className={styles.guideStep}>
            <span className={styles.guideNum}>3</span>
            <div>
              <strong>Create a Storage bucket</strong>
              <p>Go to Storage → New bucket → name it <code>menu-images</code> → set it to <strong>Public</strong>. This lets you upload food photos from the admin panel.</p>
            </div>
          </div>
          <div className={styles.guideStep}>
            <span className={styles.guideNum}>4</span>
            <div>
              <strong>Create your admin user</strong>
              <p>Go to Authentication → Users → Invite User (or Add User) → enter your email and a strong password. This is the login for this admin dashboard.</p>
            </div>
          </div>
          <div className={styles.guideStep}>
            <span className={styles.guideNum}>5</span>
            <div>
              <strong>Add your API keys to .env</strong>
              <p>Go to Settings → API → copy <strong>Project URL</strong> and <strong>anon public key</strong>. Create a <code>.env</code> file in the project root:</p>
              <pre className={styles.code}>{`VITE_SUPABASE_URL=https://xxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGci...`}</pre>
            </div>
          </div>
          <div className={styles.guideStep}>
            <span className={styles.guideNum}>6</span>
            <div>
              <strong>Run the app</strong>
              <p>In your terminal: <code>npm install</code> then <code>npm run dev</code>. Visit <code>http://localhost:5173</code> to see the store, and <code>/admin</code> to log in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
