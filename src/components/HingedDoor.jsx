import { forwardRef } from 'react'

export const HingedDoor = forwardRef((props, ref) => {
  return (
    // Anchor group at [-1, 0, 8] (hinge point; door centered at x=0)
    <group position={[-1, 0, 8]}>
      {/* Rotation group (controlled by ref) */}
      <group ref={ref}>
        {/* Door mesh offset at [1, 2, 0] from hinge */}
        <mesh position={[1, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 4, 0.1]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>
        
        {/* Door handle */}
        <mesh position={[1.7, 2, 0.1]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshLambertMaterial color="#ffd700" />
        </mesh>
      </group>
    </group>
  )
})