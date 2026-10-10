import { useState } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react'
import Dialog from './Dialog'

export default function ProductImageZoom({ photos, initialIndex, name, onClose }: { photos: string[]; initialIndex: number; name: string; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const changePhoto = (direction: number) => { setIndex(current => (current + direction + photos.length) % photos.length); setZoom(1) }
  return <Dialog label={`Fotos ampliadas de ${name}`} onClose={onClose} className="image-zoom-dialog">
    <div className="image-zoom" onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1) } if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1) } }}>
      <header className="image-zoom-header"><div><h2>{name}</h2><p role="status">Foto {index + 1} de {photos.length}</p></div><button type="button" onClick={onClose} aria-label="Cerrar imagen ampliada"><X size={22}/></button></header>
      <div className="image-zoom-viewport" tabIndex={0} aria-label="Imagen ampliada. Desplázate para ver los detalles."><div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><img src={photos[index]} alt={`${name}, foto ${index + 1}`} draggable={false}/></div></div>
      <div className="image-zoom-controls">{photos.length > 1 && <button type="button" onClick={() => changePhoto(-1)} aria-label="Foto anterior"><ChevronLeft size={20}/></button>}<div className="image-zoom-scale"><button type="button" onClick={() => setZoom(value => Math.max(1, value - .5))} disabled={zoom === 1} aria-label="Reducir zoom"><Minus size={18}/></button><button type="button" onClick={() => setZoom(1)} aria-label="Restablecer zoom">{Math.round(zoom * 100)}%</button><button type="button" onClick={() => setZoom(value => Math.min(3, value + .5))} disabled={zoom === 3} aria-label="Aumentar zoom"><Plus size={18}/></button></div>{photos.length > 1 && <button type="button" onClick={() => changePhoto(1)} aria-label="Foto siguiente"><ChevronRight size={20}/></button>}</div>
    </div>
  </Dialog>
}
