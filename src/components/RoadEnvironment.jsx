import { memo, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Text, Sky, Cloud } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useGarageStore } from '../store'

const ROAD_X = -5
const ROAD_WIDTH = 8
const ROAD_LENGTH = 280
const ROAD_START_Z = -10
const ROAD_END_Z = ROAD_START_Z - ROAD_LENGTH

const STOP_Z = [-40, -90, -140, -240]

const BILLBOARD_X = ROAD_X - 3
const BILLBOARD_Y = 3
const BILLBOARD_ROTATION = [0, Math.PI / 4, 0]

function LaneMarkings() {
  const dashesCount = Math.floor((ROAD_START_Z - ROAD_END_Z) / 4) + 1
  const meshRef = useRef()

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < dashesCount; i++) {
      dummy.position.set(ROAD_X, 0.011, ROAD_START_Z - i * 4)
      dummy.rotation.set(-Math.PI / 2, 0, 0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [dashesCount])

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, dashesCount]}>
        <planeGeometry args={[0.15, 2]} />
        <meshBasicMaterial color="#f0c040" />
      </instancedMesh>
      <mesh position={[ROAD_X - ROAD_WIDTH / 2 + 0.15, 0.011, ROAD_START_Z - ROAD_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, ROAD_LENGTH]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[ROAD_X + ROAD_WIDTH / 2 - 0.15, 0.011, ROAD_START_Z - ROAD_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, ROAD_LENGTH]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Billboard({ position, title, lines, color = '#ffa500' }) {
  const backdropWidth = 7
  const backdropHeight = Math.max(3.5, 1.5 + lines.length * 0.55)

  return (
    <group position={position} rotation={BILLBOARD_ROTATION}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[backdropWidth + 0.4, backdropHeight + 0.4, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[backdropWidth, backdropHeight]} />
        <meshBasicMaterial color="#0d0d0d" />
      </mesh>
      <Text
        position={[0, backdropHeight / 2 - 0.6, 0.02]}
        fontSize={0.45}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={backdropWidth - 0.8}
      >
        {title}
      </Text>
      {lines.map((line, i) => (
        <Text
          key={i}
          position={[0, backdropHeight / 2 - 1.3 - i * 0.55, 0.02]}
          fontSize={0.25}
          color="#e0e0e0"
          anchorX="center"
          anchorY="middle"
          maxWidth={backdropWidth - 1}
        >
          {line}
        </Text>
      ))}
      <mesh position={[-0.15, -backdropHeight / 2 - 1.2, -0.06]}>
        <boxGeometry args={[0.15, 2.4, 0.15]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, -backdropHeight / 2 - 1.2, -0.06]}>
        <boxGeometry args={[0.15, 2.4, 0.15]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

// --- Stop 1: Park (About Me) ---

const ParkStop = memo(function ParkStop() {
  const portfolioSections = useGarageStore((s) => s.portfolioSections)
  const section = portfolioSections[0]
  const z = STOP_Z[0]

  const treePositions = [
    [ROAD_X - 6, 0, z - 5],
    [ROAD_X - 7, 0, z + 3],
    [ROAD_X - 5.5, 0, z + 8],
    [ROAD_X + 6, 0, z - 4],
    [ROAD_X + 7.5, 0, z + 6],
    [ROAD_X + 5, 0, z - 10],
  ]

  const treeData = useMemo(() => {
    return treePositions.map(([x, y, tz], i) => {
      const height = 2 + Math.random() * 1.5
      const canopyRadius = 1 + Math.random() * 0.6
      return { x, y, tz, height, canopyRadius, i }
    })
  }, [])

  return (
    <group>
      <mesh position={[ROAD_X, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.9} />
      </mesh>

      {treeData.map(({ x, y, tz, height, canopyRadius, i }) => {
        return (
          <group key={i} position={[x, y, tz]}>
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[0.12, 0.18, height, 6]} />
              <meshStandardMaterial color="#5c3a1e" roughness={0.8} />
            </mesh>
            <mesh position={[0, height + canopyRadius * 0.6, 0]}>
              <sphereGeometry args={[canopyRadius, 8, 6]} />
              <meshStandardMaterial color={`hsl(${110 + i * 8}, 55%, ${25 + i * 3}%)`} roughness={0.9} />
            </mesh>
          </group>
        )
      })}

      <group position={[ROAD_X + 5.5, 0, z]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#8b6914" roughness={0.6} />
        </mesh>
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.12, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.5, -0.2]}>
          <boxGeometry args={[1.5, 0.4, 0.06]} />
          <meshStandardMaterial color="#8b6914" roughness={0.6} />
        </mesh>
      </group>

      <pointLight position={[ROAD_X, 6, z]} intensity={0.8} color="#ffe8b0" distance={25} decay={1.5} />

      <Billboard
        position={[BILLBOARD_X, BILLBOARD_Y, z - 14]}
        title={section.title}
        lines={[section.tagline, '', section.bioShort ?? section.bio]}
      />
    </group>
  )
})

// --- Stop 2: City (Experience) ---

function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const CityStop = memo(function CityStop() {
  const portfolioSections = useGarageStore((s) => s.portfolioSections)
  const section = portfolioSections[1]
  const z = STOP_Z[1]

  const buildings = [
    { x: ROAD_X - 7, z: z - 3, w: 2.5, h: 8, d: 2.5, color: '#3a3a4a' },
    { x: ROAD_X - 6, z: z + 5, w: 2, h: 12, d: 2, color: '#4a4a5a' },
    { x: ROAD_X - 8, z: z + 1, w: 3, h: 6, d: 2, color: '#2a2a3a' },
    { x: ROAD_X + 7, z: z - 2, w: 2.5, h: 10, d: 2.5, color: '#3a3a4a' },
    { x: ROAD_X + 6, z: z + 4, w: 2, h: 7, d: 3, color: '#4a4a5a' },
    { x: ROAD_X + 8.5, z: z + 1, w: 2, h: 14, d: 2, color: '#2a2a3a' },
  ]

  const lines = section.items.map(
    (job) => `${job.role} @ ${job.company} (${job.dates})`
  )

  const buildingData = useMemo(() => {
    return buildings.map((b, i) => {
      const rows = Math.floor(b.h / 1.5)
      const cols = Math.floor(b.w / 0.8)
      const windows = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          windows.push({
            row, col,
            lit: seededRandom(i * 100 + row * 10 + col) > 0.3
          })
        }
      }
      return { ...b, windows }
    })
  }, [])

  return (
    <group>
      <mesh position={[ROAD_X, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#555560" roughness={0.7} />
      </mesh>

      {buildingData.map((b, i) => (
        <group key={i}>
          <mesh position={[b.x, b.h / 2, b.z]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.2} />
          </mesh>
          {b.windows.map(({ row, col, lit }) => (
            <mesh
              key={`${row}-${col}`}
              position={[
                b.x - b.w / 2 + 0.5 + col * 0.8,
                1 + row * 1.5,
                b.z + b.d / 2 + 0.01
              ]}
            >
              <planeGeometry args={[0.4, 0.6]} />
              <meshBasicMaterial color={lit ? '#ffe080' : '#333340'} />
            </mesh>
          ))}
        </group>
      ))}

      {[-8, 2].map((offset, i) => (
        <group key={i} position={[ROAD_X + 4.5, 0, z + offset]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 4, 6]} />
            <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.3, 3.8, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.8, 0.06, 0.15]} />
            <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
          </mesh>
          <pointLight position={[0.5, 3.7, 0]} intensity={0.5} color="#ffd070" distance={8} decay={2} />
        </group>
      ))}

      <Billboard
        position={[BILLBOARD_X, BILLBOARD_Y, z - 14]}
        title={section.title}
        lines={lines}
      />
    </group>
  )
})

// --- Stop 3: Tech Lab (Projects) ---

const LabStop = memo(function LabStop() {
  const portfolioSections = useGarageStore((s) => s.portfolioSections)
  const section = portfolioSections[2]
  const z = STOP_Z[2]

  const lines = section.items.map(
    (proj) => `${proj.name}: ${proj.description.slice(0, 80)}...`
  )

  return (
    <group>
      <mesh position={[ROAD_X, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.4} />
      </mesh>

      <FloatingShape
        position={[ROAD_X - 6, 3, z - 3]}
        geometry="icosahedron"
        color="#00ccff"
        size={1.2}
      />
      <FloatingShape
        position={[ROAD_X - 7, 5, z + 4]}
        geometry="torus"
        color="#ff00cc"
        size={0.8}
      />
      <FloatingShape
        position={[ROAD_X + 7, 4, z - 2]}
        geometry="octahedron"
        color="#00ff88"
        size={1}
      />
      <FloatingShape
        position={[ROAD_X + 6, 2.5, z + 5]}
        geometry="dodecahedron"
        color="#ffaa00"
        size={0.9}
      />
      <FloatingShape
        position={[ROAD_X - 5, 6, z + 8]}
        geometry="torusKnot"
        color="#8844ff"
        size={0.6}
      />

      {[
        [ROAD_X - 8, 2.5, z],
        [ROAD_X + 8, 2.5, z - 4],
      ].map(([x, y, sz], i) => (
        <group key={i} position={[x, y, sz]}>
          <mesh>
            <boxGeometry args={[2.5, 1.5, 0.1]} />
            <meshStandardMaterial color="#111122" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.2, 1.2]} />
            <meshBasicMaterial color="#0a1628" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.8, 0.04]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
          <mesh position={[0, -0.2, 0.02]}>
            <planeGeometry args={[1.4, 0.04]} />
            <meshBasicMaterial color="#00ccff" />
          </mesh>
        </group>
      ))}

      <pointLight position={[ROAD_X, 5, z]} intensity={0.6} color="#4488ff" distance={25} decay={1.5} />
      <pointLight position={[ROAD_X - 5, 3, z]} intensity={0.3} color="#00ff88" distance={15} decay={2} />

      <Billboard
        position={[BILLBOARD_X, BILLBOARD_Y, z - 14]}
        title={section.title}
        lines={lines}
        color="#00ccff"
      />
    </group>
  )
})

function FloatingShape({ position, geometry, color, size }) {
  const ref = useRef()
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, [])
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed
      ref.current.rotation.y += delta * speed * 0.7
      ref.current.position.y = position[1] + Math.sin(Date.now() * 0.001 + offset) * 0.3
    }
  })

  const geometryNode = useMemo(() => {
    switch (geometry) {
      case 'icosahedron': return <icosahedronGeometry args={[size, 0]} />
      case 'torus': return <torusGeometry args={[size, size * 0.35, 8, 16]} />
      case 'octahedron': return <octahedronGeometry args={[size, 0]} />
      case 'dodecahedron': return <dodecahedronGeometry args={[size, 0]} />
      case 'torusKnot': return <torusKnotGeometry args={[size, size * 0.3, 48, 8]} />
      default: return <sphereGeometry args={[size, 8, 6]} />
    }
  }, [geometry, size])

  return (
    <mesh ref={ref} position={position}>
      {geometryNode}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// --- Stop 4: Scenic Overlook (Contact) ---

const OverlookStop = memo(function OverlookStop() {
  const portfolioSections = useGarageStore((s) => s.portfolioSections)
  const section = portfolioSections.find((s) => s.type === 'contact') || portfolioSections[3]
  const z = STOP_Z[3]

  const mountainPoints = useMemo(() => {
    const peaks = [
      [-15, 0], [-12, 6], [-8, 2], [-5, 9], [-2, 3], [2, 11], [5, 4], [8, 7], [12, 2], [15, 0]
    ]
    const shape = new THREE.Shape()
    shape.moveTo(peaks[0][0], peaks[0][1])
    for (let i = 1; i < peaks.length; i++) {
      shape.lineTo(peaks[i][0], peaks[i][1])
    }
    shape.lineTo(15, 0)
    shape.lineTo(-15, 0)
    return shape
  }, [])

  return (
    <group>
      <mesh position={[ROAD_X, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8a7a60" roughness={0.85} />
      </mesh>

      <mesh position={[ROAD_X, 0, z - 20]} rotation={[0, 0, 0]}>
        <shapeGeometry args={[mountainPoints]} />
        <meshStandardMaterial color="#4a5a6a" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[ROAD_X, 0, z - 22]}>
        <shapeGeometry args={[mountainPoints]} />
        <meshStandardMaterial color="#3a4a5a" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      <directionalLight position={[ROAD_X + 10, 8, z - 10]} intensity={0.8} color="#ff8844" />

      <mesh position={[ROAD_X, 12, z - 25]}>
        <circleGeometry args={[3, 16]} />
        <meshBasicMaterial color="#ff6633" />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[ROAD_X - 4 + i, 0.5, z + 8]} >
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial color="#888" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[ROAD_X, 1.05, z + 8]}>
        <boxGeometry args={[8, 0.08, 0.1]} />
        <meshStandardMaterial color="#888" metalness={0.5} roughness={0.3} />
      </mesh>

      <Billboard
        position={[BILLBOARD_X, BILLBOARD_Y, z - 14]}
        title={section.title}
        lines={[
          section.name || '',
          section.role || '',
          '',
          section.ctaMessage || '',
          `Email: ${section.emailDisplay || section.email}`,
          `LinkedIn: ${section.linkedin}`,
          section.location || '',
        ]}
        color="#ff8844"
      />
    </group>
  )
})

// --- Road Scenery between stops ---

function RoadScenery() {
  const poles = useMemo(() => {
    const items = []
    for (let z = ROAD_START_Z - 5; z > ROAD_END_Z + 5; z -= 12) {
      items.push(z)
    }
    return items
  }, [])

  return (
    <group>
      {poles.map((z, i) => (
        <group key={i} position={[ROAD_X + ROAD_WIDTH / 2 + 1, 0, z]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 3.6, 6]} />
            <meshStandardMaterial color="#777" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// --- Background buildings & scenery filling the world ---

const BUILDING_COLORS = ['#4a4a5a', '#3a3a4a', '#5a5a6a', '#2d2d3d', '#555565', '#484858', '#3e3e4e', '#606070']
const ROOF_COLORS = ['#6a4a3a', '#5a3a2a', '#7a5a4a', '#4a3a2a']

const BackgroundScenery = memo(function BackgroundScenery() {
  const items = useMemo(() => {
    const result = []
    let id = 0

    for (let z = ROAD_START_Z; z > ROAD_END_Z; z -= 6) {
      const sides = [
        { sign: -1, baseX: ROAD_X - ROAD_WIDTH / 2 - 6 },
        { sign: 1, baseX: ROAD_X + ROAD_WIDTH / 2 + 6 },
      ]

      for (const side of sides) {
        for (let lane = 0; lane < 3; lane++) {
          const seed = id * 137 + lane * 31
          const r = seededRandom(seed)
          if (r > 0.55) { id++; continue }

          const offsetX = lane * 12 + seededRandom(seed + 1) * 8
          const offsetZ = seededRandom(seed + 2) * 5 - 2.5
          const x = side.baseX + offsetX * side.sign
          const pz = z + offsetZ

          const type = seededRandom(seed + 3)

          if (type < 0.45) {
            const w = 1.5 + seededRandom(seed + 4) * 3
            const h = 3 + seededRandom(seed + 5) * 14
            const d = 1.5 + seededRandom(seed + 6) * 3
            const colorIdx = Math.floor(seededRandom(seed + 7) * BUILDING_COLORS.length)
            const windowRows = Math.floor(h / 1.8)
            const windowCols = Math.floor(w / 0.9)
            result.push({ type: 'building', id: id++, x, z: pz, w, h, d, color: BUILDING_COLORS[colorIdx], windowRows, windowCols, seed })
          } else if (type < 0.7) {
            const w = 2 + seededRandom(seed + 4) * 2
            const h = 2 + seededRandom(seed + 5) * 1.5
            const d = 2 + seededRandom(seed + 6) * 2
            const roofIdx = Math.floor(seededRandom(seed + 8) * ROOF_COLORS.length)
            result.push({ type: 'house', id: id++, x, z: pz, w, h, d, roofColor: ROOF_COLORS[roofIdx], seed })
          } else {
            const height = 2 + seededRandom(seed + 4) * 2.5
            const canopy = 0.8 + seededRandom(seed + 5) * 0.8
            const hue = 100 + seededRandom(seed + 6) * 40
            result.push({ type: 'tree', id: id++, x, z: pz, height, canopy, hue, seed })
          }
        }
      }
    }
    return result
  }, [])

  return (
    <group>
      {items.map((item) => {
        if (item.type === 'building') {
          return (
            <group key={item.id} position={[item.x, 0, item.z]}>
              <mesh position={[0, item.h / 2, 0]}>
                <boxGeometry args={[item.w, item.h, item.d]} />
                <meshStandardMaterial color={item.color} roughness={0.5} metalness={0.15} />
              </mesh>
              {Array.from({ length: item.windowRows }).map((_, row) =>
                Array.from({ length: item.windowCols }).map((_, col) => {
                  const lit = seededRandom(item.seed + row * 17 + col * 7) > 0.35
                  return (
                    <mesh
                      key={`${row}-${col}`}
                      position={[
                        -item.w / 2 + 0.5 + col * 0.9,
                        1.2 + row * 1.8,
                        item.d / 2 + 0.01,
                      ]}
                    >
                      <planeGeometry args={[0.4, 0.6]} />
                      <meshBasicMaterial color={lit ? '#ffe080' : '#222230'} />
                    </mesh>
                  )
                })
              )}
            </group>
          )
        }
        if (item.type === 'house') {
          return (
            <group key={item.id} position={[item.x, 0, item.z]}>
              <mesh position={[0, item.h / 2, 0]}>
                <boxGeometry args={[item.w, item.h, item.d]} />
                <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
              </mesh>
              <mesh position={[0, item.h + 0.6, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[item.w * 0.75, 1.2, 4]} />
                <meshStandardMaterial color={item.roofColor} roughness={0.7} />
              </mesh>
              <mesh position={[0, item.h * 0.35, item.d / 2 + 0.01]}>
                <planeGeometry args={[0.5, 0.7]} />
                <meshBasicMaterial color="#5a4030" />
              </mesh>
              <mesh position={[item.w * 0.25, item.h * 0.6, item.d / 2 + 0.01]}>
                <planeGeometry args={[0.35, 0.35]} />
                <meshBasicMaterial color={seededRandom(item.seed + 99) > 0.5 ? '#ffe080' : '#88bbdd'} />
              </mesh>
            </group>
          )
        }
        if (item.type === 'tree') {
          return (
            <group key={item.id} position={[item.x, 0, item.z]}>
              <mesh position={[0, item.height / 2, 0]}>
                <cylinderGeometry args={[0.1, 0.16, item.height, 6]} />
                <meshStandardMaterial color="#5c3a1e" roughness={0.8} />
              </mesh>
              <mesh position={[0, item.height + item.canopy * 0.5, 0]}>
                <sphereGeometry args={[item.canopy, 7, 5]} />
                <meshStandardMaterial color={`hsl(${item.hue}, 50%, 28%)`} roughness={0.9} />
              </mesh>
            </group>
          )
        }
        return null
      })}
    </group>
  )
})

// --- Ambient lighting for the road ---

function RoadLighting() {
  const { scene } = useThree()

  useEffect(() => {
    const fog = new THREE.Fog('#87CEEB', 60, 200)
    scene.fog = fog
    scene.background = new THREE.Color('#87CEEB')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, -50]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, 15, 30]} intensity={0.3} color="#ffe8c0" />
    </group>
  )
}

// --- Main export ---

export function RoadEnvironment() {
  const isDriving = useGarageStore((s) => s.isDriving)

  if (!isDriving) return null

  return (
    <group>
      <RoadLighting />
      <Sky sunPosition={[100, 40, -100]} turbidity={3} rayleigh={0.5} />
      <Cloud position={[ROAD_X - 15, 25, -60]} speed={0.1} opacity={0.5} width={20} depth={5} segments={12} />
      <Cloud position={[ROAD_X + 20, 30, -120]} speed={0.15} opacity={0.4} width={25} depth={6} segments={10} />
      <Cloud position={[ROAD_X - 10, 28, -180]} speed={0.12} opacity={0.45} width={18} depth={4} segments={10} />
      <Cloud position={[ROAD_X + 15, 26, -220]} speed={0.08} opacity={0.5} width={22} depth={5} segments={12} />

      <mesh position={[ROAD_X, -0.01, ROAD_START_Z - ROAD_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, ROAD_LENGTH + 40]} />
        <meshStandardMaterial color="#5a8a4a" roughness={0.9} />
      </mesh>

      <mesh
        position={[ROAD_X, 0.001, ROAD_START_Z - ROAD_LENGTH / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
        <meshStandardMaterial color="#333338" roughness={0.6} />
      </mesh>

      <LaneMarkings />
      <RoadScenery />
      <BackgroundScenery />

      <ParkStop />
      <CityStop />
      <LabStop />
      <OverlookStop />
    </group>
  )
}
