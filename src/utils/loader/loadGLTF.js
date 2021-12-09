import { BufferAttribute, BufferGeometry } from 'three'

export default function loadGLTF(src) {
   const worker = new Worker(new URL('../../workers/loadFatGLTFWorker.js', import.meta.url))

   const geometries = []

   return new Promise( resolve => {
      worker.postMessage(
         { url: src },
      )

      worker.addEventListener('message', e => {
         const geo = e.data

         geo.forEach( attributes => {
            const bufferGeo = new BufferGeometry()
      
            // Conversion des attributes du model en geometry
            bufferGeo.setIndex(new BufferAttribute( attributes.index, 1, false ) )
            bufferGeo.setAttribute( 'position', new BufferAttribute( attributes.pos, 3, false ) )
            bufferGeo.setAttribute( 'normal', new BufferAttribute( attributes.normal, 3, false ) )
            bufferGeo.setAttribute( 'uv', new BufferAttribute( attributes.uv, 2, false ) )
            
            geometries.push(bufferGeo)
         })
         
         worker.terminate()
         resolve(geometries)
      })
   })
}
