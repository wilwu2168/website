import { useRef, useEffect } from 'react'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import { HouseInterior } from './HouseInterior'
import { GarageBackDoor } from './SlidingGarageDoor'
import { GarageEnvironment } from './GarageEnvironment'
import { Car } from './Car'
import { WallAccessories } from './WallAccessories'

export function GarageScene({ cameraRef }) {
  const regularDoorRef = useRef()

  useEffect(() => {
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

  return (
    <>
      <Environment preset="city" />

      <ambientLight intensity={0.4} />

      <directionalLight
        position={[5, 12, 4]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Ceiling spotlights -- no shadow casting, just light fill */}
      {[[-6, -5], [0, 0], [6, 5]].map(([x, z], i) => (
        <spotLight
          key={i}
          position={[x, 7.9, z]}
          angle={Math.PI / 3}
          penumbra={0.8}
          intensity={0.6}
          distance={12}
          decay={1.5}
          color="#fffef0"
        />
      ))}

      {/* Natural light from back glass wall */}
      <directionalLight
        position={[0, 6, -10]}
        intensity={0.35}
        color="#e8f0e8"
      />

      <HouseInterior />
      <GarageBackDoor ref={regularDoorRef} />
      <GarageEnvironment />
      <Car cameraRef={cameraRef} />
      <WallAccessories />
    </>
  )
}
