import { useGarageStore } from '../store'

export function openResumeForPrint() {
  const { portfolioSections } = useGarageStore.getState()
  const about = portfolioSections.find((s) => s.type === 'about')
  const experience = portfolioSections.find((s) => s.type === 'experience')
  const projects = portfolioSections.find((s) => s.type === 'projects')
  const contact = portfolioSections.find((s) => s.type === 'contact')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Wilson Wu - Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1a1a1a;
    line-height: 1.5;
    padding: 40px 48px;
    max-width: 800px;
    margin: 0 auto;
  }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 2px; }
  .subtitle { color: #555; font-size: 13px; margin-bottom: 4px; }
  .contact-row { color: #555; font-size: 12px; margin-bottom: 20px; }
  .contact-row a { color: #555; text-decoration: none; }
  h2 {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #333;
    border-bottom: 1.5px solid #ddd;
    padding-bottom: 4px;
    margin: 18px 0 10px;
  }
  .bio { font-size: 13px; color: #333; line-height: 1.6; margin-bottom: 4px; }
  .edu { margin-bottom: 14px; }
  .edu-school { font-size: 14px; font-weight: 600; }
  .edu-degree { font-size: 13px; color: #555; margin-bottom: 2px; }
  .edu-dates { font-size: 12px; color: #777; }
  .job { margin-bottom: 14px; }
  .job-header { display: flex; justify-content: space-between; align-items: baseline; }
  .job-role { font-size: 14px; font-weight: 600; }
  .job-dates { font-size: 12px; color: #777; }
  .job-company { font-size: 13px; color: #555; margin-bottom: 4px; }
  .job-article { font-size: 12px; margin-top: 4px; }
  .job-article a { color: #0066cc; text-decoration: none; }
  ul { padding-left: 18px; margin: 0; }
  li { font-size: 12.5px; color: #333; line-height: 1.55; margin-bottom: 2px; }
  .project { margin-bottom: 12px; }
  .project-name { font-size: 14px; font-weight: 600; }
  .project-tech { font-size: 12px; color: #777; margin-bottom: 3px; }
  .project-desc { font-size: 12.5px; color: #333; line-height: 1.55; }
  @media print {
    body { padding: 24px 32px; }
    h2 { margin-top: 14px; }
    @page { margin: 0.5in; size: letter; }
  }
</style>
</head>
<body>
  <h1>Wilson Wu</h1>
  <div class="subtitle">Data Science & Applied Mathematics &middot; UC Berkeley '26</div>
  <div class="contact-row">
    ${contact ? `${contact.location} &middot; <a href="mailto:${contact.email}">${contact.emailDisplay || contact.email}</a> &middot; <a href="https://${contact.linkedin}">${contact.linkedin}</a>` : ''}
  </div>

  ${about ? `
  <h2>About</h2>
  ${(about.bio || '').split(/\n\n+/).filter(Boolean).map((p) => `<p class="bio">${p}</p>`).join('')}
  ` : ''}

  ${experience?.education?.length ? `
  <h2>Education</h2>
  ${experience.education.map((e) => `
  <div class="edu">
    <div class="edu-school">${e.school}</div>
    <div class="edu-degree">${e.degree}</div>
    <div class="edu-dates">${e.dates}</div>
  </div>
  `).join('')}
  ` : ''}

  ${experience?.items?.length ? `
  <h2>Experience</h2>
  ${experience.items.map((job) => `
  <div class="job">
    <div class="job-header">
      <span class="job-role">${job.role}</span>
      <span class="job-dates">${job.dates}</span>
    </div>
    <div class="job-company">${job.company} &middot; ${job.location}</div>
    ${job.articleUrl ? `<div class="job-article"><a href="${job.articleUrl}">${job.articleTitle || 'Featured Article'}</a></div>` : ''}
  </div>
  `).join('')}
  ` : ''}

  ${projects ? `
  <h2>Projects</h2>
  ${projects.items.map((p) => `
  <div class="project">
    <div class="project-name">${p.name}</div>
    <div class="project-tech">${p.tech.join(' · ')}</div>
    <div class="project-desc">${p.description}</div>
  </div>
  `).join('')}
  ` : ''}
</body>
</html>`

  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
  }
}
