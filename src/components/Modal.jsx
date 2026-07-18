import { useEffect, useRef } from 'react'

const SECTIONS = {
  about: {
    icon: '👨‍💻',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,165,250,0.05))',
    border: 'rgba(167,139,250,0.3)',
    title: 'MD Sahin Ahmmed',
    subtitle: 'Full Stack Developer & Digital Entrepreneur',
    items: [
      { icon: '🌍', label: 'Location', value: 'Bangladesh' },
      { icon: '💼', label: 'Role', value: 'Full Stack Developer' },
      { icon: '🚀', label: 'Focus', value: 'Digital Entrepreneurship' },
    ],
    skills: [
      { name: 'React.js / Next.js', level: 90, color: '#60a5fa' },
      { name: 'Laravel / WordPress', level: 85, color: '#a78bfa' },
      { name: 'UI/UX Design', level: 80, color: '#4ade80' },
      { name: 'E-commerce Strategy', level: 88, color: '#f472b6' },
    ]
  },
  projects: {
    icon: '🚀',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.05))',
    border: 'rgba(96,165,250,0.3)',
    title: 'Featured Projects',
    subtitle: 'Building digital solutions that matter',
    projects: [
      {
        name: 'CrackNCode Premium',
        desc: 'A premium digital product store offering curated tools and software.',
        role: 'Founder & Developer',
        tech: ['React', 'Laravel', 'E-commerce'],
        color: '#a78bfa'
      },
      {
        name: 'Jibran Food',
        desc: 'E-commerce brand specializing in organic food products.',
        role: 'Owner & Business Strategist',
        tech: ['WordPress', 'WooCommerce', 'SEO'],
        color: '#4ade80'
      },
      {
        name: 'Interactive Portfolio',
        desc: 'A 3D immersive web experience built with React Three Fiber.',
        role: 'Designer & Developer',
        tech: ['React', 'Three.js', 'R3F'],
        color: '#60a5fa'
      },
    ]
  },
  contact: {
    icon: '📬',
    color: '#4ade80',
    gradient: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(96,165,250,0.05))',
    border: 'rgba(74,222,128,0.3)',
    title: "Let's Work Together",
    subtitle: "Open for freelance & collaboration opportunities",
    links: [
      { icon: '📧', label: 'Email', value: 'sahinahmmed63@gmail.com', href: 'mailto:sahinahmmed63@gmail.com', color: '#a78bfa' },
      { icon: '🐙', label: 'GitHub', value: 'github.com/sahinn60', href: 'https://github.com/sahinn60', color: '#60a5fa' },
      { icon: '📍', label: 'Location', value: 'Bangladesh 🇧🇩', href: null, color: '#4ade80' },
    ]
  }
}

export default function Modal({ data, onClose }) {
  const key = data.key
  const sec = SECTIONS[key] || {}
  const overlayRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div ref={overlayRef} onClick={(e) => e.target === overlayRef.current && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .skill-bar { transition: width 1s ease; }
        .modal-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
      `}</style>

      <div style={{
        background: '#0d1117',
        border: `1px solid ${sec.border || 'rgba(255,255,255,0.1)'}`,
        borderRadius: '20px', width: '90%', maxWidth: '580px',
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: `0 0 60px ${sec.color}22, 0 20px 60px rgba(0,0,0,0.6)`,
        animation: 'slideUp 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          background: sec.gradient,
          borderBottom: `1px solid ${sec.border || 'rgba(255,255,255,0.06)'}`,
          borderRadius: '20px 20px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: `${sec.color}22`, border: `1px solid ${sec.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px'
            }}>{sec.icon}</div>
            <div>
              <h2 style={{ color: '#e0e0e0', fontSize: '18px', fontWeight: 800, margin: 0 }}>{sec.title}</h2>
              <p style={{ color: '#666', fontSize: '12px', margin: '3px 0 0', fontWeight: 500 }}>{sec.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
            color: '#f87171', borderRadius: '10px', padding: '7px 14px',
            cursor: 'pointer', fontSize: '12px', fontWeight: 700,
            transition: 'all 0.2s'
          }}>ESC ✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>

          {/* ABOUT */}
          {key === 'about' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {sec.items.map(item => (
                  <div key={item.label} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px', padding: '12px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: 700, marginTop: '2px' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '8px', fontSize: '11px', color: '#555', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Skills & Expertise</div>
              {sec.skills.map(s => (
                <div key={s.name} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#c9d1d9', fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontSize: '12px', color: s.color, fontWeight: 700 }}>{s.level}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.level}%`, background: s.color, borderRadius: '4px', boxShadow: `0 0 8px ${s.color}88` }} />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* PROJECTS */}
          {key === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sec.projects.map(p => (
                <div key={p.name} className="modal-card" style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px', padding: '16px',
                  borderLeft: `3px solid ${p.color}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ fontSize: '14px', color: '#e0e0e0', fontWeight: 800 }}>{p.name}</div>
                    <span style={{ fontSize: '10px', color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}33`, padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>{p.role}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>{p.desc}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {p.tech.map(t => (
                      <span key={t} style={{ fontSize: '10px', color: '#888', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CONTACT */}
          {key === 'contact' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {sec.links.map(l => (
                  <div key={l.label} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px', padding: '14px 16px'
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: `${l.color}18`, border: `1px solid ${l.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0
                    }}>{l.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l.label}</div>
                      <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: 600, marginTop: '2px' }}>{l.value}</div>
                    </div>
                    {l.href && (
                      <a href={l.href} target="_blank" rel="noreferrer" style={{
                        padding: '6px 14px', background: `${l.color}18`,
                        border: `1px solid ${l.color}33`, color: l.color,
                        borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 700
                      }}>Open →</a>
                    )}
                  </div>
                ))}
              </div>
              <a href="mailto:sahinahmmed63@gmail.com" style={{
                display: 'block', textAlign: 'center', padding: '14px',
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                color: 'white', borderRadius: '12px', textDecoration: 'none',
                fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px',
                boxShadow: '0 4px 20px rgba(167,139,250,0.3)'
              }}>✉️ Send Me a Message</a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
