export async function productPhotoUpdate(original: string[], edited: string[], process: (images:string[])=>Promise<string[]>): Promise<{images?:string[];image?:string}> {
  if(original.length===edited.length&&original.every((image,index)=>image===edited[index]))return {}
  const published=new Set(original)
  const added=edited.filter(image=>!published.has(image))
  const processed=added.length?await process(added):[]
  let index=0
  const images=edited.map(image=>published.has(image)?image:processed[index++])
  return {images,image:images[0]||''}
}
