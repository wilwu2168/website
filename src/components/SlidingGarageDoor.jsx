import { forwardRef } from 'react'
import { RoundedBox } from '@react-three/drei'

export const GarageBackDoor = forwardRef((props, ref) => {
  return (
    <group position={[0, 0, 8]}>
      <group position={[-1, 0, 0]}>
        <group ref={ref}>
          <RoundedBox args={[2, 4, 0.1]} radius={0.02} smoothness={2} position={[1, 2, 0.05]} castShadow receiveShadow>
            <meshStandardMaterial color="#8b4513" roughness={0.5} metalness={0.05} />
          </RoundedBox>
          <mesh position={[1.7, 2, 0.11]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  )
})

export const SlidingGarageDoor = forwardRef((props, ref) => {
  return (
    <group position={[0, 0, 8]}>
      <group ref={ref}>
        <RoundedBox args={[20, 8, 0.2]} radius={0.03} smoothness={2} position={[0, 4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.1} />
        </RoundedBox>

        {[3.5, 2.5, 1.5, 0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.11]}>
            <boxGeometry args={[19.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.3} />
          </mesh>
        ))}

        <RoundedBox args={[2, 0.2, 0.1]} radius={0.03} smoothness={2} position={[0, 0.2, 0.15]} castShadow>
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.7} />
        </RoundedBox>
      </group>
    </group>
  )
})
