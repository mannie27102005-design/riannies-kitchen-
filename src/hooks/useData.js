import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ── FALLBACK DATA (shown when Supabase not yet configured) ──────────────────
const FALLBACK_MENU = [
  { id:'sf1', name:'Rich Stir-Fry Noodles',      description:'Veggie, Sausage and Boiled/Fried Egg — the perfect everyday combo.', price:2500, category_slug:'stir',    badge:'Best Value', image_url:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'sf2', name:'Loaded Stir-Fry Spaghetti',   description:'Veggie, Sausage and Boiled/Fried Egg — rich flavours in every strand.', price:3500, category_slug:'stir',    badge:'Fan Fave',   image_url:'https://images.unsplash.com/photo-1551183053-bf91798d8d63?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'np1', name:'Rich Native Noodles',         description:'Rich palm oil & pepper mix, scent leaf, shredded fish, ponmo and boiled egg.', price:3000, category_slug:'native',  badge:'🌶 Spicy',   image_url:'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'np2', name:'Loaded Native Spaghetti',     description:'Rich palm oil & pepper mix, scent leaf, shredded fish, ponmo and boiled egg.', price:4000, category_slug:'native',  badge:'Bestseller', image_url:'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'up1', name:'Peppered Turkey Midwing',     description:'Well peppered & seasoned turkey midwing — the ultimate protein upgrade.', price:4000, category_slug:'upgrade', badge:'🔥 Hot!',    image_url:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'up2', name:'Peppered Chicken',            description:'Well seasoned & tossed in hot chili sauce — crispy outside, juicy inside.', price:2500, category_slug:'upgrade', badge:'Crispy',     image_url:'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'up3', name:'Peppered Smoked Panla Fish',  description:'Perfectly smoked & peppered Panla fish — full of rich, deep Nigerian flavour.', price:1000, category_slug:'upgrade', badge:'Smoky',      image_url:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'ex1', name:'Extra Spag / Noodles Portion',description:'An extra serving of spaghetti or noodles.', price:500,  category_slug:'extra',   badge:'Add-on',    image_url:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'ex2', name:'Fried Plantain (Dodo)',       description:'Perfectly fried sweet plantain — crispy golden goodness.', price:500,  category_slug:'extra',   badge:'Sweet',      image_url:'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'ex3', name:'Egg (Fried or Boiled)',       description:'Choose your style — golden fried or soft boiled.', price:400,  category_slug:'extra',   badge:'Protein',    image_url:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80', available:true },
  { id:'ex4', name:'Extra Sausage',               description:'Juicy, well-seasoned sausage.', price:400,  category_slug:'extra',   badge:'Tasty',      image_url:'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80', available:true },
]
const FALLBACK_CATS = [
  { id:'c1', name:'Stir Fry',          slug:'stir',    icon:'🥢', sort_order:1 },
  { id:'c2', name:'Native Pack',       slug:'native',  icon:'🌶', sort_order:2 },
  { id:'c3', name:'Protein Upgrades',  slug:'upgrade', icon:'🔥', sort_order:3 },
  { id:'c4', name:'Extras',            slug:'extra',   icon:'➕', sort_order:4 },
]
const FALLBACK_CONFIG = {
  whatsapp:'2348084378019', email:'rianniekitchen@gmail.com',
  location:'LASU Ojo Campus, Lagos',
  hours:'Monday – Saturday, 12:00 PM – 7:00 PM',
  store_open:'true', delivery_available:'true'
}

const isConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  return url && !url.includes('your-project')
}

// ── MENU ITEMS ───────────────────────────────────────────────────────────────
export function useMenuItems(categorySlug = null) {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    if (!isConfigured()) {
      const data = categorySlug && categorySlug !== 'all'
        ? FALLBACK_MENU.filter(i => i.category_slug === categorySlug)
        : FALLBACK_MENU
      setItems(data)
      setLoading(false)
      return
    }
    let q = supabase.from('menu_items').select('*').order('sort_order')
    if (categorySlug && categorySlug !== 'all') q = q.eq('category_slug', categorySlug)
    const { data, error } = await q
    if (error) { setError(error.message); setItems(FALLBACK_MENU) }
    else setItems(data || [])
    setLoading(false)
  }, [categorySlug])

  useEffect(() => { fetch() }, [fetch])
  return { items, loading, error, refetch: fetch }
}

// ── CATEGORIES ───────────────────────────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!isConfigured()) {
      setCategories(FALLBACK_CATS)
      setLoading(false)
      return
    }
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories(data || FALLBACK_CATS)
      setLoading(false)
    })
  }, [])

  return { categories, loading }
}

// ── STORE CONFIG ─────────────────────────────────────────────────────────────
export function useStoreConfig() {
  const [config,  setConfig]  = useState(FALLBACK_CONFIG)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!isConfigured()) { setLoading(false); return }
    const { data } = await supabase.from('store_config').select('*')
    if (data) {
      const obj = {}
      data.forEach(row => { obj[row.key] = row.value })
      setConfig(obj)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { config, loading, refetch: fetch }
}

// ── ORDERS ───────────────────────────────────────────────────────────────────
export function useOrders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    if (!isConfigured()) { setLoading(false); return }
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { orders, loading, refetch: fetch }
}
