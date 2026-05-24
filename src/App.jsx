import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/layout/Navbar'
import Loader from './components/ui/Loader'
import CartSidebar from './components/cart/CartSidebar'

import Home from './pages/Home'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMenu from './pages/admin/AdminMenu'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'

import { useStoreConfig } from './hooks/useData'
import './index.css'

// Store shell — wraps the public-facing site with nav + cart
function StoreShell() {
  const { config } = useStoreConfig()
  return (
    <>
      <Navbar />
      <CartSidebar waNumber={config.whatsapp} email={config.email} />
      <Home />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Loader />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(255,248,242,.97)',
                border: '1px solid rgba(211,84,0,.2)',
                color: '#1A0A00',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.84rem',
                boxShadow: '0 0 22px rgba(211,84,0,.12)',
              },
              success: { iconTheme: { primary: '#D35400', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ── PUBLIC STORE ─────────────────── */}
            <Route path="/" element={<StoreShell />} />

            {/* ── ADMIN LOGIN (standalone page) ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* legacy /admin → redirect to login */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* ── ADMIN DASHBOARD (protected, has sidebar) ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard"  element={<AdminDashboard />} />
              <Route path="menu"       element={<AdminMenu />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders"     element={<AdminOrders />} />
              <Route path="settings"   element={<AdminSettings />} />
            </Route>

            {/* catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
