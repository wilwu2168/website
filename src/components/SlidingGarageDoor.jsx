import { forwardRef } from 'react'

export const GarageBackDoor = forwardRef((props, ref) => {
  return (
    <group position={[0, 0, 8]}>
      {/* Hinge at left edge of opening (x = -1) */}
      <group position={[-1, 0, 0]}>
        <group ref={ref}>
          {/* Door panel: 2 wide × 4 tall, center 1 unit right of hinge, 2 up */}
          <mesh position={[1, 2, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[2, 4, 0.1]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          {/* Door handle */}
          <mesh position={[1.7, 2, 0.11]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshLambertMaterial color="#ffd700" />
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
        {/* Main door panel */}
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 8, 0.2]} />
          <meshLambertMaterial color="#e8e8e8" />
        </mesh>
        
        {/* Horizontal door sections */}
        <mesh position={[0, 3.5, 0.11]} castShadow>
          <boxGeometry args={[19.5, 0.05, 0.02]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[0, 2.5, 0.11]} castShadow>
          <boxGeometry args={[19.5, 0.05, 0.02]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[0, 1.5, 0.11]} castShadow>
          <boxGeometry args={[19.5, 0.05, 0.02]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[0, 0.5, 0.11]} castShadow>
          <boxGeometry args={[19.5, 0.05, 0.02]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>
        
        {/* Door handle/pull */}
        <mesh position={[0, 0.2, 0.15]} castShadow>
          <boxGeometry args={[2, 0.2, 0.1]} />
          <meshLambertMaterial color="#888888" />
        </mesh>
      </group>
    </group>
  )
})
