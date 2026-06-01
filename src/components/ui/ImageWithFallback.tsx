import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallback?: string
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallback,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className={`bg-dark-700 flex items-center justify-center ${className}`}
        aria-label={alt}
      >
        <span className="text-dark-400 text-sm font-medium">
          {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}
