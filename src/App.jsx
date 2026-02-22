import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
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
      
      <GearDisplay />
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
