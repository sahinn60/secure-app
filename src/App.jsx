import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import City from './components/City'
import Car from './components/Car'
import Modal from './components/Modal'
import MiniMap from './components/MiniMap'
import UI from './components/UI'

function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => { setFadeOut(true); setTimeout(onDone, 600) }, 400)
          return 100
        }
        return p + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#87CEEB',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.6s ease',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{
          fontSize: '11px', letterSpacing: '6px', color: '#6366f1',
          fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase'
        }}>PORTFOLIO · 3D EXPERIENCE</div>

        <div style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 900, letterSpacing: '4px',
          background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc, #818cf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '6px'
        }}>MD SAHIN AHMMED</div>

        <div style={{ fontSize: '13px', color: '#4b5563', letterSpacing: '3px', marginBottom: '48px' }}>
          FULL STACK DEVELOPER · ENTREPRENEUR
        </div>

        {/* Progress bar */}
        <div style={{
          width: '280px', height: '2px',
          background: 'rgba(99,102,241,0.15)',
          borderRadius: '2px', margin: '0 auto 12px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
            borderRadius: '2px',
            boxShadow: '0 0 12px rgba(99,102,241,0.8)',
            transition: 'width 0.04s linear'
          }} />
        </div>
        <div style={{ fontSize: '11px', color: '#374151', letterSpacing: '2px' }}>
          {progress < 100 ? `LOADING CITY... ${progress}%` : 'READY — ENTER CITY'}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [modal, setModal] = useState(null)
  const [carPos, setCarPos] = useState([0, 0, 0])
  const [carAngle, setCarAngle] = useState(0)
  const [tooltip, setTooltip] = useState(null)
  const [dpr, setDpr] = useState(1)

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#87CEEB' }}>
        <Canvas
          shadows={false}
          dpr={dpr}
          camera={{ position: [0, 10, 16], fov: 55 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          frameloop="always"
        >
          <PerformanceMonitor onDecline={() => setDpr(0.75)} onIncline={() => setDpr(1)} />
          <color attach="background" args={['#87CEEB']} />
          <fog attach="fog" args={['#c9e8f5', 60, 130]} />
          <ambientLight intensity={1.4} color="#ffffff" />
          <directionalLight position={[30, 50, 20]} intensity={2.2} color="#fff8e7" />
          <hemisphereLight args={['#87CEEB', '#a8d5a2', 0.9]} />
          <City onEnterZone={setModal} onTooltip={setTooltip} />
          <Car onMove={(pos, angle) => { setCarPos(pos); setCarAngle(angle) }} />
        </Canvas>
        <UI />
        <MiniMap carPos={carPos} carAngle={carAngle} />
        {tooltip && (
          <div style={{
            position: 'fixed', bottom: '140px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(10,10,20,0.95)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '12px', padding: '10px 20px', zIndex: 600,
            color: '#a5b4fc', fontSize: '13px', fontWeight: 700,
            letterSpacing: '1px', backdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px rgba(99,102,241,0.2)',
            animation: 'tooltipIn 0.2s ease',
            fontFamily: "'Segoe UI', sans-serif"
          }}>
            <style>{`@keyframes tooltipIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
            {tooltip.icon} {tooltip.label} — <span style={{ color: '#e0e7ff' }}>Drive closer to enter</span>
          </div>
        )}
        {modal && <Modal data={modal} onClose={() => setModal(null)} />}
      </div>
    </>
  )
}
