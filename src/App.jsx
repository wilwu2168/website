import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { GarageScene } from './components/GarageScene'
import { useGarageStore } from './store'

function App() {
  const cameraRef = useRef()
  const controlsRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cameraRef.current && controlsRef.current) {
        gsap.to(cameraRef.current.position, {
          x: 0,
          y: 3,
          z: 8,
          duration: 2.5,
          ease: "power2.inOut"
        })
        
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 3,
          z: -8,
          duration: 2.5,
          ease: "power2.inOut",
          onUpdate: () => controlsRef.current.update()
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows gl={{ antialias: true, toneMapping: 3 }}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 2, 16]}
          fov={60}
        />
        
        <Suspense fallback={null}>
          <GarageScene cameraRef={cameraRef} />
        </Suspense>
        
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={20}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.9}
            luminanceSmoothing={0.3}
            intensity={0.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      
      <IntroOverlay />
      <GearDisplay />
    </div>
  )
}

function IntroOverlay() {
  const { introVisible } = useGarageStore()
  const [opacity, setOpacity] = useState(0)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setOpacity(1), 2000)
    return () => clearTimeout(fadeInTimer)
  }, [])

  useEffect(() => {
    if (!introVisible) {
      setOpacity(0)
      const unmountTimer = setTimeout(() => setMounted(false), 800)
      return () => clearTimeout(unmountTimer)
    }
  }, [introVisible])

  if (!mounted) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      pointerEvents: 'none',
      zIndex: 1000,
      opacity,
      transition: 'opacity 0.8s ease',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}>
        Wilson Wu
      </h1>
      <p style={{
        margin: '8px 0 0',
        fontSize: '1.1rem',
        fontWeight: 300,
        letterSpacing: '0.15em',
        opacity: 0.8,
        textTransform: 'uppercase',
      }}>
        Software Engineer
      </p>
    </div>
  )
}

function GearDisplay() {
  const { currentGear, gearContent } = useGarageStore()
  
  if (currentGear === 0) return null
  
  const content = gearContent[currentGear]
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '300px',
      zIndex: 1000,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#ffa500' }}>
        {currentGear}{currentGear === 1 ? 'st' : currentGear === 2 ? 'nd' : currentGear === 3 ? 'rd' : 'th'} Gear: {content.title}
      </h3>
      <p style={{ margin: 0, lineHeight: '1.4' }}>
        {content.content}
      </p>
    </div>
  )
}

export default App
