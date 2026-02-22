import { useGarageStore } from '../store'
import { openResumeForPrint } from './ResumePrint'

const ACCENT = '#ffa500'
const FONT = 'system-ui, -apple-system, sans-serif'

const pill = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '100px',
  fontSize: '0.78rem',
  fontWeight: 500,
  background: 'rgba(255,165,0,0.1)',
  color: ACCENT,
  border: '1px solid rgba(255,165,0,0.2)',
}

const card = {
  padding: '20px 24px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.06)',
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      margin: '0 0 20px',
      color: ACCENT,
      fontSize: '0.8rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    }}>
      {children}
    </h2>
  )
}

function AboutSection({ section }) {
  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <p style={{ margin: '0 0 14px', color: ACCENT, fontSize: '1.1rem', fontWeight: 500, fontStyle: 'italic' }}>
        {section.tagline}
      </p>
      <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem', lineHeight: '1.75' }}>
        {section.bio}
      </p>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.65', fontStyle: 'italic' }}>
        {section.interests}
      </p>
    </div>
  )
}

function ExperienceSection({ section }) {
  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {section.items.map((job, i) => (
          <div key={i} style={{ ...card, borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
              <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{job.role}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{job.dates}</span>
            </div>
            <div style={{ color: ACCENT, fontSize: '0.85rem', fontWeight: 500, marginBottom: '10px' }}>
              {job.company} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>&middot; {job.location}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {job.bullets.map((b, j) => (
                <li key={j} style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.85rem', lineHeight: '1.6' }}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection({ section }) {
  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {section.items.map((proj, i) => (
          <div key={i} style={card}>
            <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>{proj.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {proj.tech.map((t) => (
                <span key={t} style={pill}>{t}</span>
              ))}
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: '0.85rem', lineHeight: '1.65' }}>{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsSection({ section }) {
  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {section.categories.map((cat) => (
          <div key={cat.label}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              {cat.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {cat.items.map((s) => (
                <span key={s} style={pill}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactSection({ section }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <SectionHeading>{section.title}</SectionHeading>
      <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: '1.7' }}>
        {section.note}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
        <a href={`mailto:${section.email}`} style={{ color: ACCENT, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          {section.email}
        </a>
        <a href={`https://${section.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          LinkedIn
        </a>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '12px' }}>
        {section.location}
      </div>
    </div>
  )
}

const sectionRenderers = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  contact: ContactSection,
}

export function PortfolioPage() {
  const portfolioSections = useGarageStore((s) => s.portfolioSections)
  const setViewMode = useGarageStore((s) => s.setViewMode)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflowY: 'auto',
      background: 'linear-gradient(180deg, #0a0a0c 0%, #111114 100%)',
      fontFamily: FONT,
      color: '#fff',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '60px 24px 80px',
      }}>
        {/* Header */}
        <header style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Wilson Wu
          </h1>
          <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
            Data Science & Applied Mathematics &middot; UC Berkeley &rsquo;26
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewMode('3d')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontFamily: FONT,
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >
              View 3D Garage
            </button>
            <button
              onClick={openResumeForPrint}
              style={{
                background: 'rgba(255,165,0,0.12)',
                border: '1px solid rgba(255,165,0,0.25)',
                color: ACCENT,
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontFamily: FONT,
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.22)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.12)' }}
            >
              Download Resume
            </button>
          </div>
        </header>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
          {portfolioSections.map((section) => {
            const Renderer = sectionRenderers[section.type]
            if (!Renderer) return null
            return <Renderer key={section.id} section={section} />
          })}
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.78rem',
        }}>
          Built with React Three Fiber
        </footer>
      </div>
    </div>
  )
}
