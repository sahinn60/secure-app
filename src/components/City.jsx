import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const ZONES = [
  { id: 'about',    pos: [-20, -18], color: '#2563eb', icon: '👨💻', label: 'Tech Hub' },
  { id: 'projects', pos: [ 20, -18], color: '#16a34a', icon: '🚀',  label: 'Project Showroom' },
  { id: 'contact',  pos: [  0,  22], color: '#dc2626', icon: '📬',  label: 'The Garage' },
]
const MODAL_DATA = {
  about:    { key: 'about',    title: '👨💻 Tech Hub' },
  projects: { key: 'projects', title: '🚀 Projects' },
  contact:  { key: 'contact',  title: '📬 Contact'  },
}

const BUILDINGS = [
  { pos: [-30,-30], w:7,  h:22, d:7,  c:'#78909c', g:'#1565c0' },
  { pos: [-22,-28], w:4,  h:13, d:4,  c:'#eceff1', g:'#90caf9' },
  { pos: [-32,-20], w:4,  h:9,  d:4,  c:'#a1887f', g:'#64b5f6' },
  { pos: [-28,-12], w:5,  h:17, d:5,  c:'#607d8b', g:'#42a5f5' },
  { pos: [-36,-30], w:3,  h:7,  d:3,  c:'#bcaaa4', g:'#bbdefb' },
  { pos: [ 30,-30], w:7,  h:24, d:7,  c:'#546e7a', g:'#0d47a1' },
  { pos: [ 22,-28], w:4,  h:11, d:4,  c:'#bcaaa4', g:'#bbdefb' },
  { pos: [ 32,-20], w:4,  h:15, d:4,  c:'#90a4ae', g:'#1e88e5' },
  { pos: [ 28,-12], w:5,  h:8,  d:4,  c:'#8d6e63', g:'#90caf9' },
  { pos: [ 36,-30], w:3,  h:10, d:3,  c:'#80cbc4', g:'#64b5f6' },
  { pos: [-30, 30], w:6,  h:19, d:6,  c:'#78909c', g:'#1976d2' },
  { pos: [-22, 28], w:4,  h:7,  d:4,  c:'#f5f5f5', g:'#e3f2fd' },
  { pos: [-32, 20], w:4,  h:12, d:4,  c:'#607d8b', g:'#2196f3' },
  { pos: [-28, 12], w:3,  h:6,  d:3,  c:'#ce93d8', g:'#bbdefb' },
  { pos: [-36, 22], w:3,  h:8,  d:3,  c:'#ffcc80', g:'#90caf9' },
  { pos: [ 30, 30], w:6,  h:14, d:6,  c:'#546e7a', g:'#1565c0' },
  { pos: [ 22, 28], w:4,  h:9,  d:4,  c:'#80cbc4', g:'#64b5f6' },
  { pos: [ 32, 20], w:4,  h:18, d:4,  c:'#607d8b', g:'#1e88e5' },
  { pos: [ 28, 12], w:4,  h:7,  d:4,  c:'#ffcc80', g:'#90caf9' },
  { pos: [ 36, 22], w:3,  h:11, d:3,  c:'#ef9a9a', g:'#bbdefb' },
  { pos: [  0,-38], w:8,  h:26, d:8,  c:'#455a64', g:'#0d47a1' },
  { pos: [-38,  0], w:5,  h:20, d:5,  c:'#78909c', g:'#1976d2' },
  { pos: [ 38,  0], w:5,  h:22, d:5,  c:'#546e7a', g:'#1565c0' },
  { pos: [  0, 38], w:7,  h:16, d:7,  c:'#607d8b', g:'#42a5f5' },
  { pos: [-14,-30], w:4,  h:10, d:4,  c:'#90a4ae', g:'#64b5f6' },
  { pos: [ 14,-30], w:4,  h:12, d:4,  c:'#78909c', g:'#1976d2' },
]

function ZoneDetector({ zones, onEnterZone, onTooltip }) {
  const triggered = useRef({})
  const tooltipZone = useRef(null)

  useFrame(({ scene }) => {
    const car = scene.getObjectByName('car')
    if (!car) return
    const cx = car.position.x, cz = car.position.z
    let nearZone = null

    for (const z of zones) {
      const dx = cx - z.pos[0], dz = cz - z.pos[1]
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < 12) nearZone = z
      if (dist < 9 && !triggered.current[z.id]) {
        triggered.current[z.id] = true
        onEnterZone(MODAL_DATA[z.id])
      }
      if (dist >= 9) triggered.current[z.id] = false
    }

    const newId = nearZone?.id ?? null
    if (newId !== tooltipZone.current) {
      tooltipZone.current = newId
      onTooltip(nearZone ? { icon: nearZone.icon, label: nearZone.label } : null)
    }
  })
  return null
}

function TrafficLight({ position, phase }) {
  const refs = [useRef(), useRef(), useRef()]
  const timer = useRef(0)
  const state = useRef(phase)

  useFrame((_, dt) => {
    timer.current += dt
    if (timer.current > [4, 4, 1.5][state.current]) {
      timer.current = 0
      state.current = (state.current + 1) % 3
    }
    refs[0].current && (refs[0].current.material.emissiveIntensity = state.current === 0 ? 3 : 0.05)
    refs[1].current && (refs[1].current.material.emissiveIntensity = state.current === 2 ? 3 : 0.05)
    refs[2].current && (refs[2].current.material.emissiveIntensity = state.current === 1 ? 3 : 0.05)
  })

  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 5, 5]} />
        <meshStandardMaterial color="#424242" metalness={0.8} />
      </mesh>
      <mesh position={[0, 5.3, 0]}>
        <boxGeometry args={[0.4, 1.4, 0.3]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
      {[['#ff2200', 5.8], ['#ffaa00', 5.3], ['#00cc44', 4.8]].map(([col, y], i) => (
        <mesh key={i} ref={refs[i]} position={[0, y, 0.16]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={i === phase ? 3 : 0.05} />
        </mesh>
      ))}
    </group>
  )
}

function LandmarkBuilding({ zone }) {
  const flagRef = useRef()
  useFrame(({ clock }) => {
    if (flagRef.current) flagRef.current.rotation.y = Math.sin(clock.elapsedTime * 2) * 0.15
  })

  return (
    <group position={[zone.pos[0], 0, zone.pos[1]]}>
      {/* Concrete base */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[9, 1.5, 9]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.85} />
      </mesh>
      {/* Steps */}
      <mesh position={[0, 0.2, 5]}>
        <boxGeometry args={[7, 0.4, 1.2]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.9} />
      </mesh>
      {/* Tower body — glass curtain wall */}
      <mesh position={[0, 11, 0]}>
        <boxGeometry args={[7, 20, 7]} />
        <meshStandardMaterial color="#b3d9f7" metalness={0.3} roughness={0.08} transparent opacity={0.88} />
      </mesh>
      {/* Colored glass face */}
      <mesh position={[0, 11, 3.52]}>
        <planeGeometry args={[6.8, 19.5]} />
        <meshStandardMaterial color={zone.color} transparent opacity={0.25} metalness={0.2} roughness={0.05} />
      </mesh>
      {/* Mid setback */}
      <mesh position={[0, 24, 0]}>
        <boxGeometry args={[5, 6, 5]} />
        <meshStandardMaterial color="#90caf9" metalness={0.35} roughness={0.08} transparent opacity={0.9} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 29, 0]}>
        <boxGeometry args={[3, 4, 3]} />
        <meshStandardMaterial color={zone.color} metalness={0.4} roughness={0.2} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 33, 0]}>
        <cylinderGeometry args={[0.04, 0.1, 4, 6]} />
        <meshStandardMaterial color="#616161" metalness={0.9} />
      </mesh>
      {/* Flag pole */}
      <mesh position={[3.5, 24, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 5, 5]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.9} />
      </mesh>
      <mesh ref={flagRef} position={[4.8, 26, 0]}>
        <planeGeometry args={[2.2, 1.1]} />
        <meshStandardMaterial color={zone.color} side={THREE.DoubleSide} />
      </mesh>
      {/* Window bands */}
      {[4, 8, 12, 16, 20].map(y => (
        <mesh key={y} position={[0, y, 3.53]}>
          <planeGeometry args={[6.6, 0.5]} />
          <meshStandardMaterial color="#e3f2fd" transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[7, 32]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[6.5, 7.5, 32]} />
        <meshStandardMaterial color={zone.color} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function Buildings() {
  return (
    <>
      {BUILDINGS.map((b, i) => (
        <group key={i} position={[b.pos[0], b.h / 2, b.pos[1]]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.c} roughness={0.65} metalness={0.1} />
          </mesh>
          {/* Glass front face */}
          <mesh position={[0, 0, b.d / 2 + 0.02]}>
            <planeGeometry args={[b.w * 0.88, b.h * 0.9]} />
            <meshStandardMaterial color={b.g} metalness={0.2} roughness={0.08} transparent opacity={0.65} />
          </mesh>
          {/* Rooftop ledge */}
          <mesh position={[0, b.h / 2 + 0.12, 0]}>
            <boxGeometry args={[b.w + 0.25, 0.24, b.d + 0.25]} />
            <meshStandardMaterial color="#757575" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Roads() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[8, 100]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 0]}>
        <planeGeometry args={[8, 100]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.95} />
      </mesh>
      {[-3.9, 3.9].map(x => (
        <mesh key={`v${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.12, 100]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-3.9, 3.9].map(z => (
        <mesh key={`h${z}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.02, z]}>
          <planeGeometry args={[0.12, 100]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-36,-24,-12,12,24,36].map(z => (
        <mesh key={`yd${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}>
          <planeGeometry args={[0.12, 6]} />
          <meshStandardMaterial color="#f9a825" />
        </mesh>
      ))}
      {[-36,-24,-12,12,24,36].map(x => (
        <mesh key={`xd${x}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x, 0.03, 0]}>
          <planeGeometry args={[0.12, 6]} />
          <meshStandardMaterial color="#f9a825" />
        </mesh>
      ))}
      {/* Crosswalk */}
      {[-2,-1.2,-0.4,0.4,1.2,2].map(x => (
        <mesh key={`cw${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.025, 9]}>
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function StreetLights() {
  const lights = useMemo(() => {
    const pts = []
    const pos = [-32, -20, -8, 8, 20, 32]
    pos.forEach(z => { pts.push([-10, z, 1, 0]); pts.push([10, z, -1, 0]) })
    pos.filter(x => Math.abs(x) > 5).forEach(x => { pts.push([x, -10, 0, 1]); pts.push([x, 10, 0, -1]) })
    return pts
  }, [])

  return (
    <>
      {lights.map(([x, z, ax, az], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 6, 5]} />
            <meshStandardMaterial color="#424242" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Arm */}
          <mesh position={[ax * 1.1, 6.8, az * 1.1]}>
            <boxGeometry args={[ax !== 0 ? 2.2 : 0.1, 0.1, az !== 0 ? 2.2 : 0.1]} />
            <meshStandardMaterial color="#424242" metalness={0.8} />
          </mesh>
          {/* Lamp */}
          <mesh position={[ax * 2.2, 6.6, az * 2.2]}>
            <boxGeometry args={[0.5, 0.25, 0.35]} />
            <meshStandardMaterial color="#212121" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Trees() {
  const positions = useMemo(() => {
    const pts = []
    const pos = [-30, -20, -10, 0, 10, 20, 30]
    pos.forEach(z => { pts.push([-11.5, z]); pts.push([11.5, z]) })
    pos.filter(x => Math.abs(x) > 5).forEach(x => { pts.push([x, -11.5]); pts.push([x, 11.5]) })
    return pts
  }, [])

  return (
    <>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 3.5, 5]} />
            <meshStandardMaterial color="#5d4037" roughness={0.95} />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <sphereGeometry args={[1.3, 6, 6]} />
            <meshStandardMaterial color="#388e3c" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </>
  )
}

export default function City({ onEnterZone, onTooltip }) {
  return (
    <group>
      {/* Green grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#7cb87c" roughness={0.9} />
      </mesh>
      {/* Concrete sidewalks */}
      {[[-6.5,0,3,100],[6.5,0,3,100],[0,-6.5,100,3],[0,6.5,100,3]].map(([x,z,w,d],i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, z]}>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#bdbdbd" roughness={0.95} />
        </mesh>
      ))}
      <Roads />
      <Buildings />
      <StreetLights />
      <Trees />
      <TrafficLight position={[ 4.5, 0,  4.5]} phase={0} />
      <TrafficLight position={[-4.5, 0,  4.5]} phase={1} />
      <TrafficLight position={[ 4.5, 0, -4.5]} phase={1} />
      <TrafficLight position={[-4.5, 0, -4.5]} phase={0} />
      {ZONES.map(z => <LandmarkBuilding key={z.id} zone={z} />)}
      <ZoneDetector zones={ZONES} onEnterZone={onEnterZone} onTooltip={onTooltip || (() => {})} />
    </group>
  )
}
