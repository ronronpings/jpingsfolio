import { useState } from 'react'
import worldMap from '../../images/world-map.svg'

export default function ContactSection() {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setSending(true)
    setStatus('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'The message could not be sent.')
      form.reset()
      setStatus('Message sent. Thank you—I’ll get back to you soon.')
    } catch (error) {
      setStatus(`${error.message} You can also email pingadairon@gmail.com directly.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="section-heading"><h2><span>05 —</span> contacts</h2><a href="mailto:pingadairon@gmail.com">EMAIL ME ↗</a></div>
      <div className="contact-map" aria-hidden="true">
        <img src={worldMap} alt="" loading="lazy" />
        <p>Let’s build something together, wherever you are.</p>
      </div>
      <div className="inquiry-card">
        <div className="inquiry-header">
          <span>COLLABORATION INQUIRY</span>
          <h3>Tell me about it.</h3>
          <p>Share what you’re working on and how I can help. A little context goes a long way.</p>
        </div>
        <form className="inquiry-form" onSubmit={submit}>
          <label>Name <span>*</span><input name="name" autoComplete="name" placeholder="Your name" required maxLength={100} /></label>
          <label>Email <span>*</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /></label>
          <label>Company / Organization<input name="company" autoComplete="organization" placeholder="Optional" maxLength={150} /></label>
          <label>Project <span>*</span><input name="project" placeholder="e.g. Website, CRM, internal system" required maxLength={150} /></label>
          <label>Budget range<select name="budget" defaultValue=""><option value="">Select one (optional)</option><option>Under $1,000 USD</option><option>$1,000–$5,000 USD</option><option>$5,000–$10,000 USD</option><option>$10,000+ USD</option><option>Let’s discuss</option></select></label>
          <label>Ideal timeline<input name="timeline" placeholder="e.g. Next quarter, flexible" maxLength={100} /></label>
          <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label className="form-wide">Project details <span>*</span><textarea name="details" placeholder="What are you building? Share your goals, scope, and any useful links." rows={5} required maxLength={2500} /></label>
          <div className="form-wide form-bottom"><p>Your details are sent securely through Mailtrap.</p><button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send inquiry ↗'}</button></div>
          {status && <p className="form-wide form-status" role="status" aria-live="polite">{status}</p>}
        </form>
      </div>
      <a className="contact-email" href="mailto:pingadairon@gmail.com">pingadairon@gmail.com ↗</a>
    </section>
  )
}
