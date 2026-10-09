import { useRef, useState } from 'react'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import { MAX_PHOTO_BYTES, MAX_PRODUCT_PHOTOS, isSupportedProductPhoto, optimizeProductImage, preparePhotoBackgroundRemoval } from '../utils/productImages'
export default function ProductPhotoUpload({images,onChange,onBusyChange,disabled=false}:{images:string[];onChange:(images:string[])=>void;onBusyChange?:(busy:boolean)=>void;disabled?:boolean}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('')
  const working=useRef(false)
  return <div className="photo-upload"><div className="photo-upload-heading"><strong>Fotos del producto</strong><span>{images.length}/{MAX_PRODUCT_PHOTOS}</span></div><p>Hasta 6 fotos de 10 MB cada una. La primera será la portada. Las optimizamos automáticamente.</p><label className="photo-dropzone"><ImagePlus size={22}/><span>{busy?'Optimizando fotos…':'Añadir fotos'}</span><small>PNG, JPG, WebP o HEIC</small><input aria-label="Añadir fotos del producto" type="file" multiple accept="image/png,image/jpeg,image/webp,image/heic,image/heif,image/heic-sequence,image/heif-sequence,.heic,.heif" disabled={disabled||busy||images.length>=MAX_PRODUCT_PHOTOS} onChange={async event=>{
    const files=Array.from(event.currentTarget.files||[]);event.currentTarget.value='';if(!files.length||working.current)return
    setError('')
    if(images.length+files.length>MAX_PRODUCT_PHOTOS){setError('Puedes añadir un máximo de 6 fotos.');return}
    if(files.some(file=>file.size>MAX_PHOTO_BYTES)){setError('Cada foto debe pesar 10 MB o menos.');return}
    if(files.some(file=>!isSupportedProductPhoto(file))){setError('Selecciona fotos en formato PNG, JPG, WebP o HEIC.');return}
    preparePhotoBackgroundRemoval()
    working.current=true;setBusy(true);onBusyChange?.(true)
    try{const next:string[]=[];for(const file of files)next.push(await optimizeProductImage(file));onChange([...images,...next])}catch(failure){setError(failure instanceof Error?failure.message:'No pudimos procesar las fotos. Intenta nuevamente.')}finally{working.current=false;setBusy(false);onBusyChange?.(false)}
  }}/></label>{images.length>0&&<div className="photo-upload-grid">{images.map((image,index)=><div className="photo-upload-item" key={`${index}-${image.slice(-30)}`}><img src={image} alt={`Foto ${index+1} del producto`}/><span>{index===0?'Portada':`Foto ${index+1}`}</span><button type="button" className="photo-remove" disabled={disabled||busy} aria-label={`Eliminar foto ${index+1}`} onClick={()=>onChange(images.filter((_,i)=>i!==index))}><X size={14}/></button>{index>0&&<button type="button" disabled={disabled||busy} className="photo-cover" onClick={()=>onChange([image,...images.filter((_,i)=>i!==index)])}><ArrowLeft size={12}/>Usar de portada</button>}</div>)}</div>}{error&&<p role="alert" className="error-message">{error}</p>}</div>
}
