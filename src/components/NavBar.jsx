import { useGarageStore } from '../store'
import { openResumeForPrint } from './ResumePrint'

const FONT = 'system-ui, -apple-system, sans-serif'

const btnBase = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.7)',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontFamily: FONT,
  fontWeight: 500,
  padding: '7px 14px',
  borderRadius: '8px',
  backdropFilter: 'blur(10px)',
  transition: 'background 0.2s, color 0.2s',
}

export function NavBar() {
  const viewMode = useGarageStore((s) => s.viewMode)
  const setViewMode = useGarageStore((s) => s.setViewMode)

  const is3D = viewMode === '3d'

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 2000,
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    }}>
      <button
        onClick={() => setViewMode(is3D ? 'portfolio' : '3d')}
        style={btnBase}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
      >
        {is3D ? 'Portfolio' : '3D Garage'}
      </button>
      <button
        onClick={openResumeForPrint}
        style={{
          ...btnBase,
          background: 'rgba(255,165,0,0.1)',
          border: '1px solid rgba(255,165,0,0.2)',
          color: '#ffa500',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.22)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.1)' }}
      >
        Resume PDF
      </button>
    </div>
  )
}
