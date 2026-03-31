import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  fallbackText?: string
}

export function ResponsiveImage({ src, alt, className = '', fallbackText }: ResponsiveImageProps) {
  const [error, setError] = useState(false)
  
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="text-center text-gray-400 dark:text-gray-500 p-4">
          <ImageOff className="w-12 h-12 mx-auto mb-2" />
          <p className="text-xs font-medium">{fallbackText || 'Imagem não disponível'}</p>
        </div>
      </div>
    )
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  )
}
