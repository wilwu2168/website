import { useGarageStore } from '../store'
import { openResumeForPrint } from './ResumePrint'

const ACCENT = '#ffa500'
const FONT = '"DM Sans", system-ui, -apple-system, sans-serif'

const pill = {
  display: 'inline-block',
  padding: '5px 14px',
  borderRadius: '100px',
  fontSize: '0.78rem',
  fontWeight: 500,
  background: 'rgba(255,165,0,0.08)',
  color: ACCENT,
  border: '1px solid rgba(255,165,0,0.18)',
}

const cardBase = {
  padding: '20px 24px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(12px)',
  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      margin: '0 0 20px',
      paddingLeft: '12px',
      borderLeft: `3px solid ${ACCENT}`,
      color: ACCENT,
      fontSize: '0.85rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
    }}>
      {children}
    </h2>
  )
}

function AboutSection({ section }) {
  const paragraphs = (section.bio || '').split(/\n\n+/).filter(Boolean)
  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <p style={{ margin: '0 0 20px', color: ACCENT, fontSize: '1.15rem', fontWeight: 600, lineHeight: '1.6' }}>
        {section.tagline}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem', lineHeight: '1.75' }}>
            {para}
          </p>
        ))}
      </div>
      {section.interests && (
        <p style={{ margin: '20px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.65', fontStyle: 'italic' }}>
          {section.interests}
        </p>
      )}
    </div>
  )
}

const TIMELINE_LINE = '2px solid rgba(255,165,0,0.4)'
const NODE_SIZE = 10

function getStartYear(datesStr) {
  const match = (datesStr || '').match(/\d{4}/)
  return match ? parseInt(match[0], 10) : 9999
}

function ExperienceSection({ section }) {
  const education = section.education || []
  const items = section.items || []
  const timelineEntries = [
    ...education.map((e, i) => ({ type: 'education', data: e, key: `edu-${i}` })),
    ...items.map((job, i) => ({ type: 'experience', data: job, key: `job-${i}` })),
  ].sort((a, b) => getStartYear(a.data.dates) - getStartYear(b.data.dates))

  const cardHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.borderColor = 'rgba(255,165,0,0.4)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
      e.currentTarget.style.boxShadow = 'none'
    },
  }

  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <div style={{ position: 'relative', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Center timeline line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: NODE_SIZE / 2,
          bottom: NODE_SIZE / 2,
          width: 0,
          borderLeft: TIMELINE_LINE,
          transform: 'translateX(-50%)',
          zIndex: 0,
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
          {timelineEntries.map((entry) => (
            <div
              key={entry.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0,
                position: 'relative',
              }}
            >
              {/* Left: education */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: '20px', minHeight: '40px' }}>
                {entry.type === 'education' ? (
                  <div
                    style={{
                      ...cardBase,
                      borderLeft: `3px solid ${ACCENT}`,
                      maxWidth: '100%',
                      width: '100%',
                    }}
                    {...cardHover}
                  >
                    <div style={{ color: ACCENT, fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                      {entry.data.school}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '8px' }}>
                      {entry.data.dates}
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, marginBottom: '6px' }}>
                      {entry.data.degree}
                    </div>
                    {entry.data.details?.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255,255,255,0.72)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                        {entry.data.details.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div />
                )}
              </div>
              {/* Center node */}
              <div style={{
                flexShrink: 0,
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: '50%',
                background: ACCENT,
                marginTop: '8px',
                border: '2px solid rgba(0,0,0,0.3)',
                boxSizing: 'border-box',
              }} />
              {/* Right: experience */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: '20px', minHeight: '40px' }}>
                {entry.type === 'experience' ? (
                  <div
                    style={{
                      ...cardBase,
                      borderLeft: `3px solid ${ACCENT}`,
                      maxWidth: '100%',
                      width: '100%',
                    }}
                    {...cardHover}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{entry.data.role}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{entry.data.dates}</span>
                    </div>
                    <div style={{ color: ACCENT, fontSize: '0.85rem', fontWeight: 500, marginBottom: entry.data.articleUrl ? '10px' : 0 }}>
                      {entry.data.company} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>&middot; {entry.data.location}</span>
                    </div>
                    {entry.data.articleUrl && (
                      <a
                        href={entry.data.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: ACCENT,
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          display: 'inline-block',
                          borderBottom: `1px solid ${ACCENT}`,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                      >
                        {entry.data.articleTitle || 'Featured Article – Award-Winning'}
                      </a>
                    )}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          ))}
        </div>
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
          <div
            key={i}
            style={cardBase}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = 'rgba(255,165,0,0.25)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
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

function FunFactsSection({ section }) {
  const facts = section.facts || []
  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {facts.map((fact, i) => (
          <div key={i} style={{ ...cardBase, padding: '18px 22px' }}>
            <div style={{ color: ACCENT, fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>
              {fact.title}
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: '0.9rem', lineHeight: '1.65' }}>
              {fact.text}
            </p>
            {fact.articleUrl && (fact.articleImage || fact.articleTitle) && (
              <a
                href={fact.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,165,0,0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {fact.articleImage && (
                  <div style={{ height: '160px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                    <img
                      src={fact.articleImage}
                      alt={fact.articleTitle || 'Article'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
                {fact.articleTitle && (
                  <div style={{ padding: '12px 14px', color: ACCENT, fontSize: '0.9rem', fontWeight: 600, lineHeight: '1.4' }}>
                    {fact.articleTitle}
                  </div>
                )}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
)

function ContactSection({ section }) {
  const name = section.name || 'Wilson Wu'
  const role = section.role || ''
  const description = section.description || ''
  const location = section.location || ''
  const email = section.email || ''
  const emailDisplay = section.emailDisplay || section.email || email
  const linkedin = section.linkedin || ''
  const ctaMessage = section.ctaMessage || "I'm always up for a chat! Feel free to reach out."

  return (
    <div>
      <SectionHeading>{section.title}</SectionHeading>
      <div style={{
        ...cardBase,
        padding: '28px 32px',
        textAlign: 'left',
        marginBottom: '24px',
      }}>
        <div style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 700, marginBottom: '4px' }}>
          {name}
        </div>
        <div style={{ color: ACCENT, fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
          {role}
        </div>
        <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.82)', fontSize: '0.9rem', lineHeight: '1.65' }}>
          {description}
        </p>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '20px' }}>
          {location}
        </div>
        <a
          href={`https://${linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0A66C2',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '24px',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#004182'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0A66C2'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <LinkedInIcon />
          View Profile
        </a>
      </div>
      <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: '1.6', textAlign: 'center' }}>
        {ctaMessage}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <a
          href={`mailto:${email}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: ACCENT,
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            padding: '12px 24px',
            borderRadius: '12px',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,165,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
        >
          <EmailIcon />
          {emailDisplay}
        </a>
      </div>
      <p style={{ margin: '20px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', textAlign: 'center' }}>
        Or catch up over a coffee ☕
      </p>
    </div>
  )
}

const sectionRenderers = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  funfacts: FunFactsSection,
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
      background: 'linear-gradient(180deg, #0a0a0c 0%, #0d0d10 40%, #111114 100%)',
      fontFamily: FONT,
      color: '#fff',
      position: 'relative',
    }}>
      {/* Subtle gradient orbs for depth */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,165,0,0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 100% 80%, rgba(255,165,0,0.03) 0%, transparent 50%)',
        zIndex: 0,
      }} />
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '60px 24px 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <header style={{ marginBottom: '56px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Wilson Wu
          </h1>
          <div style={{ width: '48px', height: '3px', background: `linear-gradient(90deg, ${ACCENT}, transparent)`, margin: '0 auto 12px', borderRadius: '2px' }} />
          <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
          {portfolioSections.map((section, idx) => {
            const Renderer = sectionRenderers[section.type]
            if (!Renderer) return null
            return (
              <div
                key={section.id}
                style={{
                  borderBottom: idx < portfolioSections.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  paddingBottom: idx < portfolioSections.length - 1 ? '52px' : 0,
                }}
              >
                <Renderer section={section} />
              </div>
            )
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
