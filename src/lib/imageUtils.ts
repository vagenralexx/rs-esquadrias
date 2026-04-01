/**
 * Converts any image File to WebP format using Canvas API.
 * Returns a new File with .webp extension and image/webp type.
 * Quality: 0.85 (good balance between size and quality)
 */
export async function convertToWebP(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context unavailable'))
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Conversion failed'))
          const baseName = file.name.replace(/\.[^.]+$/, '')
          resolve(new File([blob], `${baseName}.webp`, { type: 'image/webp' }))
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')) }
    img.src = url
  })
}
