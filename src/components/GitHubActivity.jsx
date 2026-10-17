import { useEffect, useState } from 'react'

const username = 'ronronpings'

export default function GitHubActivity() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setError(false)
    const timeout = setTimeout(() => controller.abort(), 15000)
    async function load() {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { signal: controller.signal })
        if (!response.ok) throw new Error('Activity unavailable')
        const result = await response.json()
        if (!Array.isArray(result.contributions) || !result.contributions.length || !Number.isFinite(result.total?.lastYear)) throw new Error('Invalid activity')
        if (active) setData(result)
      } catch {
        if (active) setError(true)
      } finally {
        clearTimeout(timeout)
      }
    }
    load()
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [attempt])

  const offset = data ? new Date(`${data.contributions[0].date}T00:00:00Z`).getUTCDay() : 0
  const columns = data ? Math.ceil((data.contributions.length + offset) / 7) : 53

  return (
    <section className="section github-section" id="github">
      <div className="section-heading"><h2><span>04 —</span> github</h2><a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">@{username} ↗</a></div>
      {error ? (
        <p className="github-status" role="status">Activity is unavailable right now. <button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button></p>
      ) : !data ? (
        <p className="github-status" role="status">Loading GitHub activity…</p>
      ) : (
        <>
          <div className="github-chart">
            <svg viewBox={`0 0 ${columns * 12} 84`} role="img" aria-label={`${data.total.lastYear} contributions in the last year. Each column is a week; larger dots indicate more contributions.`}>
              {data.contributions.map((day, index) => (
                <circle key={day.date} cx={Math.floor((index + offset) / 7) * 12 + 6} cy={((index + offset) % 7) * 12 + 6} r={[1, 2, 2.8, 3.6, 4.3][Math.max(0, Math.min(4, day.level))]} className={day.count ? 'contribution-active' : 'contribution-empty'}>
                  <title>{day.date}: {day.count} contributions</title>
                </circle>
              ))}
            </svg>
          </div>
          <p className="github-total">{data.total.lastYear.toLocaleString()} contributions in the last year</p>
        </>
      )}
    </section>
  )
}
