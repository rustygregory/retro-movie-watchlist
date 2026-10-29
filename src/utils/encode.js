import { MOVIE_IDS } from '../data/movies.js'

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
 * Compact payload: { n: name, a: { [movieId]: true|false } }
 * Encoded as base64url JSON for the hash URL.
 */
export function encodeResults({ name, answers }) {
  const payload = {
    n: name.trim(),
    a: Object.fromEntries(
      MOVIE_IDS.map((id) => [id, answers[id] === true]),
    ),
  }
  return toBase64Url(utf8Encode(JSON.stringify(payload)))
}

export function decodeResults(token) {
  if (!token || typeof token !== 'string') return null
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

export function buildResultsUrl(token) {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#/r/${token}`
}

export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, '')
  if (!raw || raw === '/' || raw === '') {
    return { view: 'survey' }
  }
  const parts = raw.split('/').filter(Boolean)
  if (parts[0] === 'r' && parts[1]) {
    return { view: 'results', token: parts[1] }
  }
  if (parts[0] === 'share' && parts[1]) {
    return { view: 'share', token: parts[1] }
  }
  return { view: 'survey' }
}
