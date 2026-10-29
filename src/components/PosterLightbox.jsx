import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function largePosterSrc(src) {
  if (!src) return src
  return src.replace('/t/p/w154', '/t/p/w780')
}

export default function PosterLightbox({ movie, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${movie.title} poster`}
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>
      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <img
          className="lightbox-poster"
          src={largePosterSrc(movie.poster)}
          alt={`${movie.title} (${movie.year})`}
          referrerPolicy="no-referrer"
        />
        <p className="lightbox-caption">
          {movie.title} <span>({movie.year})</span>
        </p>
      </div>
    </div>,
    document.body,
  )
}
