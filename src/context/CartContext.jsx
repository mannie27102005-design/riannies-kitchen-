import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const { item, qty = 1 } = action
      const existing = state.items.find(i => i.id === item.id)
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i) }
      }
      return { ...state, items: [...state.items, { ...item, qty }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY': {
      const { id, delta } = action
      return {
        ...state,
        items: state.items
          .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
          .filter(i => i.qty > 0)
      }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE':
      return { ...state, open: !state.open }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false })

  const addItem = useCallback((item, qty = 1) => dispatch({ type: 'ADD', item, qty }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const updateQty = useCallback((id, delta) => dispatch({ type: 'UPDATE_QTY', id, delta }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), [])

  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = state.items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ ...state, total, count, addItem, removeItem, updateQty, clearCart, toggleCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
