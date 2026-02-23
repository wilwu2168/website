import { useGLTF, useCursor } from '@react-three/drei'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useGarageStore } from '../store'

const BLACK = new THREE.Color('#111111')

const STOP_Z = [null, -40, -90, -140, -190, -240]

const CAM_OFFSET = { x: -0.5, y: 2.84, z: 0.2 }
const TARGET_OFFSET = { x: -0.2, y: 2.19, z: -2.0 }

export function Car({ cameraRef, controlsRef }) {
  const [hovered, setHovered] = useState(false)
  const cycleGear = useGarageStore((s) => s.cycleGear)
  const hideIntro = useGarageStore((s) => s.hideIntro)
  const setWorkbenchActive = useGarageStore((s) => s.setWorkbenchActive)
  const setInsideCar = useGarageStore((s) => s.setInsideCar)
  const setEnteringCar = useGarageStore((s) => s.setEnteringCar)
  const insideCar = useGarageStore((s) => s.insideCar)
  const isDriving = useGarageStore((s) => s.isDriving)
  const setIsDriving = useGarageStore((s) => s.setIsDriving)
  const groupRef = useRef()
  const drivingTween = useRef(null)
  const isAnimating = useRef(false)
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

  const handleCarClick = useCallback(() => {
    if (insideCar) return
    setEnteringCar(true)
    hideIntro()
    setWorkbenchActive(false)

    const cam = cameraRef.current
    const ctrl = controlsRef?.current
    if (!cam) return

    if (ctrl) ctrl.enabled = false

    const approachCam = { x: -5.5, y: 2.85, z: -1.25 }
    const finalCam = { x: -5.5, y: 2.85, z: -1.3 }
    const approachTarget = { x: -5.2, y: 1.65, z: -3.5 }
    const finalTarget = { x: -5.2, y: 1.65, z: -3.5 }
    const fallbackLookAt = { ...approachTarget }

    const tl = gsap.timeline({
      onComplete: () => {
        setEnteringCar(false)
        setInsideCar(true)
        if (ctrl) {
          ctrl.target.set(finalTarget.x, finalTarget.y, finalTarget.z)
          ctrl.enabled = true
          ctrl.update()
        }
      }
    })

    tl.to(cam.position, {
      ...approachCam,
      duration: 0.9,
      ease: "power2.inOut"
    }, 0)
    if (ctrl) {
      tl.to(ctrl.target, {
        ...approachTarget,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => {
          ctrl.update()
        }
      }, 0)

      tl.to(cam.position, {
        ...finalCam,
        duration: 0.5,
        ease: "power2.inOut"
      })

      tl.to(ctrl.target, {
        ...finalTarget,
        duration: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          ctrl.update()
        }
      }, "<")
    } else {
      tl.to(fallbackLookAt, {
        ...approachTarget,
        duration: 0.9,
        ease: "power2.inOut"
      }, 0)

      tl.to(cam.position, {
        ...finalCam,
        duration: 0.5,
        ease: "power2.inOut"
      })

      tl.to(fallbackLookAt, {
        ...finalTarget,
        duration: 0.5,
        ease: "power2.inOut"
      }, "<")

      tl.eventCallback('onUpdate', () => {
        cam.lookAt(fallbackLookAt.x, fallbackLookAt.y, fallbackLookAt.z)
      })
    }
  }, [insideCar, hideIntro, setWorkbenchActive, setInsideCar, setEnteringCar, cameraRef, controlsRef])

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

  useEffect(() => {
    useGarageStore.getState()._setDriveToGear(animateToStop)
    return () => useGarageStore.getState()._setDriveToGear(null)
  }, [animateToStop])

  useEffect(() => {
    useGarageStore.getState()._setEnterCar(handleCarClick)
    return () => useGarageStore.getState()._setEnterCar(null)
  }, [handleCarClick])

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

  const handleGearShiftClick = (e) => {
    e.stopPropagation()
    if (!insideCar) return
    hideIntro()

    const currentGearVal = useGarageStore.getState().currentGear

    if (isDriving && currentGearVal >= 5) {
      useGarageStore.getState()._exitCar?.()
      return
    }

    const nextGear = currentGearVal >= 5 ? 1 : currentGearVal + 1
    cycleGear()

    if (!isDriving && nextGear === 1) {
      setIsDriving(true)
    }

    if (isDriving || nextGear === 1) {
      animateToStop(nextGear)
    }
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
