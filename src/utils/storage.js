const STORAGE_KEY = 'retro-movie-watchlist-draft'

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { name: '', answers: {} }
    const data = JSON.parse(raw)
    return {
      name: typeof data.name === 'string' ? data.name : '',
      answers:
        data.answers && typeof data.answers === 'object' ? data.answers : {},
    }
  } catch {
    return { name: '', answers: {} }
  }
}

export function saveDraft({ name, answers }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name, answers }),
    )
  } catch {
    // ignore quota / private mode
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
