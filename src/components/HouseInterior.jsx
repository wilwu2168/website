import { memo } from 'react'

export const HouseInterior = memo(function HouseInterior() {
  return (
    <group position={[0, 0, 12]}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshLambertMaterial color="#D4B896" />
      </mesh>
      
      {/* Back Wall (frame with door opening: x -1 to 1, y 0 to 4) */}
      <group position={[0, 0, 0]}>
        <mesh position={[-4.5, 4, -4]} receiveShadow>
          <planeGeometry args={[7, 8]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
        <mesh position={[4.5, 4, -4]} receiveShadow>
          <planeGeometry args={[7, 8]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 6, -4]} receiveShadow>
          <planeGeometry args={[2, 4]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Left Wall */}
      <mesh position={[-8, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[8, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      {/* Brown Baseboard (wallboard) - Back (frame with door opening x -1 to 1) */}
      <mesh position={[-4.5, 0.5, -3.9]}>
        <boxGeometry args={[7, 1, 0.2]} />
        <meshLambertMaterial color="#C4A484" />
      </mesh>
      <mesh position={[4.5, 0.5, -3.9]}>
        <boxGeometry args={[7, 1, 0.2]} />
        <meshLambertMaterial color="#C4A484" />
      </mesh>
      
      {/* Brown Baseboard (wallboard) - Left */}
      <mesh position={[-7.9, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 1, 0.2]} />
        <meshLambertMaterial color="#C4A484" />
      </mesh>
      
      {/* Brown Baseboard (wallboard) - Right */}
      <mesh position={[7.9, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[8, 1, 0.2]} />
        <meshLambertMaterial color="#C4A484" />
      </mesh>
    </group>
  )
})