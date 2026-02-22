import { useMemo } from 'react'
import * as THREE from 'three'
import { MeshReflectorMaterial, RoundedBox } from '@react-three/drei'

function SlatwallPanel({ position, width, height }) {
  const panelCount = Math.floor(height / 0.25)
  const panels = useMemo(() => {
    const items = []
    for (let i = 0; i < panelCount; i++) {
      items.push(i * 0.25 + 0.125)
    }
    return items
  }, [panelCount])

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {panels.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} receiveShadow>
          <boxGeometry args={[width, 0.22, 0.08]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function GlassBackWall() {
  const frameColor = '#2a2a2a'
  const frameThickness = 0.12
  const wallWidth = 20
  const wallHeight = 8
  const cols = 4
  const rows = 2
  const paneW = wallWidth / cols
  const paneH = wallHeight / rows

  const verticalFrames = useMemo(() => {
    const frames = []
    for (let i = 0; i <= cols; i++) {
      frames.push(-wallWidth / 2 + i * paneW)
    }
    return frames
  }, [])

  const horizontalFrames = useMemo(() => {
    const frames = []
    for (let i = 0; i <= rows; i++) {
      frames.push(i * paneH)
    }
    return frames
  }, [])

  return (
    <group position={[0, 0, -8]}>
      {/* Glass panes -- simple transparent, no transmission */}
      {Array.from({ length: cols }).map((_, col) =>
        Array.from({ length: rows }).map((_, row) => (
          <mesh
            key={`pane-${col}-${row}`}
            position={[
              -wallWidth / 2 + paneW / 2 + col * paneW,
              paneH / 2 + row * paneH,
              0
            ]}
          >
            <planeGeometry args={[paneW - frameThickness, paneH - frameThickness]} />
            <meshStandardMaterial
              color="#d4e8d4"
              transparent
              opacity={0.25}
              roughness={0.05}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))
      )}

      {/* Vertical frames */}
      {verticalFrames.map((x, i) => (
        <mesh key={`vf-${i}`} position={[x, wallHeight / 2, 0]}>
          <boxGeometry args={[frameThickness, wallHeight, frameThickness]} />
          <meshStandardMaterial color={frameColor} roughness={0.2} metalness={0.7} />
        </mesh>
      ))}

      {/* Horizontal frames */}
      {horizontalFrames.map((y, i) => (
        <mesh key={`hf-${i}`} position={[0, y, 0]}>
          <boxGeometry args={[wallWidth, frameThickness, frameThickness]} />
          <meshStandardMaterial color={frameColor} roughness={0.2} metalness={0.7} />
        </mesh>
      ))}

      {/* Garden backdrop */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0, -2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 8]} />
          <meshStandardMaterial color="#a8a898" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3, -4]}>
          <boxGeometry args={[24, 6, 2]} />
          <meshStandardMaterial color="#2d6b2d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 6, -5]}>
          <planeGeometry args={[30, 8]} />
          <meshBasicMaterial color="#c8dcc8" />
        </mesh>
        <mesh position={[-4, 6, -3]}>
          <sphereGeometry args={[2.5, 16, 12]} />
          <meshStandardMaterial color="#1e5a1e" roughness={0.95} />
        </mesh>
        <mesh position={[4, 6.5, -3.5]}>
          <sphereGeometry args={[3, 16, 12]} />
          <meshStandardMaterial color="#236b23" roughness={0.95} />
        </mesh>
        <mesh position={[0, 7, -3]}>
          <sphereGeometry args={[2, 16, 12]} />
          <meshStandardMaterial color="#1a5e1a" roughness={0.95} />
        </mesh>
        <mesh position={[-8, 5.5, -3.5]}>
          <sphereGeometry args={[2, 16, 12]} />
          <meshStandardMaterial color="#1d6b1d" roughness={0.95} />
        </mesh>
        <mesh position={[8, 5.8, -3]}>
          <sphereGeometry args={[2.2, 16, 12]} />
          <meshStandardMaterial color="#206020" roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.5, -3]}>
          <boxGeometry args={[2, 3, 1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.7} />
        </mesh>
        <mesh position={[-3, 0.6, -2]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#e8e0d8" roughness={0.7} />
        </mesh>
        <mesh position={[3, 0.6, -2]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#e8e0d8" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

function Cabinetry() {
  const cabinetMat = { color: '#4a4a4a', roughness: 0.4, metalness: 0.25 }

  return (
    <group position={[9.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[3, 5, 0.6]} radius={0.03} smoothness={2} position={[-4, 5.5, 0]} receiveShadow>
        <meshStandardMaterial {...cabinetMat} />
      </RoundedBox>
      <RoundedBox args={[3, 5, 0.6]} radius={0.03} smoothness={2} position={[4, 5.5, 0]} receiveShadow>
        <meshStandardMaterial {...cabinetMat} />
      </RoundedBox>

      <RoundedBox args={[4.5, 2.5, 0.55]} radius={0.03} smoothness={2} position={[0, 6, 0]} receiveShadow>
        <meshStandardMaterial color="#505050" roughness={0.4} metalness={0.25} />
      </RoundedBox>

      <RoundedBox args={[10, 2.4, 0.6]} radius={0.03} smoothness={2} position={[0, 1.2, 0]} receiveShadow>
        <meshStandardMaterial {...cabinetMat} />
      </RoundedBox>

      {/* Wood countertop */}
      <RoundedBox args={[10.2, 0.1, 0.65]} radius={0.02} smoothness={2} position={[0, 2.45, 0.02]} receiveShadow>
        <meshStandardMaterial color="#c8a06e" roughness={0.5} />
      </RoundedBox>

      {/* Cabinet handles - lower */}
      {[-3.5, -1.5, 0.5, 2.5].map((x, i) => (
        <mesh key={`lh-${i}`} position={[x, 1.6, 0.32]}>
          <boxGeometry args={[0.6, 0.04, 0.04]} />
          <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.9} />
        </mesh>
      ))}

      {/* Cabinet handles - upper */}
      {[-1, 1].map((x, i) => (
        <mesh key={`uh-${i}`} position={[x, 6.2, 0.3]}>
          <boxGeometry args={[0.6, 0.04, 0.04]} />
          <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.9} />
        </mesh>
      ))}

      {/* Mini fridge */}
      <RoundedBox args={[1.5, 1.8, 0.5]} radius={0.04} smoothness={2} position={[2.5, 3.5, 0.05]} receiveShadow>
        <meshStandardMaterial color="#383838" roughness={0.25} metalness={0.45} />
      </RoundedBox>
      <mesh position={[2.5, 3.5, 0.32]}>
        <planeGeometry args={[1.3, 1.6]} />
        <meshStandardMaterial color="#1a3a4a" transparent opacity={0.5} roughness={0.05} metalness={0.2} />
      </mesh>

      {/* Sink */}
      <mesh position={[-2, 2.55, 0.1]}>
        <boxGeometry args={[0.8, 0.12, 0.4]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[-2, 2.8, -0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[-2, 2.98, 0.08]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  )
}

function RecessedLights() {
  const lights = useMemo(() => {
    const positions = []
    const cols = 3
    const rows = 3
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push([-6 + c * 6, 7.95, -5 + r * 5])
      }
    }
    return positions
  }, [])

  return (
    <group>
      {lights.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.1, 12]} />
            <meshStandardMaterial color="#d8d8d8" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.25, 12]} />
            <meshBasicMaterial color="#fffef0" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function GarageEnvironment() {
  return (
    <group>
      {/* Reflective Epoxy Floor -- low resolution for performance */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <MeshReflectorMaterial
          blur={[200, 100]}
          resolution={256}
          mixBlur={1}
          mixStrength={30}
          roughness={0.3}
          depthScale={1.2}
          color="#c8c8c0"
          metalness={0.05}
        />
      </mesh>

      <SlatwallPanel position={[-10, 0, 0]} width={16} height={8} />

      <mesh position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      <Cabinetry />
      <GlassBackWall />

      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      <RecessedLights />
    </group>
  )
}
