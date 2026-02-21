import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { HouseInterior } from './HouseInterior'
import { GarageBackDoor } from './SlidingGarageDoor' 
import { GarageEnvironment } from './GarageEnvironment'

export function GarageScene({ cameraRef }) {
  const regularDoorRef = useRef()
  const lightRef = useRef()

  useEffect(() => {
    // Animate regular door open after 1 second
    const timer = setTimeout(() => {
      if (regularDoorRef.current) {
        gsap.to(regularDoorRef.current.rotation, {
          y: -Math.PI / 2,
          duration: 2,
          ease: "power2.out"
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Animate the ceiling light
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
      
      {/* Garage ceiling light */}
      <pointLight
        ref={lightRef}
        position={[0, 8, 0]}
        intensity={0.8}
        distance={20}
        decay={2}
        color="#fff8dc"
        castShadow
      />
      
      {/* House Interior (behind camera initially) */}
      <HouseInterior />
      
      {/* Front regular door */}
      <GarageBackDoor ref={regularDoorRef} />
      
      
      {/* Garage Environment */}
      <GarageEnvironment />
    </>
  )
}