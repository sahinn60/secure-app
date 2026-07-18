import { useState, useEffect, useRef } from 'react'

export default function UI() {
  const [time, setTime] = useState(new Date())
  const [speed, setSpeed] = useState(0)
  const joystickRef = useRef(null)
  const activeTouch = useRef(null)
  const center = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Joystick handlers
  const onJoyStart = (e) => {
    const touch = e.touches ? e.touches[0] : e
    const rect = joystickRef.current.getBoundingClientRect()
    center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    activeTouch.current = touch.identifier ?? 'mouse'
    handleJoyMove(touch)
  }

  const handleJoyMove = (touch) => {
    const dx = (touch.clientX - center.current.x) / 40
    const dy = (touch.clientY - center.current.y) / 40
    const len = Math.sqrt(dx * dx + dy * dy)
    const nx = len > 1 ? dx / len : dx
    const ny = len > 1 ? dy / len : dy
    window.__setJoystick?.(nx, ny)
    setSpeed(Math.round(Math.min(len, 1) * 100))
  }

  const onJoyMove = (e) => {
    const touch = e.touches
      ? Array.from(e.touches).find(t => t.identifier === activeTouch.current)
      : e
    if (touch) handleJoyMove(touch)
  }

  const onJoyEnd = () => {
    activeTouch.current = null
    window.__setJoystick?.(0, 0)
    setSpeed(0)
  }

  return (
    <>
      {/* Top gradient bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)',
        zIndex: 400, pointerEvents: 'none'
      }} />

      {/* Name & Title */}
      <div style={{
        position: 'fixed', top: '18px', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 500, pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '26px', fontWeight: 900, letterSpacing: '5px',
          background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8, #0369a1)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))'
        }}>MD SAHIN AHMMED</div>
        <div style={{
          fontSize: '11px', color: '#374151', marginTop: '5px',
          fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase'
        }}>Full Stack Developer · Digital Entrepreneur · Bangladesh</div>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
          {['React', 'Next.js', 'Laravel', 'WordPress', 'UI/UX'].map(s => (
            <span key={s} style={{
              fontSize: '9px', padding: '2px 8px',
              background: 'rgba(30,58,138,0.08)',
              border: '1px solid rgba(30,58,138,0.25)',
              borderRadius: '20px', color: '#1e3a8a', fontWeight: 600, letterSpacing: '0.5px'
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Top Left — HUD */}
      <div style={{
        position: 'fixed', top: '18px', left: '18px', zIndex: 500,
        background: 'rgba(8,8,16,0.88)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '14px', padding: '12px 16px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#e0e0e0', fontFamily: 'monospace', letterSpacing: '2px' }}>
          {time.toLocaleTimeString()}
        </div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '1px' }}>
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700, letterSpacing: '1.5px' }}>ONLINE</span>
          <span style={{ fontSize: '10px', color: '#333', marginLeft: '6px' }}>SPD: <span style={{ color: '#a78bfa' }}>{speed}</span></span>
        </div>
      </div>

      {/* Top Right — Landmarks */}
      <div style={{
        position: 'fixed', top: '18px', right: '18px', zIndex: 500,
        background: 'rgba(8,8,16,0.88)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px', padding: '14px 16px', minWidth: '175px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '9px', color: '#333', fontWeight: 700, letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
          🏙 LANDMARKS
        </div>
        {[
          { color: '#a78bfa', label: 'About Me',  sub: 'Left Tower'   },
          { color: '#60a5fa', label: 'Projects',  sub: 'Right Tower'  },
          { color: '#4ade80', label: 'Contact',   sub: 'South Tower'  },
        ].map((z) => (
          <div key={z.label} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '7px', padding: '7px 10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '10px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: z.color, boxShadow: `0 0 6px ${z.color}` }} />
            <div>
              <div style={{ fontSize: '12px', color: '#d0d0d0', fontWeight: 700 }}>{z.label}</div>
              <div style={{ fontSize: '9px', color: '#333', marginTop: '1px' }}>{z.sub}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: '9px', color: '#2a2a3a', marginTop: '6px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '7px' }}>
          Drive close to explore ↑
        </div>
      </div>

      {/* Bottom Left — Controls */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '18px', zIndex: 500,
        background: 'rgba(8,8,16,0.88)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px', padding: '14px 16px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '9px', color: '#333', fontWeight: 700, letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
          🎮 KEYBOARD
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginBottom: '8px' }}>
          <Key label="W" />
          <div style={{ display: 'flex', gap: '3px' }}>
            <Key label="A" /><Key label="S" /><Key label="D" />
          </div>
        </div>
        <div style={{ fontSize: '9px', color: '#2a2a3a', textAlign: 'center' }}>or Arrow Keys</div>
      </div>

      {/* Bottom Center — Joystick for mobile/mouse */}
      <div
        ref={joystickRef}
        onMouseDown={onJoyStart}
        onMouseMove={(e) => activeTouch.current === 'mouse' && onJoyMove(e)}
        onMouseUp={onJoyEnd}
        onMouseLeave={onJoyEnd}
        onTouchStart={onJoyStart}
        onTouchMove={onJoyMove}
        onTouchEnd={onJoyEnd}
        style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          width: '90px', height: '90px', zIndex: 500,
          background: 'rgba(8,8,16,0.88)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: '50%', cursor: 'grab',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(167,139,250,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          userSelect: 'none'
        }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
          boxShadow: '0 0 12px rgba(167,139,250,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', pointerEvents: 'none'
        }}>🕹</div>
      </div>

      {/* Bottom gradient */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(0deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
        zIndex: 400, pointerEvents: 'none'
      }} />
    </>
  )
}

function Key({ label }) {
  return (
    <div style={{
      width: '30px', height: '30px',
      background: 'rgba(167,139,250,0.08)',
      border: '1px solid rgba(167,139,250,0.2)',
      borderBottom: '3px solid rgba(167,139,250,0.3)',
      borderRadius: '7px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: '12px', fontWeight: 800, color: '#7c6fa0'
    }}>{label}</div>
  )
}
