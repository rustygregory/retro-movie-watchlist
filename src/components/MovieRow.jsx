import { useState } from 'react'
import PosterLightbox from './PosterLightbox.jsx'

export default function MovieRow({
  movie,
  value,
  onChange,
  readOnly = false,
  invalid = false,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const seen = value === true
  const notSeen = value === false
  const errorId = `error-${movie.id}`

  return (
    <li
      id={`movie-${movie.id}`}
      className={`movie-row ${invalid ? 'movie-row--invalid' : ''}`}
    >
      <button
        type="button"
        className="poster-wrap poster-wrap--button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`View ${movie.title} poster`}
      >
        <img
          className="poster"
          src={movie.poster}
          alt=""
          width={77}
          height={116}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.classList.add('poster--fallback')
            e.currentTarget.removeAttribute('src')
          }}
        />
      </button>

      <div className="movie-meta">
        <div className="movie-title-line">
          <span className="movie-number" aria-hidden="true">
            {movie.number}.
          </span>
          <h3 className="movie-title">{movie.title}</h3>
        </div>
        <p className="movie-year">
          {movie.year}
          <span className="movie-rating">{movie.rating}</span>
        </p>

        {readOnly ? (
          <p className={`badge ${seen ? 'badge--seen' : 'badge--not'}`}>
            {seen ? 'Seen' : 'Not seen'}
          </p>
        ) : (
          <>
            <div
              className={`toggle-group ${invalid ? 'toggle-group--invalid' : ''}`}
              role="group"
              aria-label={`Have you seen ${movie.title}?`}
              aria-describedby={invalid ? errorId : undefined}
            >
              <button
                type="button"
                className={`toggle ${seen ? 'toggle--active toggle--seen' : ''}`}
                aria-pressed={seen}
                onClick={() => onChange(true)}
              >
                Seen
              </button>
              <button
                type="button"
                className={`toggle ${notSeen ? 'toggle--active toggle--not' : ''}`}
                aria-pressed={notSeen}
                onClick={() => onChange(false)}
              >
                Not seen
              </button>
            </div>
            {invalid ? (
              <p id={errorId} className="field-error" role="alert">
                Mark Seen or Not seen
              </p>
            ) : null}
          </>
        )}
      </div>

      {lightboxOpen ? (
        <PosterLightbox movie={movie} onClose={() => setLightboxOpen(false)} />
      ) : null}
    </li>
  )
}
