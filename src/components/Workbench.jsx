import { useCursor } from '@react-three/drei'
import { useState } from 'react'
import gsap from 'gsap'
import { useGarageStore } from '../store'

export function Workbench({ cameraRef, controlsRef }) {
  const [hovered, setHovered] = useState(false)
  const hideIntro = useGarageStore((s) => s.hideIntro)
  const setWorkbenchActive = useGarageStore((s) => s.setWorkbenchActive)
  
  useCursor(hovered)

  const handleClick = () => {
    hideIntro()
    setWorkbenchActive(true)

    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 6,
        y: 2.5,
        z: 6,
        duration: 1.5,
        ease: "power2.inOut"
      })
    }

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: 6,
        y: 2.5,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current.update()
      })
    }
  }

  return (
    <group 
      position={[6, 0, 4]} 
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Workbench Top */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      
      {/* Workbench Legs */}
      <mesh position={[-1.3, 1, -0.6]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[1.3, 1, -0.6]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[-1.3, 1, 0.6]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[1.3, 1, 0.6]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      
      {/* Tools on workbench */}
      <mesh position={[-0.5, 2.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.05, 0.8]} />
        <meshLambertMaterial color="#c0c0c0" />
      </mesh>
      
      <mesh position={[0.5, 2.1, 0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshLambertMaterial color="#ff6b35" />
      </mesh>
      
      {/* Pegboard on wall behind workbench */}
      <mesh position={[0, 4, -0.8]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
    </group>
  )
}