import { useState } from 'react'
import { MOVIES_80S, MOVIES_90S, MOVIE_IDS } from '../data/movies.js'
import MovieRow from './MovieRow.jsx'

function DecadeTitle({ years }) {
  return (
    <span className="decade-year">
      {years}
      <span className="decade-s">s</span>
    </span>
  )
}

export default function Survey({
  name,
  answers,
  onNameChange,
  onAnswer,
  onReset,
  onSubmit,
}) {
  const [attempted, setAttempted] = useState(false)
  const answeredCount = MOVIE_IDS.filter((id) => typeof answers[id] === 'boolean').length
  const allAnswered = answeredCount === MOVIE_IDS.length
  const remaining = MOVIE_IDS.length - answeredCount
  const nameMissing = name.trim().length === 0
  const unmarkedIds = new Set(
    MOVIE_IDS.filter((id) => typeof answers[id] !== 'boolean'),
  )

  function handleAnswer(id, seen) {
    onAnswer(id, seen)
  }

  function handleReset() {
    setAttempted(false)
    onReset()
  }

  function handleSubmitClick() {
    setAttempted(true)

    if (!allAnswered || nameMissing) {
      const firstUnmarked = MOVIE_IDS.find((id) => typeof answers[id] !== 'boolean')
      const target = firstUnmarked
        ? document.getElementById(`movie-${firstUnmarked}`)
        : document.getElementById('name-input')
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    onSubmit()
  }

  return (
    <div className="page page--survey">
      <header className="hero">
        <h1 className="brand">Retro Movie Watchlist</h1>
        <p className="lede">
          Mark which classics you’ve seen from the ’80s and ’90s, then send your
          results back.
        </p>
        <p className="progress" aria-live="polite">
          {allAnswered
            ? 'All 20 answered — add your name and submit.'
            : `${answeredCount} of 20 answered${remaining ? ` · ${remaining} left` : ''}`}
        </p>
      </header>

      <section className="decade" aria-labelledby="decade-80s">
        <div className="decade-heading-row">
          <h2 id="decade-80s" className="decade-heading">
            <span className="decade-label">1–10</span>
            <DecadeTitle years="1980" />
          </h2>
          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
        <ol className="movie-list">
          {MOVIES_80S.map((movie) => (
            <MovieRow
              key={movie.id}
              movie={movie}
              value={answers[movie.id]}
              invalid={attempted && unmarkedIds.has(movie.id)}
              onChange={(seen) => handleAnswer(movie.id, seen)}
            />
          ))}
        </ol>
      </section>

      <section className="decade" aria-labelledby="decade-90s">
        <div className="decade-heading-row">
          <h2 id="decade-90s" className="decade-heading">
            <span className="decade-label">1–10</span>
            <DecadeTitle years="1990" />
          </h2>
        </div>
        <ol className="movie-list">
          {MOVIES_90S.map((movie) => (
            <MovieRow
              key={movie.id}
              movie={movie}
              value={answers[movie.id]}
              invalid={attempted && unmarkedIds.has(movie.id)}
              onChange={(seen) => handleAnswer(movie.id, seen)}
            />
          ))}
        </ol>
      </section>

      <div className="sticky-bar" role="region" aria-label="Submit your watchlist">
        <label className={`name-field ${attempted && nameMissing ? 'name-field--invalid' : ''}`}>
          <span className="name-label">Your name</span>
          <input
            id="name-input"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            aria-invalid={attempted && nameMissing}
          />
          {attempted && nameMissing ? (
            <span className="field-error" role="alert">
              Enter your name to submit
            </span>
          ) : null}
        </label>
        <button type="button" className="submit-btn" onClick={handleSubmitClick}>
          Submit
        </button>
      </div>
    </div>
  )
}
