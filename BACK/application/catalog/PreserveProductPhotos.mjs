import {productPhotos,photoVersion} from './DeliverCatalog.mjs'
// Published URLs refer to positions in the old gallery. Resolve before replacing it.
export function preserveProductPhotos(product, images) {
 const originals=productPhotos(product)
 return images.map(image=>{
  if(!/^https?:\/\//.test(image))return image
  const url=new URL(image)
  const index=originals.findIndex((photo,index)=>url.pathname===`/api/products/${encodeURIComponent(product.id)}/images/${index}`&&url.searchParams.get('v')===photoVersion(photo))
  return index>=0?originals[index]:image
 })
}
