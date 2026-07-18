export default function MiniMap({ carPos }) {
  const SIZE = 180
  const WORLD = 70
  const s = SIZE / WORLD

  const toMap = (wx, wz) => ({
    x: (wx + WORLD / 2) * s,
    y: (wz + WORLD / 2) * s,
  })

  const carDot = toMap(carPos[0], carPos[2])

  const zones = [
    { id: 'A', label: 'About',    wx: -14, wz: -12, color: '#2563eb' },
    { id: 'P', label: 'Projects', wx: 14,  wz: -12, color: '#16a34a' },
    { id: 'C', label: 'Contact',  wx: 0,   wz: 16,  color: '#dc2626' },
  ]

  // City blocks for map background
  const blocks = [
    { wx: -21, wz: -21, w: 10, h: 10 },
    { wx: -21, wz: -3,  w: 10, h: 10 },
    { wx: -21, wz: 15,  w: 10, h: 10 },
    { wx: -3,  wz: -21, w: 10, h: 10 },
    { wx: -3,  wz: 15,  w: 10, h: 10 },
    { wx: 11,  wz: -21, w: 10, h: 10 },
    { wx: 11,  wz: -3,  w: 10, h: 10 },
    { wx: 11,  wz: 15,  w: 10, h: 10 },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: `${SIZE}px`, height: `${SIZE}px`,
      background: '#1a2332',
      border: '2px solid #2d3f55',
      borderRadius: '10px', overflow: 'hidden', zIndex: 500,
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      fontFamily: 'monospace'
    }}>

      {/* City blocks */}
      {blocks.map((b, i) => {
        const p = toMap(b.wx, b.wz)
        return (
          <div key={i} style={{
            position: 'absolute',
            left: p.x, top: p.y,
            width: b.w * s, height: b.h * s,
            background: '#243447',
            border: '1px solid #2d3f55',
          }} />
        )
      })}

      {/* Roads — vertical */}
      <div style={{
        position: 'absolute',
        left: toMap(-3, 0).x, top: 0,
        width: 6 * s, height: SIZE,
        background: '#374151',
      }} />
      {/* Roads — horizontal */}
      <div style={{
        position: 'absolute',
        left: 0, top: toMap(0, -3).y,
        width: SIZE, height: 6 * s,
        background: '#374151',
      }} />
      {/* Road center lines */}
      <div style={{
        position: 'absolute',
        left: toMap(0, 0).x - 0.5, top: 0,
        width: 1, height: SIZE,
        background: '#f9a825', opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        left: 0, top: toMap(0, 0).y - 0.5,
        width: SIZE, height: 1,
        background: '#f9a825', opacity: 0.5,
      }} />

      {/* Zone markers */}
      {zones.map((z) => {
        const p = toMap(z.wx, z.wz)
        return (
          <div key={z.id}>
            <div style={{
              position: 'absolute',
              left: p.x - 10, top: p.y - 10,
              width: 20, height: 20,
              borderRadius: '3px',
              background: z.color + '33',
              border: `1.5px solid ${z.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}>
              <span style={{ fontSize: '8px', color: z.color, fontWeight: 900 }}>{z.id}</span>
            </div>
            {/* Label */}
            <div style={{
              position: 'absolute',
              left: p.x + 12, top: p.y - 5,
              fontSize: '7px', color: z.color,
              fontWeight: 700, whiteSpace: 'nowrap', zIndex: 2,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}>{z.label}</div>
          </div>
        )
      })}

      {/* Car dot */}
      <div style={{
        position: 'absolute',
        left: carDot.x - 5, top: carDot.y - 5,
        width: 10, height: 10,
        background: '#ef4444',
        borderRadius: '50%',
        border: '1.5px solid #fff',
        boxShadow: '0 0 6px #ef4444',
        transition: 'left 0.08s linear, top 0.08s linear',
        zIndex: 10,
      }} />

      {/* Compass */}
      <div style={{
        position: 'absolute', top: 6, right: 8,
        fontSize: '10px', fontWeight: 900, color: '#ef4444',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)', zIndex: 5,
      }}>N</div>
      <div style={{
        position: 'absolute', bottom: 6, right: 8,
        fontSize: '10px', fontWeight: 900, color: '#9ca3af',
        zIndex: 5,
      }}>S</div>
      <div style={{
        position: 'absolute', top: '50%', left: 5,
        transform: 'translateY(-50%)',
        fontSize: '10px', fontWeight: 900, color: '#9ca3af',
        zIndex: 5,
      }}>W</div>
      <div style={{
        position: 'absolute', top: '50%', right: 5,
        transform: 'translateY(-50%)',
        fontSize: '10px', fontWeight: 900, color: '#9ca3af',
        zIndex: 5,
      }}>E</div>

      {/* Title bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '18px',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', paddingLeft: '7px',
        borderBottom: '1px solid #2d3f55', zIndex: 6,
      }}>
        <span style={{ fontSize: '8px', color: '#60a5fa', fontWeight: 800, letterSpacing: '1.5px' }}>MAP</span>
        <span style={{ fontSize: '7px', color: '#4b5563', marginLeft: '6px' }}>
          {Math.round(carPos[0])}, {Math.round(carPos[2])}
        </span>
      </div>

      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.5);opacity:0.2}}`}</style>
    </div>
  )
}
