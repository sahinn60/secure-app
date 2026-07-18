import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_SPEED = 0.2
const ACCEL = 0.016
const FRICTION = 0.90
const TURN_SPEED = 0.042

const COLLIDERS = [
  [-20,-18,5.5,5.5], [20,-18,5.5,5.5], [0,22,5.5,5.5],
  [-30,-30,4,4], [-22,-28,3,3], [-32,-20,2.5,2.5], [-28,-12,3.5,2.5], [-36,-30,2.5,2.5],
  [30,-30,4,4],  [22,-28,3,3],  [32,-20,2.5,2.5],  [28,-12,3.5,2.5],  [36,-30,2.5,2.5],
  [-30,30,3.5,3.5], [-22,28,2.5,2.5], [-32,20,3,3], [-28,12,2.5,2.5], [-36,22,2,2],
  [30,30,3.5,3.5],  [22,28,2.5,2.5],  [32,20,3,3],  [28,12,3,2.5],    [36,22,2,2],
  [0,-38,4.5,4.5], [-38,0,3,3], [38,0,3,3], [0,38,4,4],
  [-14,-30,2.5,2.5], [14,-30,2.5,2.5],
]
const CHW = 1.0, CHD = 1.9

function blocked(x, z) {
  for (const [cx, cz, hw, hd] of COLLIDERS)
    if (x > cx-hw-CHW && x < cx+hw+CHW && z > cz-hd-CHD && z < cz+hd+CHD) return true
  return false
}

const _cam = new THREE.Vector3()

export default function Car({ onMove }) {
  const carRef = useRef()
  const keys = useRef({})
  const angle = useRef(0)
  const vel = useRef(0)
  const joystick = useRef({ x: 0, y: 0 })
  const { camera } = useThree()
  // Use ref to batch position updates — avoid React re-render every frame
  const posRef = useRef([0, 0, 0])
  const frameCount = useRef(0)

  useEffect(() => {
    const dn = e => { keys.current[e.key] = true }
    const up = e => { keys.current[e.key] = false }
    window.addEventListener('keydown', dn)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up) }
  }, [])

  useEffect(() => {
    window.__setJoystick = (x, y) => { joystick.current = { x, y } }
    return () => { delete window.__setJoystick }
  }, [])

  useFrame(() => {
    if (!carRef.current) return
    const k = keys.current
    const { x: jx, y: jy } = joystick.current

    const left  = k['ArrowLeft']  || k['a'] || k['A'] || jx < -0.2
    const right = k['ArrowRight'] || k['d'] || k['D'] || jx > 0.2
    const fwd   = k['ArrowUp']   || k['w'] || k['W'] || jy < -0.2
    const bwd   = k['ArrowDown'] || k['s'] || k['S'] || jy > 0.2

    const moving = Math.abs(vel.current) > 0.005
    if (left)  angle.current += TURN_SPEED * (moving ? 1 : 0.4)
    if (right) angle.current -= TURN_SPEED * (moving ? 1 : 0.4)

    if (fwd)      vel.current = Math.min(vel.current + ACCEL, MAX_SPEED)
    else if (bwd) vel.current = Math.max(vel.current - ACCEL, -MAX_SPEED * 0.55)
    else          vel.current *= FRICTION

    const cx = carRef.current.position.x
    const cz = carRef.current.position.z
    const dx = -Math.sin(angle.current) * vel.current
    const dz = -Math.cos(angle.current) * vel.current
    const nx = cx + dx, nz = cz + dz

    if (!blocked(nx, nz)) {
      carRef.current.position.x = nx
      carRef.current.position.z = nz
    } else if (!blocked(nx, cz)) {
      carRef.current.position.x = nx
      vel.current *= 0.4
    } else if (!blocked(cx, nz)) {
      carRef.current.position.z = nz
      vel.current *= 0.4
    } else {
      vel.current = 0
    }

    carRef.current.position.x = Math.max(-60, Math.min(60, carRef.current.position.x))
    carRef.current.position.z = Math.max(-60, Math.min(60, carRef.current.position.z))
    carRef.current.rotation.y = angle.current

    // Camera
    _cam.set(
      carRef.current.position.x + Math.sin(angle.current) * 11,
      carRef.current.position.y + 6,
      carRef.current.position.z + Math.cos(angle.current) * 11
    )
    camera.position.lerp(_cam, 0.1)
    camera.lookAt(carRef.current.position.x, carRef.current.position.y + 1, carRef.current.position.z)

    frameCount.current++
    if (frameCount.current % 3 === 0) {
      onMove(
        [carRef.current.position.x, carRef.current.position.y, carRef.current.position.z],
        angle.current
      )
    }
  })

  return (
    <group ref={carRef} name="car" position={[0, 0.45, 0]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[1.8, 0.5, 3.6]} />
        <meshStandardMaterial color="#1a0533" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.5, -0.1]}>
        <boxGeometry args={[1.4, 0.46, 1.9]} />
        <meshStandardMaterial color="#120322" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Windshields */}
      <mesh position={[0, 0.5, 0.86]}>
        <boxGeometry args={[1.32, 0.4, 0.04]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, -1.06]}>
        <boxGeometry args={[1.32, 0.4, 0.04]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} metalness={0.9} />
      </mesh>
      {/* Neon underglow */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[1.82, 0.04, 3.62]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={2} />
      </mesh>
      {/* Bumpers */}
      <mesh position={[0, 0.05, 1.85]}>
        <boxGeometry args={[1.7, 0.2, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, -1.85]}>
        <boxGeometry args={[1.7, 0.2, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
      {/* Wheels */}
      {[[-0.97,-0.18,1.15],[0.97,-0.18,1.15],[-0.97,-0.18,-1.15],[0.97,-0.18,-1.15]].map((p,i) => (
        <group key={i} position={p}>
          <mesh rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.32,0.32,0.22,12]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
          <mesh rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.18,0.18,0.24,8]} />
            <meshStandardMaterial color="#888" metalness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Headlights */}
      {[-0.55,0.55].map((x,i) => (
        <mesh key={i} position={[x,0.1,1.82]}>
          <boxGeometry args={[0.36,0.16,0.04]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
        </mesh>
      ))}
      {/* Tail lights */}
      {[-0.55,0.55].map((x,i) => (
        <mesh key={i} position={[x,0.1,-1.82]}>
          <boxGeometry args={[0.3,0.14,0.04]} />
          <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={2} />
        </mesh>
      ))}
      {/* Underglow light */}
      <pointLight position={[0,-0.3,0]} intensity={1} color="#6366f1" distance={4} />
    </group>
  )
}
