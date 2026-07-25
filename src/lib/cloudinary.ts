const CLOUD_NAME = 'alsmxiwq';

export function buildCloudinaryUrl(src: string, width?: number, quality: string | number = 'auto'): string {
  if (!src) return '';
  
  // Si ya es de Cloudinary, retornarla
  if (src.includes('res.cloudinary.com')) return src;

  // Parámetros de transformación: formato automático, calidad, ancho (opcional)
  const transforms = ['f_auto', `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  
  const transformString = transforms.join(',');

  // Si la imagen es una URL absoluta externa (ej. Firebase Storage, Unsplash) usamos el endpoint 'fetch'
  if (src.startsWith('http')) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformString}/${encodeURIComponent(src)}`;
  }

  // Si la imagen es local (ej. '/logo.png'), asume que debe usarse upload (si está en Cloudinary) o fetch a la URL base.
  // En export estático, las imágenes locales se pueden cargar directo, pero si queremos pasarlas por Cloudinary
  // necesitaríamos la URL absoluta de producción. En este caso, simplemente retornamos el src original.
  return src;
}
