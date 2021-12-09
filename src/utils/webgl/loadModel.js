import { DoubleSide, Group, Mesh, MeshNormalMaterial } from 'three'

import loadGLTF from '@utils/loader/loadGLTF'

export default function loadModel(model) {
   return new Promise( resolve => {
      loadGLTF(model).then( response => {
         const geometries = [...response]
      
         setMesh(geometries).then( response => {
            resolve(response)
         })   
      })
   })
}

function setMesh(geometries) {
   return new Promise( resolve => {
      const group = new Group()

      const material = new MeshNormalMaterial({
         side: DoubleSide
      })

      geometries.forEach( geometry => {
         const mesh = new Mesh( geometry, material )
         mesh.frustumCulled = false
         
         group.add(mesh)
      })

      resolve(group)
   })
}