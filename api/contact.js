const MAX_LENGTHS = {
  name: 100,
  email: 254,
  company: 150,
  project: 150,
  budget: 100,
  timeline: 100,
  details: 2500,
}

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character])
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const token = process.env.MAILTRAP_API_TOKEN
  const senderEmail = process.env.MAILTRAP_FROM_EMAIL
  const recipientEmail = process.env.CONTACT_TO_EMAIL || 'pingadairon@gmail.com'

  if (!token || !senderEmail) {
    return response.status(503).json({ error: 'Email service is not configured.' })
  }

  const source = request.body || {}
  if (source.website) return response.status(200).json({ ok: true })

  const data = Object.fromEntries(
    Object.entries(MAX_LENGTHS).map(([key, maxLength]) => [key, clean(source[key], maxLength)]),
  )

  if (!data.name || !data.email || !data.project || !data.details) {
    return response.status(400).json({ error: 'Please complete all required fields.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return response.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || 'Not specified'}`,
    `Project: ${data.project}`,
    `Budget: ${data.budget || 'Not specified'}`,
    `Timeline: ${data.timeline || 'Not specified'}`,
    '',
    data.details,
  ].join('\n')

  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Company', data.company || 'Not specified'],
    ['Project', data.project],
    ['Budget', data.budget || 'Not specified'],
    ['Timeline', data.timeline || 'Not specified'],
  ].map(([label, value]) => `<tr><td style="padding:6px 16px 6px 0;color:#777">${label}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`).join('')

  try {
    const mailtrapResponse = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: senderEmail, name: 'Ron Portfolio' },
        to: [{ email: recipientEmail }],
        reply_to: { email: data.email, name: data.name },
        subject: `Portfolio inquiry: ${data.project}`,
        text,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#222"><h2>New portfolio inquiry</h2><table>${rows}</table><h3>Project details</h3><p style="white-space:pre-wrap">${escapeHtml(data.details)}</p></div>`,
        category: 'Portfolio inquiry',
      }),
    })

    if (!mailtrapResponse.ok) {
      console.error('Mailtrap request failed', mailtrapResponse.status, await mailtrapResponse.text())
      return response.status(502).json({ error: 'The message could not be sent. Please try again.' })
    }

    return response.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact endpoint failed', error)
    return response.status(500).json({ error: 'The message could not be sent. Please try again.' })
  }
}
