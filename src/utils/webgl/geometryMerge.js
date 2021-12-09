import { Matrix4, Object3D } from 'three'

import mergeBufferGeometries from '@utils/webgl/mergeBufferGeometries'
import loadGLTF from '@utils/loader/loadGLTF'

let geometries = []

export default function geometryMerge (geos = [], models = []) {
   return new Promise( resolve => {
      if (!geos.length && !models.length) resolve('No datas')
      
      geometries.push(...geos)

      geometriesFilter()
      loadModels(models).then( () => { 
         mergeGeometries().then( e => {
            resolve(e)
         })
      })
   })
}

function geometriesFilter() {
   let count = geometries.length
   
   for (let i = 0; i < count; i++) {
      const element = geometries[i]

      if ( element instanceof Object3D ) {
         const geos = []
         
         element.traverse( child => {
            if ( child.geometry ) {
               const mat4 = new Matrix4()
               
               child.updateWorldMatrix( true, false )
               mat4.multiplyMatrices( child.matrixWorld, child.matrix )
               child.geometry.applyMatrix4( child.matrixWorld )

               geos.push( child.geometry )
            }
         })
         
         geometries.splice( i, 1, ...geos )
         i += geos.length - 1
         count += geos.length - 1
      }
   }
}

function loadModels(models) {
   let count = 0

   return new Promise( resolve => {
      models.forEach(modelSrc => {
         loadGLTF(modelSrc).then( response => {
            geometries.push(...response)
            
            count++
            if (count === models.length) {
               resolve(geometries)
            }
         })
      })
   })
}

function mergeGeometries() {
   return new Promise( resolve => {
      mergeBufferGeometries([...geometries]).then( response => {
         geometries.forEach( geometry => {
            geometry.dispose()
            geometries = []
         })
   
         resolve(response)
      })
   })
}