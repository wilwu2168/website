import { useRef, useEffect } from 'react'
import { Environment, BakeShadows } from '@react-three/drei'
import gsap from 'gsap'
import { HouseInterior } from './HouseInterior'
import { GarageBackDoor } from './SlidingGarageDoor'
import { GarageEnvironment } from './GarageEnvironment'
import { Car } from './Car'
import { WallAccessories } from './WallAccessories'
import { RoadEnvironment } from './RoadEnvironment'
import { useGarageStore } from '../store'

export function GarageScene({ cameraRef, controlsRef }) {
  const regularDoorRef = useRef()
  const isDriving = useGarageStore((s) => s.isDriving)

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
      <Environment preset="city" background={false} />
      <BakeShadows />

      <group visible={!isDriving}>
        <ambientLight intensity={0.4} />

        <directionalLight
          position={[5, 12, 4]}
          intensity={0.7}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-far={20}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.001}
        />

        <spotLight
          position={[0, 7.9, 0]}
          angle={Math.PI / 2.5}
          penumbra={0.8}
          intensity={1.2}
          distance={14}
          decay={1.5}
          color="#fffef0"
        />

        <directionalLight
          position={[0, 6, -10]}
          intensity={0.35}
          color="#e8f0e8"
        />

        <HouseInterior />
        <GarageBackDoor ref={regularDoorRef} />
        <GarageEnvironment cameraRef={cameraRef} controlsRef={controlsRef} />
        <WallAccessories />
      </group>

      <Car cameraRef={cameraRef} controlsRef={controlsRef} />
      <RoadEnvironment />
    </>
  )
}
