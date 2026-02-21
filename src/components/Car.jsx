import { useCursor } from '@react-three/drei'
import { useState } from 'react'
import gsap from 'gsap'
import { useGarageStore } from '../store'

export function Car({ cameraRef }) {
  const [hovered, setHovered] = useState(false)
  const { cycleGear } = useGarageStore()
  
  useCursor(hovered)

  const handleCarClick = () => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: -3,
        y: 2.5,
        z: 6,
        duration: 1.5,
        ease: "power2.inOut"
      })
    }
  }

  const handleGearShiftClick = (e) => {
    e.stopPropagation()
    cycleGear()
  }

  return (
    <group 
      position={[-5, 0, 4]}
      onClick={handleCarClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Car Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[4, 1.2, 2]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Car Hood */}
      <mesh position={[1.5, 1.2, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 1.8]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Car Roof */}
      <mesh position={[-0.5, 1.8, 0]} castShadow>
        <boxGeometry args={[2, 0.2, 1.6]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1.2, 0.4, 1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2]} rotation={[0, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <mesh position={[1.2, 0.4, -1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2]} rotation={[0, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <mesh position={[-1.2, 0.4, 1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2]} rotation={[0, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <mesh position={[-1.2, 0.4, -1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2]} rotation={[0, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0.5, 1.8, 0]} rotation={[-0.2, 0, 0]} castShadow>
        <planeGeometry args={[1, 0.8]} />
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.3} />
      </mesh>
      
      {/* Gear Shifter (Interactive) */}
      <group 
        position={[-0.2, 1.3, 0.2]}
        onClick={handleGearShiftClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.3]} />
          <meshLambertMaterial color="#666" />
        </mesh>
        
        {/* Gear knob */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshLambertMaterial color="#000" />
        </mesh>
      </group>
      
      {/* Front Grille */}
      <mesh position={[2.1, 1, 0]} castShadow>
        <planeGeometry args={[0.1, 0.6]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[2.05, 1.1, 0.7]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#fff8dc" />
      </mesh>
      <mesh position={[2.05, 1.1, -0.7]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#fff8dc" />
      </mesh>
    </group>
  )
}