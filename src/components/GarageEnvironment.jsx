import { GroundGrid } from './GroundGrid'
import { Text } from '@react-three/drei'

export function GarageEnvironment() {
  return (
    <group>
      {/* Garage Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial color="#3a3a3a" side={2} />
      </mesh>
      
      {/* Back Wall (frame with door opening: 2 wide × 4 tall, centered; gray) */}
      <group position={[0, 0, -8]}>
        <mesh position={[-5.5, 4, 0]}>
          <planeGeometry args={[9, 8]} />
          <meshBasicMaterial color="#3a3a3a" side={2} />
        </mesh>
        <mesh position={[5.5, 4, 0]}>
          <planeGeometry args={[9, 8]} />
          <meshBasicMaterial color="#3a3a3a" side={2} />
        </mesh>
        <mesh position={[0, 6, 0]}>
          <planeGeometry args={[2, 4]} />
          <meshBasicMaterial color="#3a3a3a" side={2} />
        </mesh>
      </group>
      
      
      {/* Left Wall */}
      <mesh position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshBasicMaterial color="#3a3a3a" side={2} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshBasicMaterial color="#3a3a3a" side={2} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial color="#2a2a2a" side={2} />
      </mesh>
      
      {/* Ground Grid */}
      <GroundGrid />
      
      {/* Floating Text Display */}
      <Text
        position={[0, 5, -4]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        Wilson Wu{'\n'}Software Engineer
      </Text>
      
      {/* Ceiling Light Fixture */}
      <group position={[0, 7.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 12, 8]} />
          <meshBasicMaterial color="#fff8dc" />
        </mesh>
        
        {/* Light cord */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshLambertMaterial color="#333" />
        </mesh>
      </group>
    </group>
  )
}