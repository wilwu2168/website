import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useCallback } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { GarageScene } from './components/GarageScene'
import { PortfolioPage } from './components/PortfolioPage'
import { NavBar } from './components/NavBar'
import { useGarageStore } from './store'

function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl instanceof WebGLRenderingContext
  } catch {
    return false
  }
}

class WebGLErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function WebGLFallback() {
  const setViewMode = useGarageStore((s) => s.setViewMode)
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
      textAlign: 'center',
    }}>
      <h1 style={{ margin: '0 0 12px', fontSize: '1.5rem', fontWeight: 600 }}>
        WebGL Not Available
      </h1>
      <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: '400px' }}>
        This 3D garage requires WebGL. Please open this site in a regular browser (Chrome, Firefox, Safari, or Edge) with hardware acceleration enabled.
      </p>
      <button
        onClick={() => setViewMode('portfolio')}
        style={{
          padding: '12px 24px',
          borderRadius: '10px',
          border: '1px solid rgba(255,165,0,0.3)',
          background: 'rgba(255,165,0,0.15)',
          color: '#ffa500',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.28)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.15)' }}
      >
        View Portfolio
      </button>
    </div>
  )
}

function App() {
  const cameraRef = useRef()
  const controlsRef = useRef()
  const insideCar = useGarageStore((s) => s.insideCar)
  const setInsideCar = useGarageStore((s) => s.setInsideCar)
  const setWorkbenchActive = useGarageStore((s) => s.setWorkbenchActive)
  const workbenchActive = useGarageStore((s) => s.workbenchActive)
  const showIntro = useGarageStore((s) => s.showIntro)
  const setIsDriving = useGarageStore((s) => s.setIsDriving)
  const viewMode = useGarageStore((s) => s.viewMode)
  const setViewMode = useGarageStore((s) => s.setViewMode)
  const insideCarForEffect = useGarageStore((s) => s.insideCar)
  const enteringCar = useGarageStore((s) => s.enteringCar)

  useEffect(() => {
    if (window.location.hash === '#portfolio') {
      setViewMode('portfolio')
    } else {
      useGarageStore.setState({ viewMode: 'intro', introVisible: true })
    }
  }, [setViewMode])

  const exitCar = useCallback(() => {
    setInsideCar(false)
    setIsDriving(false)
    useGarageStore.setState({ currentGear: 0 })
    const cam = cameraRef.current
    const ctrl = controlsRef.current
    if (!cam) return

    if (ctrl) ctrl.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        if (ctrl) ctrl.enabled = true
        showIntro()
      }
    })

    tl.to(cam.position, {
      x: 0, y: 3, z: 8,
      duration: 2,
      ease: "power2.inOut"
    }, 0)
    if (ctrl) {
      tl.to(ctrl.target, {
        x: 0, y: 3, z: -8,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => ctrl.update()
      }, 0)
    }
  }, [setInsideCar, setIsDriving, showIntro])

  useEffect(() => {
    useGarageStore.getState()._setExitCar(exitCar)
    return () => useGarageStore.getState()._setExitCar(null)
  }, [exitCar])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (workbenchActive) {
          setWorkbenchActive(false)
          showIntro()
        } else if (insideCar) {
          exitCar()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [insideCar, workbenchActive, exitCar, setWorkbenchActive, showIntro])

  useEffect(() => {
    if (viewMode !== 'intro' && viewMode !== '3d') return
    // Don’t reset camera when user is in the car or in the middle of entering it
    if (insideCarForEffect || enteringCar) return

    const delay = viewMode === '3d' ? 300 : 1000
    const timer = setTimeout(() => {
      const cam = cameraRef.current
      const ctrl = controlsRef.current
      if (!cam || !ctrl) return

      ctrl.enabled = false

      const tl = gsap.timeline({
        onComplete: () => {
          ctrl.enabled = true
        }
      })

      tl.to(cam.position, {
        x: 0,
        y: 3,
        z: 8,
        duration: 2.5,
        ease: "power2.inOut"
      }, 0)

      tl.to(ctrl.target, {
        x: 0,
        y: 3,
        z: -8,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => ctrl.update()
      }, 0)
    }, delay)

    return () => clearTimeout(timer)
  }, [viewMode, insideCarForEffect, enteringCar])

  if (viewMode === 'portfolio') {
    return (
      <>
        <NavBar />
        <PortfolioPage />
      </>
    )
  }

  if (!hasWebGLSupport()) {
    return <WebGLFallback />
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WebGLErrorBoundary
        fallback={<WebGLFallback />}
      >
        <>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            toneMapping: 3,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          performance={{ min: 0.5 }}
        >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 2, 16]}
          fov={75}
        />
        
        <Suspense fallback={null}>
          <GarageScene cameraRef={cameraRef} controlsRef={controlsRef} />
        </Suspense>
        
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={!insideCar}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={insideCar ? Math.PI * 0.9 : Math.PI / 2}
          minPolarAngle={insideCar ? 0.15 : 0}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
        />

        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.9}
            luminanceSmoothing={0.3}
            intensity={0.15}
            mipmapBlur
            levels={3}
          />
        </EffectComposer>
      </Canvas>
      {viewMode === 'intro' && <IntroOverlay />}
      {viewMode === '3d' && <NavBar />}
      {viewMode === '3d' && !insideCar && !workbenchActive && (
        <ActionButtons onWorkbench={() => useGarageStore.getState()._goToWorkbench?.()} onEnterCar={() => useGarageStore.getState()._enterCar?.()} />
      )}
      <GearDisplay />
      <WorkbenchOverlay />
      {insideCar && <CarExitOverlay onExit={exitCar} />}
        </>
      </WebGLErrorBoundary>
    </div>
  )
}

function ActionButtons({ onWorkbench, onEnterCar }) {
  const btn = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '0.82rem',
    fontWeight: 500,
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.5)',
    color: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'background 0.2s, border-color 0.2s, transform 0.12s',
  }
  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      zIndex: 999,
      pointerEvents: 'auto',
    }}>
      <button
        onClick={onWorkbench}
        style={btn}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,165,0,0.15)'
          e.currentTarget.style.borderColor = 'rgba(255,165,0,0.35)'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <span style={{ fontSize: '1rem' }} aria-hidden>🔧</span>
        <span>View workbench</span>
      </button>
      <button
        onClick={onEnterCar}
        style={btn}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,165,0,0.15)'
          e.currentTarget.style.borderColor = 'rgba(255,165,0,0.35)'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <span style={{ fontSize: '1rem' }} aria-hidden>🚗</span>
        <span>Get in car</span>
      </button>
    </div>
  )
}

function IntroOverlay() {
  const introVisible = useGarageStore((s) => s.introVisible)
  const hideIntro = useGarageStore((s) => s.hideIntro)
  const setViewMode = useGarageStore((s) => s.setViewMode)
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

  const btnBase = {
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 500,
    padding: '10px 22px',
    borderRadius: '10px',
    transition: 'background 0.2s, transform 0.15s',
    backdropFilter: 'blur(10px)',
  }

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      pointerEvents: 'auto',
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
      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={hideIntro}
          style={{
            ...btnBase,
            background: 'rgba(255,165,0,0.15)',
            border: '1px solid rgba(255,165,0,0.3)',
            color: '#ffa500',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.28)'; e.currentTarget.style.transform = 'scale(1.03)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.15)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Enter 3D Garage
        </button>
        <button
          onClick={() => setViewMode('portfolio')}
          style={{
            ...btnBase,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.75)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.03)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Skip to Portfolio
        </button>
      </div>
    </div>
  )
}

function GearDisplay() {
  const currentGear = useGarageStore((s) => s.currentGear)
  const gearContent = useGarageStore((s) => s.gearContent)
  const isDriving = useGarageStore((s) => s.isDriving)
  const cycleGear = useGarageStore((s) => s.cycleGear)
  
  if (currentGear === 0) return null
  
  const content = gearContent[currentGear]
  const ordinal = currentGear === 1 ? 'st' : currentGear === 2 ? 'nd' : currentGear === 3 ? 'rd' : 'th'
  
  if (isDriving) {
    const isLastGear = currentGear >= 5
    return (
      <button
        onClick={() => {
          if (isLastGear) {
            useGarageStore.getState()._exitCar?.()
          } else {
            const nextGear = currentGear + 1
            cycleGear()
            useGarageStore.getState()._driveToGear?.(nextGear)
          }
        }}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: isLastGear ? 'rgba(255,165,0,0.2)' : 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 24px',
          borderRadius: '20px',
          zIndex: 1000,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backdropFilter: 'blur(8px)',
          border: isLastGear ? '1px solid rgba(255,165,0,0.4)' : '1px solid rgba(255,165,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = isLastGear ? 'rgba(255,165,0,0.35)' : 'rgba(255,165,0,0.15)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = isLastGear ? 'rgba(255,165,0,0.2)' : 'rgba(0,0,0,0.7)' }}
      >
        {isLastGear ? (
          <span style={{ color: '#ffa500', fontSize: '0.85rem', fontWeight: 600 }}>
            Return to Garage
          </span>
        ) : (
          <>
            <span style={{ color: '#ffa500', fontSize: '1.2rem', fontWeight: 700 }}>
              {currentGear}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
              {content.title}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
              Click to shift
            </span>
          </>
        )}
      </button>
    )
  }

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
        {currentGear}{ordinal} Gear: {content.title}
      </h3>
      <p style={{ margin: 0, lineHeight: '1.4' }}>
        {content.content}
      </p>
    </div>
  )
}

function WorkbenchOverlay() {
  const workbenchActive = useGarageStore((s) => s.workbenchActive)
  const setWorkbenchActive = useGarageStore((s) => s.setWorkbenchActive)
  const showIntro = useGarageStore((s) => s.showIntro)
  const portfolioSections = useGarageStore((s) => s.portfolioSections)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (workbenchActive) {
      const t = setTimeout(() => setVisible(true), 100)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [workbenchActive])

  if (!workbenchActive && !visible) return null

  const pill = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '100px',
    fontSize: '0.72rem',
    fontWeight: 500,
    background: 'rgba(255,165,0,0.12)',
    color: '#ffa500',
    border: '1px solid rgba(255,165,0,0.2)',
  }

  const divider = {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    margin: '0',
  }

  const renderSection = (section) => {
    switch (section.type) {
      case 'about':
        return (
          <div key={section.id}>
            <p style={{ margin: '0 0 12px', color: '#ffa500', fontSize: '1.05rem', fontWeight: 500, fontStyle: 'italic' }}>
              {section.tagline}
            </p>
            <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.82)', fontSize: '0.88rem', lineHeight: '1.7' }}>
              {section.bio}
            </p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '0.84rem', lineHeight: '1.6', fontStyle: 'italic' }}>
              {section.interests}
            </p>
          </div>
        )

      case 'experience':
        return (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {section.items.map((job, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid #ffa500' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 600 }}>{job.role}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem' }}>{job.dates}</span>
                </div>
                <div style={{ color: '#ffa500', fontSize: '0.82rem', fontWeight: 500, marginBottom: '8px' }}>
                  {job.company} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>&middot; {job.location}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.82rem', lineHeight: '1.55' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )

      case 'projects':
        return (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {section.items.map((proj, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 600, marginBottom: '6px' }}>{proj.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                  {proj.tech.map((t) => (
                    <span key={t} style={pill}>{t}</span>
                  ))}
                </div>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: '0.82rem', lineHeight: '1.6' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )

      case 'skills':
        return (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {section.categories.map((cat) => (
              <div key={cat.label}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {cat.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {cat.items.map((s) => (
                    <span key={s} style={pill}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'contact':
        return (
          <div key={section.id} style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              {section.note}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <a href={`mailto:${section.email}`} style={{ color: '#ffa500', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => { e.target.style.opacity = '0.7' }}
                onMouseLeave={(e) => { e.target.style.opacity = '1' }}
              >{section.email}</a>
              <a href={`https://${section.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#ffa500', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => { e.target.style.opacity = '0.7' }}
                onMouseLeave={(e) => { e.target.style.opacity = '1' }}
              >LinkedIn</a>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '10px' }}>
              {section.location}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      onClick={() => { setWorkbenchActive(false); showIntro() }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: visible ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
        transition: 'background 0.4s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '640px',
          width: '92%',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'rgba(16, 16, 18, 0.97)',
          borderRadius: '16px',
          padding: '36px 32px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <h2 style={{ margin: '0 0 2px', color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Wilson Wu
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 400 }}>
              Data Science & Applied Mathematics &middot; UC Berkeley &rsquo;26
            </p>
          </div>
          <button
            onClick={() => { setWorkbenchActive(false); showIntro() }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: 1,
              padding: '6px 10px',
              borderRadius: '6px',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff' }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = 'rgba(255,255,255,0.45)' }}
          >
            &#10005;
          </button>
        </div>

        <div style={divider} />

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {portfolioSections.map((section, i) => (
            <div key={section.id}>
              <div style={{ padding: '20px 0 4px' }}>
                <h3 style={{
                  margin: '0 0 12px',
                  color: '#ffa500',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {section.title}
                </h3>
                {renderSection(section)}
              </div>
              {i < portfolioSections.length - 1 && <div style={divider} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CarExitOverlay({ onExit }) {
  return (
    <button
      onClick={onExit}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 500,
        padding: '8px 16px',
        borderRadius: '8px',
        backdropFilter: 'blur(8px)',
        transition: 'background 0.2s, color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
    >
      <span style={{ fontSize: '0.9rem' }}>&#10005;</span>
      <span>Exit</span>
      <span style={{ opacity: 0.4, fontSize: '0.72rem', marginLeft: '4px' }}>ESC</span>
    </button>
  )
}

export default App
