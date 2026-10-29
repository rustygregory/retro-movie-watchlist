import { MOVIES_80S, MOVIES_90S, ALL_MOVIES } from '../data/movies.js'
import MovieRow from './MovieRow.jsx'

function ListSection({ title, movies, answers, filter }) {
  const filtered = movies.filter((m) => answers[m.id] === filter)
  if (filtered.length === 0) {
    return (
      <section className="results-section">
        <h3 className="results-subheading">{title}</h3>
        <p className="empty-note">None</p>
      </section>
    )
  }
  return (
    <section className="results-section">
      <h3 className="results-subheading">
        {title} <span className="count">({filtered.length})</span>
      </h3>
      <ol className="movie-list movie-list--readonly">
        {filtered.map((movie) => (
          <MovieRow
            key={movie.id}
            movie={movie}
            value={answers[movie.id]}
            readOnly
          />
        ))}
      </ol>
    </section>
  )
}

export default function Results({ name, answers, invalid }) {
  if (invalid) {
    return (
      <div className="page page--results">
        <header className="hero hero--compact">
          <h1 className="brand">Link not valid</h1>
          <p className="lede">
            This results link is missing or corrupted. Ask for a fresh copy of
            the watchlist link.
          </p>
        </header>
        <a className="text-btn" href="./">
          Start a new watchlist
        </a>
      </div>
    )
  }

  const seenCount = ALL_MOVIES.filter((m) => answers[m.id] === true).length
  const notSeenCount = ALL_MOVIES.length - seenCount
  const displayName = name.trim() || 'Someone'

  return (
    <div className="page page--results">
      <header className="hero">
        <p className="eyebrow">Results</p>
        <h1 className="brand brand--results">
          {`${displayName}'s Retro Movie Watchlist`}
        </h1>
        <div className="stat-row" aria-label="Summary counts">
          <p className="stat">
            <span className="stat-num">{notSeenCount}</span>
            <span className="stat-label">Not seen</span>
          </p>
          <p className="stat">
            <span className="stat-num">{seenCount}</span>
            <span className="stat-label">Seen</span>
          </p>
        </div>
      </header>

      <section className="decade" aria-labelledby="not-seen-heading">
        <h2 id="not-seen-heading" className="decade-heading">
          Not seen
        </h2>
        <ListSection title="1980s" movies={MOVIES_80S} answers={answers} filter={false} />
        <ListSection title="1990s" movies={MOVIES_90S} answers={answers} filter={false} />
      </section>

      <section className="decade" aria-labelledby="seen-heading">
        <h2 id="seen-heading" className="decade-heading">
          Seen
        </h2>
        <ListSection title="1980s" movies={MOVIES_80S} answers={answers} filter={true} />
        <ListSection title="1990s" movies={MOVIES_90S} answers={answers} filter={true} />
      </section>
    </div>
  )
}
