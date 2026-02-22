import { useMemo, useState, useRef, useEffect, useLayoutEffect, useCallback, memo } from 'react'
import * as THREE from 'three'
import { MeshReflectorMaterial, useCursor } from '@react-three/drei'
import gsap from 'gsap'
import { useGarageStore } from '../store'

const METAL_DARK = new THREE.MeshStandardMaterial({ color: '#333', roughness: 0.3, metalness: 0.7 })
const METAL_LIGHT = new THREE.MeshStandardMaterial({ color: '#aaa', roughness: 0.15, metalness: 0.9 })
const SLAT_MAT = new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.35 })
const FRAME_MAT = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.2, metalness: 0.7 })

const SlatwallPanel = memo(function SlatwallPanel({ position, width, height }) {
  const panelCount = Math.floor(height / 0.25)
  const slatGeo = useMemo(() => new THREE.BoxGeometry(width, 0.22, 0.08), [width])
  const meshRef = useRef()

  useLayoutEffect(() => {
    if (!meshRef.current) return
    const mat4 = new THREE.Matrix4()
    for (let i = 0; i < panelCount; i++) {
      mat4.makeTranslation(0, i * 0.25 + 0.125, 0)
      meshRef.current.setMatrixAt(i, mat4)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [panelCount])

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <instancedMesh ref={meshRef} args={[slatGeo, SLAT_MAT, panelCount]} receiveShadow />
    </group>
  )
})

const GlassBackWall = memo(function GlassBackWall() {
  const frameThickness = 0.12
  const wallWidth = 20
  const wallHeight = 8
  const cols = 4
  const rows = 2
  const paneW = wallWidth / cols
  const paneH = wallHeight / rows

  const panes = useMemo(() => {
    const items = []
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        items.push([
          -wallWidth / 2 + paneW / 2 + col * paneW,
          paneH / 2 + row * paneH,
          0
        ])
      }
    }
    return items
  }, [])

  const verticalFrames = useMemo(() => {
    const frames = []
    for (let i = 0; i <= cols; i++) frames.push(-wallWidth / 2 + i * paneW)
    return frames
  }, [])

  const horizontalFrames = useMemo(() => {
    const frames = []
    for (let i = 0; i <= rows; i++) frames.push(i * paneH)
    return frames
  }, [])

  return (
    <group position={[0, 0, -8]}>
      {panes.map(([x, y], i) => (
        <mesh key={`pane-${i}`} position={[x, y, 0]}>
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
      ))}

      {verticalFrames.map((x, i) => (
        <mesh key={`vf-${i}`} position={[x, wallHeight / 2, 0]}>
          <boxGeometry args={[frameThickness, wallHeight, frameThickness]} />
          <primitive object={FRAME_MAT} attach="material" />
        </mesh>
      ))}

      {horizontalFrames.map((y, i) => (
        <mesh key={`hf-${i}`} position={[0, y, 0]}>
          <boxGeometry args={[wallWidth, frameThickness, frameThickness]} />
          <primitive object={FRAME_MAT} attach="material" />
        </mesh>
      ))}

      <GardenBackdrop />
    </group>
  )
})

const GardenBackdrop = memo(function GardenBackdrop() {
  return (
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
      {[
        [-4, 6, -3, 2.5], [4, 6.5, -3.5, 3], [0, 7, -3, 2],
        [-8, 5.5, -3.5, 2], [8, 5.8, -3, 2.2]
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 8, 6]} />
          <meshStandardMaterial color={`hsl(120, ${50 + i * 5}%, ${18 + i * 2}%)`} roughness={0.95} />
        </mesh>
      ))}
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
  )
})

function ToolWall({ cameraRef, controlsRef }) {
  const [hovered, setHovered] = useState(false)
  const hideIntro = useGarageStore((s) => s.hideIntro)
  const setWorkbenchActive = useGarageStore((s) => s.setWorkbenchActive)

  useCursor(hovered)

  const handleClick = useCallback(() => {
    hideIntro()
    setWorkbenchActive(true)
    const cam = cameraRef.current
    const ctrl = controlsRef.current
    if (!cam) return

    if (ctrl) ctrl.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        if (ctrl) ctrl.enabled = true
      }
    })

    tl.to(cam.position, {
      x: 5, y: 3, z: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0)
    if (ctrl) {
      tl.to(ctrl.target, {
        x: 9.8, y: 3, z: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => ctrl.update()
      }, 0)
    }
  }, [cameraRef, controlsRef, hideIntro, setWorkbenchActive])

  useEffect(() => {
    useGarageStore.getState()._setGoToWorkbench(handleClick)
    return () => useGarageStore.getState()._setGoToWorkbench(null)
  }, [handleClick])

  return (
    <group
      position={[9.8, 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <ToolWallStatic />
    </group>
  )
}

const ToolWallStatic = memo(function ToolWallStatic() {
  const slatGeo = useMemo(() => new THREE.BoxGeometry(10, 0.2, 0.08), [])

  const slats = useMemo(() => {
    const items = []
    for (let i = 0; i < 20; i++) items.push(3.2 + i * 0.24)
    return items
  }, [])

  return (
    <>
      {/* Back panel */}
      <mesh position={[0, 5.5, -0.1]} receiveShadow>
        <boxGeometry args={[10, 5, 0.05]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.4} />
      </mesh>

      {/* Instanced slats */}
      <SlatInstances slats={slats} geo={slatGeo} />

      {/* Border frame */}
      {[[0, 3.05, 10.1, 0.1], [0, 7.95, 10.1, 0.1]].map(([x, y, w, h], i) => (
        <mesh key={`hframe-${i}`} position={[x, y, 0]}>
          <boxGeometry args={[w, h, 0.12]} />
          <primitive object={METAL_DARK} attach="material" />
        </mesh>
      ))}
      {[[-5.02, 5.5], [5.02, 5.5]].map(([x, y], i) => (
        <mesh key={`vframe-${i}`} position={[x, y, 0]}>
          <boxGeometry args={[0.1, 5, 0.12]} />
          <primitive object={METAL_DARK} attach="material" />
        </mesh>
      ))}

      {/* Shelf strip */}
      <mesh position={[0, 3.15, 0.15]} castShadow>
        <boxGeometry args={[10, 0.08, 0.35]} />
        <primitive object={METAL_DARK} attach="material" />
      </mesh>

      {/* Workbench surface */}
      <mesh position={[0, 2.95, 0.65]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.15, 1.2]} />
        <meshStandardMaterial color="#c8a06e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.88, 1.24]}>
        <boxGeometry args={[10, 0.08, 0.06]} />
        <meshStandardMaterial color="#a08050" roughness={0.55} />
      </mesh>

      {/* Support brackets */}
      {[-4, -1.5, 1.5, 4].map((x) => (
        <group key={`bracket-${x}`}>
          <mesh position={[x, 1.85, 0.08]}>
            <boxGeometry args={[0.12, 2.1, 0.08]} />
            <primitive object={METAL_DARK} attach="material" />
          </mesh>
          <mesh position={[x, 2.85, 0.55]}>
            <boxGeometry args={[0.12, 0.08, 1]} />
            <primitive object={METAL_DARK} attach="material" />
          </mesh>
          <mesh position={[x, 2.1, 0.35]} rotation={[0.7, 0, 0]}>
            <boxGeometry args={[0.08, 1.2, 0.06]} />
            <primitive object={METAL_DARK} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Wrenches */}
      {[-4.2, -3.8, -3.4, -3.0, -2.6, -2.2].map((x, i) => (
        <group key={`wrench-${i}`}>
          <mesh position={[x, 7.0 - i * 0.08, 0.05]}>
            <boxGeometry args={[0.06, 0.5 + i * 0.06, 0.03]} />
            <primitive object={METAL_LIGHT} attach="material" />
          </mesh>
          <mesh position={[x, 7.25 - i * 0.05, 0.05]}>
            <boxGeometry args={[0.12, 0.08, 0.03]} />
            <primitive object={METAL_LIGHT} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Pliers */}
      {[-4.5, -4.1].map((x, i) => (
        <group key={`plier-${i}`}>
          <mesh position={[x, 5.2, 0.05]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.06, 0.6, 0.04]} />
            <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[x, 4.85, 0.05]}>
            <boxGeometry args={[0.1, 0.15, 0.04]} />
            <meshStandardMaterial color="#cc3333" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Screwdrivers */}
      {[-1.5, -1.2, -0.9, -0.6, -0.3].map((x, i) => (
        <group key={`sd-${i}`}>
          <mesh position={[x, 5.5, 0.05]}>
            <boxGeometry args={[0.05, 0.45, 0.05]} />
            <meshStandardMaterial color="#555" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[x, 5.1, 0.05]}>
            <cylinderGeometry args={[0.06, 0.05, 0.2, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#cc2222' : '#ddbb00'} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Clamps */}
      {[0.5, 1.1].map((x, i) => (
        <group key={`clamp-${i}`}>
          <mesh position={[x, 6.8, 0.05]}>
            <boxGeometry args={[0.3, 0.08, 0.1]} />
            <primitive object={METAL_DARK} attach="material" />
          </mesh>
          <mesh position={[x, 6.5, 0.05]}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <primitive object={METAL_DARK} attach="material" />
          </mesh>
          <mesh position={[x, 6.2, 0.05]}>
            <boxGeometry args={[0.2, 0.08, 0.1]} />
            <meshStandardMaterial color="#cc4400" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Hammer */}
      <mesh position={[0, 4.2, 0.05]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#2a6b2a" roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 4.58, 0.05]}>
        <boxGeometry args={[0.25, 0.14, 0.1]} />
        <primitive object={METAL_DARK} attach="material" />
      </mesh>

      {/* Saw */}
      <mesh position={[2.5, 7.0, 0.05]}>
        <boxGeometry args={[0.12, 0.35, 0.25]} />
        <meshStandardMaterial color="#ddcc00" roughness={0.4} />
      </mesh>
      <mesh position={[2.5, 6.4, 0.03]}>
        <boxGeometry args={[0.03, 0.9, 0.2]} />
        <meshStandardMaterial color="#50b0b0" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Extension cord */}
      <mesh position={[4, 5.8, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.06, 6, 12]} />
        <meshStandardMaterial color="#ee4400" roughness={0.6} />
      </mesh>
      <mesh position={[4, 5.8, 0.12]} rotation={[Math.PI / 2, 0, 0.3]}>
        <torusGeometry args={[0.28, 0.05, 6, 12]} />
        <meshStandardMaterial color="#ee4400" roughness={0.6} />
      </mesh>

      {/* Right screwdriver set */}
      {[3.2, 3.4, 3.6, 3.8].map((x, i) => (
        <group key={`sd2-${i}`}>
          <mesh position={[x, 7.0, 0.05]}>
            <boxGeometry args={[0.04, 0.35, 0.04]} />
            <meshStandardMaterial color="#666" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[x, 6.75, 0.05]}>
            <cylinderGeometry args={[0.05, 0.04, 0.15, 6]} />
            <meshStandardMaterial color="#ddbb00" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Shelf items */}
      <mesh position={[-4, 3.35, 0.25]}>
        <boxGeometry args={[0.8, 0.35, 0.4]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.4} wireframe />
      </mesh>
      {[-4.2, -3.9].map((x, i) => (
        <mesh key={`spray-${i}`} position={[x, 3.5, 0.25]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 6]} />
          <meshStandardMaterial color={i === 0 ? '#cc2222' : '#2255cc'} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.3, 0.2]}>
        <boxGeometry args={[2, 0.25, 0.35]} />
        <meshStandardMaterial color="#ddd" transparent opacity={0.6} roughness={0.1} />
      </mesh>
      <mesh position={[4, 3.35, 0.25]}>
        <boxGeometry args={[0.8, 0.35, 0.4]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.4} wireframe />
      </mesh>
      {[3.8, 4.1].map((x, i) => (
        <mesh key={`bottle-${i}`} position={[x, 3.5, 0.25]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 6]} />
          <meshStandardMaterial color={i === 0 ? '#ddcc00' : '#885533'} roughness={0.5} />
        </mesh>
      ))}
    </>
  )
})

function SlatInstances({ slats, geo }) {
  const meshRef = useRef()

  useLayoutEffect(() => {
    if (!meshRef.current) return
    const mat4 = new THREE.Matrix4()
    slats.forEach((y, i) => {
      mat4.makeTranslation(0, y, -0.04)
      meshRef.current.setMatrixAt(i, mat4)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [slats])

  return <instancedMesh ref={meshRef} args={[geo, SLAT_MAT, slats.length]} receiveShadow />
}

const RecessedLights = memo(function RecessedLights() {
  const positions = useMemo(() => {
    const items = []
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        items.push([-6 + c * 6, 7.95, -5 + r * 5])
      }
    }
    return items
  }, [])

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.1, 8]} />
            <meshStandardMaterial color="#d8d8d8" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.25, 8]} />
            <meshBasicMaterial color="#fffef0" />
          </mesh>
        </group>
      ))}
    </group>
  )
})

export function GarageEnvironment({ cameraRef, controlsRef }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <MeshReflectorMaterial
          blur={[30, 15]}
          resolution={128}
          mixBlur={1}
          mixStrength={20}
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

      <ToolWall cameraRef={cameraRef} controlsRef={controlsRef} />
      <GlassBackWall />

      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      <RecessedLights />
    </group>
  )
}
