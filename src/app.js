import './main.scss'

import World from '@js/World'
import Control from '@js/Control'
import Raf from '@js/Raf'
import Example from '@js/Example'

const example = new Example()

document.addEventListener('keydown', e => {
    console.log(`${e.key} touch pressed`)
})

Raf.suscribe('update', () => { update() })

function update() {
    World.render()
    Control.update()
}