import { BufferAttribute, BufferGeometry } from 'three'

export default function mergeBufferGeometries( datas ) {
   const worker = new Worker(new URL('../../workers/mergeGeoWorker.js', import.meta.url))
   
   const geometries = []
   const buffers = []

   return new Promise( resolve => {
      for (let i = 0; i <  datas.length; i++) {
         geometries[i] = {}
         geometries[i].index = datas[i].index.array
         geometries[i].position = datas[i].attributes.position.array
         geometries[i].normal = datas[i].attributes.normal.array
         geometries[i].uv = datas[i].attributes.uv.array

         buffers.push( datas[i].index.array.buffer )
         buffers.push( datas[i].attributes.position.array.buffer )
         buffers.push( datas[i].attributes.normal.array.buffer )
         buffers.push( datas[i].attributes.uv.array.buffer )
      }

      worker.postMessage(
         { geometries: geometries },
         [...new Set( buffers )],
      )

      worker.addEventListener('message', response => {
         const geo = response.data

         const bufferGeo = new BufferGeometry()
   
         // Conversion des attributes mergés en geometry
         bufferGeo.setIndex(new BufferAttribute( geo.index, 1, false ) )
         bufferGeo.setAttribute( 'position', new BufferAttribute( geo.pos, 3, false ) )
         bufferGeo.setAttribute( 'normal', new BufferAttribute( geo.normal, 3, false ) )
         bufferGeo.setAttribute( 'uv', new BufferAttribute( geo.uv, 2, false ) )

         worker.terminate()
         resolve(bufferGeo)
      })
   })
}