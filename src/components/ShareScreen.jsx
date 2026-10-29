import { useState } from 'react'
import { buildResultsUrl } from '../utils/encode.js'

export default function ShareScreen({ token, onViewResults }) {
  const url = buildResultsUrl(token)
  const [copied, setCopied] = useState(false)
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

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

  async function handleShare() {
    try {
      await navigator.share({
        title: 'My Retro Movie Watchlist results',
        text: 'Here are my Retro Movie Watchlist results:',
        url,
      })
    } catch {
      // user cancelled or share failed — fall back to copy
      await handleCopy()
    }
  }

  return (
    <div className="page page--share">
      <header className="hero hero--compact">
        <p className="eyebrow">You’re done</p>
        <h1 className="brand">Send your results</h1>
        <p className="lede">
          This does not send automatically. Text or share the results link below
          back to the person who sent you the list.
        </p>
      </header>

      <div className="share-card">
        <label className="link-field">
          <span className="name-label">Results link</span>
          <input type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
        </label>
        {canNativeShare ? (
          <button type="button" className="submit-btn" onClick={handleShare}>
            Share results link
          </button>
        ) : null}
        <button type="button" className="submit-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy results link'}
        </button>
        <button type="button" className="text-btn" onClick={onViewResults}>
          Preview results
        </button>
        <p className="share-hint">
          Tip: use Share / paste into Messages. Opening the survey link again is
          not the same as sending this results link.
        </p>
      </div>
    </div>
  )
}
