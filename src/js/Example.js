import { DoubleSide, Mesh, MeshNormalMaterial } from 'three'

import World from '@js/World'
import { Store } from '@js/Store'

import geometryMerge from '@utils/webgl/geometryMerge'
import loadModel from '@utils/webgl/loadModel'

import gltfModel from '@public/models/scene.glb'
import gltfModel1 from '@public/models/test.glb'

export default class Example {
   constructor() {

      this.init()
   }

   init() {
      geometryMerge([], [gltfModel, gltfModel1]).then( response => {
         this.geoMerge = response
         console.log(this.geoMerge);
         const mesh = new Mesh(this.geoMerge, new MeshNormalMaterial({side: DoubleSide}))
         mesh.position.set(-5, 0, 0)
         mesh.rotation.y = -Math.PI
         World.add(mesh)
      })
      
      loadModel(gltfModel).then( response => {
         this.model1 = response
         World.add(this.model1)
      })
      
      loadModel(gltfModel1).then( response => {
         this.model2 = response
         World.add(this.model2)
      })
   }

   addObject(object) {
      World.add(object)
   }
}