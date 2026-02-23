import { useGLTF, useCursor } from '@react-three/drei'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useGarageStore, GARAGE_OUT_OF_SERVICE } from '../store'

const BLACK = new THREE.Color('#111111')

const STOP_Z = [null, -40, -90, -140, -240]

const CAM_OFFSET = { x: -0.5, y: 2.84, z: 0.2 }
const TARGET_OFFSET = { x: -0.2, y: 2.19, z: -2.0 }

export function Car({ cameraRef, controlsRef }) {
  const [hovered, setHovered] = useState(false)
  const isDriving = useGarageStore((s) => s.isDriving)
  const insideCar = useGarageStore((s) => s.insideCar)
  const hideIntro = useGarageStore((s) => s.hideIntro)
  const setInsideCar = useGarageStore((s) => s.setInsideCar)
  const setIsDriving = useGarageStore((s) => s.setIsDriving)
  const groupRef = useRef()

  useCursor(hovered && !insideCar && !GARAGE_OUT_OF_SERVICE)
  const drivingTween = useRef(null)
  const isAnimating = useRef(false)
  const { scene } = useGLTF('/models/car.glb')

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

  useFrame(() => {
    if (!isAnimating.current || !groupRef.current) return
    const cam = cameraRef.current
    const ctrl = controlsRef?.current
    if (!cam) return

    const carPos = groupRef.current.position
    cam.position.set(
      carPos.x + CAM_OFFSET.x,
      carPos.y + CAM_OFFSET.y,
      carPos.z + CAM_OFFSET.z
    )
    if (ctrl) {
      ctrl.target.set(
        carPos.x + TARGET_OFFSET.x,
        carPos.y + TARGET_OFFSET.y,
        carPos.z + TARGET_OFFSET.z
      )
      ctrl.update()
    }
  })

  const animateToStop = useCallback((gear) => {
    const stopZ = STOP_Z[gear]
    if (stopZ == null || !groupRef.current) return

    const cam = cameraRef.current
    const ctrl = controlsRef?.current
    if (ctrl) ctrl.enabled = false
    if (drivingTween.current) drivingTween.current.kill()

    isAnimating.current = true
    const baseDuration = gear === 1 ? 2.5 : Math.max(1, 2.5 - gear * 0.25)

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false
        if (groupRef.current && cam && ctrl) {
          const carPos = groupRef.current.position
          cam.position.set(
            carPos.x + CAM_OFFSET.x,
            carPos.y + CAM_OFFSET.y,
            carPos.z + CAM_OFFSET.z
          )
          ctrl.target.set(
            carPos.x + TARGET_OFFSET.x,
            carPos.y + TARGET_OFFSET.y,
            carPos.z + TARGET_OFFSET.z
          )
          ctrl.enabled = true
          ctrl.update()
        }
      }
    })
    drivingTween.current = tl

    tl.to(groupRef.current.position, {
      z: stopZ,
      duration: baseDuration,
      ease: 'power2.inOut',
    }, 0)
  }, [cameraRef, controlsRef])

  const startDriving = useCallback(() => {
    if (!groupRef.current) return
    const cam = cameraRef.current
    const ctrl = controlsRef?.current
    if (ctrl) ctrl.enabled = false

    // Snap camera to car position immediately
    const carPos = groupRef.current.position
    if (cam) {
      cam.position.set(
        carPos.x + CAM_OFFSET.x,
        carPos.y + CAM_OFFSET.y,
        carPos.z + CAM_OFFSET.z
      )
    }
    if (ctrl) {
      ctrl.target.set(
        carPos.x + TARGET_OFFSET.x,
        carPos.y + TARGET_OFFSET.y,
        carPos.z + TARGET_OFFSET.z
      )
      ctrl.update()
    }

    // Drive to first gear stop
    animateToStop(1)
  }, [cameraRef, controlsRef, animateToStop])

  useEffect(() => {
    useGarageStore.getState()._setDriveToGear(animateToStop)
    return () => useGarageStore.getState()._setDriveToGear(null)
  }, [animateToStop])

  useEffect(() => {
    useGarageStore.getState()._setStartDriving(startDriving)
    return () => useGarageStore.getState()._setStartDriving(null)
  }, [startDriving])

  useEffect(() => {
    if (!isDriving) {
      if (drivingTween.current) {
        drivingTween.current.kill()
        drivingTween.current = null
      }
      isAnimating.current = false
      if (groupRef.current) {
        groupRef.current.position.z = -1.5
      }
    }
  }, [isDriving])

  const handleCarClick = useCallback(() => {
    if (GARAGE_OUT_OF_SERVICE) return
    if (insideCar) return
    hideIntro()
    setInsideCar(true)
    setIsDriving(true)
    useGarageStore.setState({ currentGear: 1 })
    startDriving()
  }, [insideCar, hideIntro, setInsideCar, setIsDriving, startDriving])

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
    </group>
  )
}

useGLTF.preload('/models/car.glb')
