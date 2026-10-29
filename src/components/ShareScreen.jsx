import { useState } from 'react'
import { buildResultsUrl } from '../utils/encode.js'

export default function ShareScreen({ token, onViewResults }) {
  const url = buildResultsUrl(token)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="page page--share">
      <header className="hero hero--compact">
        <p className="eyebrow">You’re done</p>
        <h1 className="brand">Send your results</h1>
        <p className="lede">
          This does not send automatically. Copy the results link and text it
          back to the bee’s knees who sent you this list.
        </p>
      </header>

      <div className="share-card">
        <label className="link-field">
          <span className="name-label">Results link</span>
          <input type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
        </label>
        <button type="button" className="submit-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <button type="button" className="text-btn" onClick={onViewResults}>
          Preview results
        </button>
        <p className="share-hint">
          Tip: paste the results link into Messages and send it back to the
          bee’s knees.
        </p>
      </div>
    </div>
  )
}
