import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

function TireRack({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[2.4, 0.12, 0.3]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.75} />
      </mesh>
      <mesh position={[-0.8, 0, 0.35]}>
        <boxGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.75} />
      </mesh>
      <mesh position={[0.8, 0, 0.35]}>
        <boxGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.75} />
      </mesh>

      {/* Tire 1 */}
      <group position={[-0.55, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <torusGeometry args={[0.4, 0.15, 12, 24]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.15, 12]} />
          <meshStandardMaterial color="#555" roughness={0.15} metalness={0.85} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
            <boxGeometry args={[0.04, 0.12, 0.5]} />
            <meshStandardMaterial color="#444" roughness={0.15} metalness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Tire 2 */}
      <group position={[0.55, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <torusGeometry args={[0.4, 0.15, 12, 24]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.15, 12]} />
          <meshStandardMaterial color="#555" roughness={0.15} metalness={0.85} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
            <boxGeometry args={[0.04, 0.12, 0.5]} />
            <meshStandardMaterial color="#444" roughness={0.15} metalness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function EVCharger({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.5, 0.7, 0.2]} radius={0.03} smoothness={2} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.35} metalness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.15, 0.11]}>
        <circleGeometry args={[0.05, 8]} />
        <meshBasicMaterial color="#00cc44" />
      </mesh>
      <mesh position={[0, -0.05, 0.11]}>
        <planeGeometry args={[0.3, 0.08]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.15, -0.25, 0.12]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.4} />
      </mesh>
      <group>
        <mesh position={[0.15, -0.5, 0.15]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[0.15, -0.9, 0.3]} rotation={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[0.15, -1.15, 0.55]} rotation={[1.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[0.15, -1.25, 0.72]}>
          <boxGeometry args={[0.06, 0.12, 0.06]} />
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

function SmallWindow({ position }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 1.2, 0.12]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.2} metalness={0.6} />
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
        <meshStandardMaterial color="#3a3a3a" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.05, 1.0, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  )
}

export function WallAccessories() {
  return (
    <group>
      <TireRack position={[-9.95, 5.5, -2]} />
      <TireRack position={[-9.95, 4, -2]} />
      <EVCharger position={[-9.9, 3.5, 3]} />
      <SmallWindow position={[-9.95, 5, 5]} />
      <SmallWindow position={[-9.95, 5, -5.5]} />
    </group>
  )
}
