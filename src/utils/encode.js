import { MOVIE_IDS } from '../data/movies.js'

const VERSION = 1
const MAX_NAME_BYTES = 40

function toBase64Url(bytes) {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function utf8Encode(text) {
  return new TextEncoder().encode(text)
}

function utf8Decode(bytes) {
  return new TextDecoder().decode(bytes)
}

/**
 * Compact binary payload (short enough for SMS):
 * [version][nameLen][name utf8...][bit0][bit1][bit2]
 * Each answer bit: 1 = seen, 0 = not seen (movie order = MOVIE_IDS).
 */
export function encodeResults({ name, answers }) {
  const nameBytes = utf8Encode(name.trim()).slice(0, MAX_NAME_BYTES)
  const bits = new Uint8Array(3)
  MOVIE_IDS.forEach((id, i) => {
    if (answers[id] === true) {
      bits[Math.floor(i / 8)] |= 1 << (i % 8)
    }
  })
  const out = new Uint8Array(2 + nameBytes.length + bits.length)
  out[0] = VERSION
  out[1] = nameBytes.length
  out.set(nameBytes, 2)
  out.set(bits, 2 + nameBytes.length)
  return toBase64Url(out)
}

function decodeCompact(bytes) {
  if (bytes.length < 5) return null
  const version = bytes[0]
  if (version !== VERSION) return null
  const nameLen = bytes[1]
  if (bytes.length < 2 + nameLen + 3) return null
  const name = utf8Decode(bytes.slice(2, 2 + nameLen))
  const bits = bytes.slice(2 + nameLen, 2 + nameLen + 3)
  const answers = {}
  MOVIE_IDS.forEach((id, i) => {
    answers[id] = ((bits[Math.floor(i / 8)] >> (i % 8)) & 1) === 1
  })
  return { name, answers }
}

/** Legacy JSON payloads from earlier deploys. */
function decodeLegacyJson(token) {
  try {
    const json = utf8Decode(fromBase64Url(token))
    const data = JSON.parse(json)
    if (!data || typeof data.n !== 'string' || !data.a || typeof data.a !== 'object') {
      return null
    }
    const answers = {}
    for (const id of MOVIE_IDS) {
      if (typeof data.a[id] !== 'boolean') return null
      answers[id] = data.a[id]
    }
    return { name: data.n, answers }
  } catch {
    return null
  }
}

export function decodeResults(token) {
  if (!token || typeof token !== 'string') return null
  try {
    const bytes = fromBase64Url(token)
    const compact = decodeCompact(bytes)
    if (compact) return compact
  } catch {
    // fall through to legacy
  }
  return decodeLegacyJson(token)
}

function appBasePath() {
  const { pathname } = window.location
  let basePath = pathname.endsWith('index.html')
    ? pathname.slice(0, -'index.html'.length)
    : pathname
  // Keep directory root for the GitHub Pages project site
  if (!basePath.endsWith('/')) {
    const last = basePath.split('/').pop()
    if (last && !last.includes('.')) basePath += '/'
    else basePath = `${basePath.slice(0, basePath.lastIndexOf('/') + 1)}`
  }
  return basePath
}

/** Results links use ?r= so GitHub Pages / Messages keep the token (hash often gets dropped). */
export function buildResultsUrl(token) {
  return `${window.location.origin}${appBasePath()}?r=${encodeURIComponent(token)}`
}

export function buildShareUrl(token) {
  return `${window.location.origin}${appBasePath()}?share=${encodeURIComponent(token)}`
}

export function goToShare(token) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set('share', token)
  window.history.pushState({}, '', url)
  window.dispatchEvent(new Event('app-route'))
}

export function goToResults(token) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set('r', token)
  window.history.pushState({}, '', url)
  window.dispatchEvent(new Event('app-route'))
}

export function goToSurvey() {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  window.history.pushState({}, '', url)
  window.dispatchEvent(new Event('app-route'))
}

/**
 * Prefer query params (?r= / ?share=). Fall back to old hash routes (#/r/ #/share/).
 */
export function parseRoute() {
  const params = new URLSearchParams(window.location.search)
  const r = params.get('r')
  if (r) return { view: 'results', token: r }
  const share = params.get('share')
  if (share) return { view: 'share', token: share }

  const raw = window.location.hash.replace(/^#/, '')
  if (!raw || raw === '/') return { view: 'survey' }
  const parts = raw.split('/').filter(Boolean)
  if (parts[0] === 'r' && parts[1]) {
    return { view: 'results', token: parts.slice(1).join('/') }
  }
  if (parts[0] === 'share' && parts[1]) {
    return { view: 'share', token: parts.slice(1).join('/') }
  }
  return { view: 'survey' }
}

/** @deprecated use parseRoute */
export function parseHash() {
  return parseRoute()
}
