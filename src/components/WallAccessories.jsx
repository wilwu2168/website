import { memo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

const TIRE_MAT = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.85 })
const RIM_MAT = new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.15, metalness: 0.85 })
const SPOKE_MAT = new THREE.MeshStandardMaterial({ color: '#444', roughness: 0.15, metalness: 0.85 })
const RACK_MAT = new THREE.MeshStandardMaterial({ color: '#333', roughness: 0.3, metalness: 0.75 })
const WINDOW_FRAME_MAT = new THREE.MeshStandardMaterial({ color: '#3a3a3a', roughness: 0.2, metalness: 0.6 })

function Tire({ position }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <torusGeometry args={[0.4, 0.15, 8, 16]} />
        <primitive object={TIRE_MAT} attach="material" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 0.15, 8]} />
        <primitive object={RIM_MAT} attach="material" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <boxGeometry args={[0.04, 0.12, 0.5]} />
          <primitive object={SPOKE_MAT} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

const TireRack = memo(function TireRack({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[2.4, 0.12, 0.3]} />
        <primitive object={RACK_MAT} attach="material" />
      </mesh>
      <mesh position={[-0.8, 0, 0.35]}>
        <boxGeometry args={[0.08, 0.08, 0.5]} />
        <primitive object={RACK_MAT} attach="material" />
      </mesh>
      <mesh position={[0.8, 0, 0.35]}>
        <boxGeometry args={[0.08, 0.08, 0.5]} />
        <primitive object={RACK_MAT} attach="material" />
      </mesh>
      <Tire position={[-0.55, 0, 0.5]} />
      <Tire position={[0.55, 0, 0.5]} />
    </group>
  )
})

const EVCharger = memo(function EVCharger({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.5, 0.7, 0.2]} radius={0.03} smoothness={1} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.35} metalness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.15, 0.11]}>
        <circleGeometry args={[0.05, 6]} />
        <meshBasicMaterial color="#00cc44" />
      </mesh>
      <mesh position={[0, -0.05, 0.11]}>
        <planeGeometry args={[0.3, 0.08]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.15, -0.25, 0.12]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 6]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.15, -0.5, 0.15]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, -0.9, 0.3]} rotation={[0.8, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, -1.15, 0.55]} rotation={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, -1.25, 0.72]}>
        <boxGeometry args={[0.06, 0.12, 0.06]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  )
})

const SmallWindow = memo(function SmallWindow({ position }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 1.2, 0.12]} />
        <primitive object={WINDOW_FRAME_MAT} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.2, 1.0]} />
        <meshStandardMaterial
          color="#88aacc"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.2, 0.05, 0.04]} />
        <primitive object={WINDOW_FRAME_MAT} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.05, 1.0, 0.04]} />
        <primitive object={WINDOW_FRAME_MAT} attach="material" />
      </mesh>
    </group>
  )
})

export const WallAccessories = memo(function WallAccessories() {
  return (
    <group>
      <TireRack position={[-9.95, 5.5, -2]} />
      <TireRack position={[-9.95, 4, -2]} />
      <EVCharger position={[-9.9, 3.5, 3]} />
      <SmallWindow position={[-9.95, 5, 5]} />
      <SmallWindow position={[-9.95, 5, -5.5]} />
    </group>
  )
})
