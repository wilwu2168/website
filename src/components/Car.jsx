import { useGLTF, useCursor } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGarageStore } from '../store'

const BLACK = new THREE.Color('#111111')

export function Car({ cameraRef }) {
  const [hovered, setHovered] = useState(false)
  const { cycleGear } = useGarageStore()
  const groupRef = useRef()
  const { scene } = useGLTF('/models/car.glb')

  useCursor(hovered)

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = child.material.clone()

        const mat = child.material
        const isGlass = mat.transparent || mat.opacity < 0.9
        const isChrome = mat.metalness > 0.8 && mat.roughness < 0.15

        if (!isGlass && !isChrome) {
          mat.color.copy(BLACK)
          mat.metalness = 0.6
          mat.roughness = 0.25
        }
        mat.envMapIntensity = 1.5
      }
    })
    return clone
  }, [scene])

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
      ref={groupRef}
      position={[-5, 0.01, -1.5]}
      rotation={[0, Math.PI, 0]}
      onClick={handleCarClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <primitive object={clonedScene} scale={0.6} />

      <group
        position={[0, 1.5, 0]}
        onClick={handleGearShiftClick}
      >
        <mesh visible={false}>
          <boxGeometry args={[2, 1, 4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/models/car.glb')
