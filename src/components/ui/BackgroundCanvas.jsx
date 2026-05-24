import { useEffect, useRef } from 'react'

const EMOJIS = ['🍜', '🌶️', '🥚', '🍝', '🔥', '✨', '🌟', '🍃']

export default function BackgroundCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const cx = cv.getContext('2d')
    let animId

    const resize = () => { cv.width = innerWidth; cv.height = innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 1.5, o: Math.random(), sp: Math.random() * 0.35 + 0.08
    }))

    const ptcl = Array.from({ length: 14 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      em: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      sz: Math.random() * 14 + 9, vy: -(Math.random() * 0.28 + 0.08),
      vx: (Math.random() - 0.5) * 0.18, o: Math.random() * 0.22 + 0.04
    }))

    const blobs = [
      { x: 0.18, y: 0.28, r: 0.28, c: 'rgba(211,84,0,.07)' },
      { x: 0.82, y: 0.58, r: 0.32, c: 'rgba(232,98,26,.055)' },
      { x: 0.5, y: 0.82, r: 0.22, c: 'rgba(255,140,0,.045)' },
      { x: 0.08, y: 0.75, r: 0.18, c: 'rgba(200,75,0,.04)' },
      { x: 0.65, y: 0.15, r: 0.2, c: 'rgba(255,180,50,.03)' },
    ]

    let t = 0
    const draw = () => {
      cx.clearRect(0, 0, cv.width, cv.height)

      const g = cx.createRadialGradient(cv.width * 0.5, cv.height * 0.3, 0, cv.width * 0.5, cv.height * 0.55, cv.width * 0.72)
      g.addColorStop(0, 'rgba(211,84,0,.10)')
      g.addColorStop(1, 'rgba(255,248,242,0)')
      cx.fillStyle = g; cx.fillRect(0, 0, cv.width, cv.height)

      blobs.forEach(b => {
        const bx = b.x * cv.width + Math.sin(t * 0.28 + b.x * 9) * 32
        const by = b.y * cv.height + Math.cos(t * 0.19 + b.y * 8) * 22
        const rr = b.r * cv.width
        const bg = cx.createRadialGradient(bx, by, 0, bx, by, rr)
        bg.addColorStop(0, b.c); bg.addColorStop(1, 'rgba(0,0,0,0)')
        cx.beginPath(); cx.arc(bx, by, rr, 0, Math.PI * 2)
        cx.fillStyle = bg; cx.fill()
      })

      stars.forEach(s => {
        s.o = 0.08 + 0.3 * (0.5 + 0.5 * Math.sin(t * s.sp + s.x))
        cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        cx.fillStyle = `rgba(180,80,0,${s.o})`; cx.fill()
      })

      ptcl.forEach(p => {
        p.y += p.vy; p.x += p.vx
        if (p.y < -40) { p.y = cv.height + 18; p.x = Math.random() * cv.width }
        cx.globalAlpha = p.o
        cx.font = `${p.sz}px serif`
        cx.fillText(p.em, p.x, p.y)
        cx.globalAlpha = 1
      })

      t += 0.01
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={ref} style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none'
    }} />
  )
}
