import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import GitHubActivity from './components/GitHubActivity.jsx'
import ContactSection from './components/ContactSection.jsx'
import portrait from '../images/pic2.jfif'
import mysmsPreview from '../images/MYSMS-thumb.webp'
import dsiPreview from '../images/DSI-thumb.webp'
import skPreview from '../images/SK-thumb.webp'
import familyTreePreview from '../images/FamTree-thumb.webp'

const projects = [
  {
    name: 'MYSMS',
    subtitle: 'Student Information & Accounting System',
    description: 'A comprehensive school management platform with integrated finance and accounting features. It helps educational institutions manage students, staff, classes, and financial transactions with insightful reporting and analytics.',
    category: 'SCHOOL MANAGEMENT',
    icon: 'MS',
    image: mysmsPreview,
    note: 'Built for Medical Colleges of Northern Philippines and International School of Asia and the Pacific',
    location: 'Peñablanca, Cagayan Valley',
  },
  {
    name: 'Rebuild Dimension Systems CRM',
    subtitle: 'Customer Relationship Management System',
    description: 'A rebuilt CRM platform for managing customer relationships, business records, and day-to-day operations in one centralized system.',
    category: 'CRM PLATFORM',
    icon: 'DSI',
    image: dsiPreview,
    note: 'Built for Dimension Systems',
    location: 'Guam',
  },
  {
    name: 'SK Management System',
    subtitle: 'Sangguniang Kabataan Management System',
    description: 'A web-based system for youth profiling, project and budget monitoring, and meeting documentation. It streamlines SK operations through centralized records and reporting features.',
    category: 'YOUTH GOVERNANCE',
    icon: 'SK',
    image: skPreview,
    note: 'Built for Sangguniang Kabataan',
    location: 'Piat, Cagayan Valley',
  },
  {
    name: 'Hsieh Family Tree',
    subtitle: 'Private Family Tree Website',
    description: 'A private family tree website with secure account access for authorized family members.',
    category: 'FAMILY PLATFORM',
    icon: 'HF',
    image: familyTreePreview,
    note: 'Built for Dimension Systems',
    location: 'Guam',
  },
]

const experience = [
  {
    year: '2026',
    role: 'Full Stack Web Systems Developer',
    company: 'Dimension Systems',
    location: 'Guam',
    dates: 'May 26, 2026 – Present',
    description: 'Develop internal web applications, including a CRM and systems supporting civil engineering workflows. Build and maintain these applications across the frontend and backend.',
  },
  {
    year: '2025',
    role: 'Web Developer',
    company: 'SVEN The Digital 1st Agency',
    location: 'Quezon City, Metro Manila',
    dates: 'Sep 2025 – Apr 2026',
    description: 'Developed and maintained custom websites and CMS for clients. Built backend services using MySQL. Enhanced PLUK applications and implemented features based on Jira tickets.',
  },
  {
    year: '2022',
    role: 'Full Stack Web Developer',
    company: 'MCNP-ISAP College',
    location: 'Alimanao, Cagayan Valley',
    dates: 'Sep 2022 – Aug 2025',
    description: 'Developed and maintained the Student Information and Accounting System. Designed backend logic using Laravel and PHP. Collaborated with stakeholders to deliver user-focused solutions. Deployed on Hostinger VPS.',
  },
  {
    year: '2021',
    role: 'Freelance Developer',
    company: 'Self-employed',
    location: 'Lasam, Cagayan Valley',
    dates: 'Jan 2021 – Aug 2022',
    description: 'Developed web applications using PHP, Laravel, HTML, CSS, JavaScript, and jQuery. Worked directly with non-technical clients using a Waterfall development approach.',
  },
]

export default function App() {
  const themeTransition = useRef(false)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('ronfolio-theme') || 'dark' } catch { return 'dark' }
  })
  function changeTheme(option, event) {
    if (option === theme || themeTransition.current) return
    const update = () => flushSync(() => setTheme(option))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reducedMotion) {
      update()
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = bounds.left + bounds.width / 2
    const y = bounds.top + bounds.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const root = document.documentElement
    root.style.setProperty('--wipe-x', `${x}px`)
    root.style.setProperty('--wipe-y', `${y}px`)
    root.style.setProperty('--wipe-radius', `${Math.ceil(radius)}px`)
    themeTransition.current = true
    const transition = document.startViewTransition(update)
    transition.finished.catch(() => {}).finally(() => { themeTransition.current = false })
  }
  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: light)')
    const applyTheme = () => {
      document.documentElement.dataset.theme = theme === 'system' ? (preference.matches ? 'light' : 'dark') : theme
    }
    applyTheme()
    preference.addEventListener('change', applyTheme)
    try { localStorage.setItem('ronfolio-theme', theme) } catch { /* Storage may be unavailable. */ }
    return () => preference.removeEventListener('change', applyTheme)
  }, [theme])
  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3])
  const featured = cardOrder[0]

  function selectProject(index) {
    setCardOrder((current) => {
      const slot = current.indexOf(index)
      if (slot === 0) return current
      const next = [...current]
      ;[next[0], next[slot]] = [next[slot], next[0]]
      return next
    })
  }
  return (
    <div className="page">
      <header>
        <a className="wordmark" href="#top">Airon</a>
        <p className="sidebar-caption">Personal portfolio</p>
        <nav aria-label="Main navigation">
          <a href="#top">Overview <span>↗</span></a>
          <a href="#work">Projects <span>04</span></a><a href="#experience">Experience <span>↗</span></a><a href="#stack">Stack <span>↗</span></a><a href="#contact">Contact <span>↗</span></a>
        </nav>
        <div className="sidebar-note">
          <div className="theme-switch" role="group" aria-label="Color theme">
            {['system', 'light', 'dark'].map((option) => (
              <button type="button" key={option} aria-label={`${option} theme`} title={`${option} theme`} aria-pressed={theme === option} onClick={(event) => changeTheme(option, event)}>
                {option === 'system' ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M12 17v4m-4 0h8" /></svg> : option === 'light' ? '☼' : '☾'}
              </button>
            ))}
          </div>
          <p>For work, collabs &amp; everything else, reach me at</p>
          <a className="email-link" href="mailto:pingadairon@gmail.com"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>pingadairon@gmail.com</a>
        </div>
      </header>
      <main>
        <section className="intro" id="top">
          <div className="portrait"><img src={portrait} alt="Ron" width="354" height="330" fetchPriority="high" /></div>
          <div className="intro-copy">
          <h1>Airon</h1>
           <p className="intro-text">I’m a full-stack developer building web applications with Laravel, React, and Vue.js from responsive interfaces to reliable backend systems.</p>
           <p className="intro-detail">I turn complex workflows into practical tools, with a focus on scalable architecture, maintainable code, and the people who use them.</p>
           <div className="intro-links">
             <a href="https://github.com/ronronpings" target="_blank" rel="noreferrer">github ↗</a>
             <a href="https://www.linkedin.com/in/airon-pingad-aa77121a2" target="_blank" rel="noreferrer">linkedin ↗</a>
             <a href="https://www.instagram.com/jpingss_/" target="_blank" rel="noreferrer">instagram ↗</a>
           </div>
          </div>
        </section>
        <div className="overview-strip" aria-label="Portfolio overview">
          <div><strong>Projects</strong><span>SELECTED WORK</span></div>
          <div><strong>Learning</strong><span>NOTES & EXPLORATION</span></div>
          <div><strong>Building</strong><span>IDEAS INTO PRACTICE</span></div>
        </div>
        <section className="section" id="work">
          <div className="section-heading"><h2><span>01 —</span> projects</h2><span>Selected work</span></div>
          <div className="project-deck">
            {projects.map((project, index) => {
              const position = ['front', 'left', 'right', 'hidden'][cardOrder.indexOf(index)]
              return (
                <article className={`project-tile tile-${position} tone-${index}`} key={project.name}>
                  <button
                    className="card-select"
                    type="button"
                    aria-label={`Center ${project.name}`}
                    aria-pressed={featured === index}
                    onClick={() => selectProject(index)}
                  />
                  <div className="project-badges"><span>{project.category}</span></div>
                  <div className="project-title">
                    <span className="app-icon" aria-hidden="true">{project.image ? <img src={project.image} alt="" /> : project.icon}</span>
                    <h3>{project.name}</h3>
                  </div>
                  {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                  <p>{project.description}</p>
                  <div className="project-tile-footer">
                    <div><small>{project.note || 'Details coming soon'}</small>{project.location && <small className="project-location">⌖ {project.location}</small>}</div>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="project-picker" aria-label="Choose featured project">
            {projects.map((project, index) => <button key={project.name} type="button" aria-pressed={featured === index} onClick={() => selectProject(index)}>{project.name}</button>)}
          </div>
        </section>
        <section className="section" id="experience">
          <div className="section-heading"><h2><span>02 —</span> experience</h2><span>Click a role for details</span></div>
          <div className="experience-list">
            {experience.map((job) => (
              <details className="experience-entry" key={job.company}>
                <summary><span className="experience-year">{job.year}</span><strong>{job.role}</strong><span className="experience-company">{job.company}</span><span className="experience-toggle" aria-hidden="true">+</span></summary>
                <div className="experience-description">
                  <p className="experience-meta">{job.dates}<br />{job.location}</p>
                  <p>{job.description}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section className="section" id="stack">
          <div className="section-heading"><h2><span>03 —</span> stack</h2><span>Tools I work with</span></div>
          <div className="stack-groups">
            <div className="stack-group"><h3>Languages</h3><div className="tools"><span>JavaScript</span><span>PHP</span><span>SQL</span><span>HTML</span><span>CSS</span><span>TypeScript</span></div></div>
            <div className="stack-group"><h3>Libraries / Frameworks</h3><div className="tools"><span>Laravel</span><span>Vue.js</span><span>Bootstrap</span><span>jQuery</span><span>Express.js</span><span>Tailwind CSS</span><span>React</span><span>Mongoose</span></div></div>
            <div className="stack-group"><h3>Databases</h3><div className="tools"><span>MySQL</span><span>Firebase</span><span>MongoDB</span></div></div>
            <div className="stack-group"><h3>Technologies</h3><div className="tools"><span>Git</span><span>GitHub</span><span>Node.js</span><span>Docker</span><span>Postman</span><span>Stripe API</span><span>Groq (Llama AI)</span><span>Insomnia</span></div></div>
          </div>
        </section>
        <GitHubActivity />
        <ContactSection />
      </main>
      <footer><span>© {new Date().getFullYear()} Airon</span><a href="#top">Back to top ↑</a></footer>
    </div>
  )
}
