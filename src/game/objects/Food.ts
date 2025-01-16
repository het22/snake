import { TILE_SIZE } from '@/constants'
import TileMap from '@/game/objects/TileMap'

export default class Food extends Phaser.GameObjects.Container {
    map: TileMap
    column: number
    row: number
    isEaten: boolean

    constructor(map: TileMap, column: number, row: number) {
        super(map.scene)
        this.map = map
        this.column = column
        this.row = row
        this.isEaten = false
    }

    draw() {
        this.add(this.scene.add.circle(0, 0, 5, 0x000000))
        this.add(this.scene.add.circle(0, 0, 2, 0xffffff))
        this.setX((this.column + 0.5) * TILE_SIZE)
        this.setY((this.row + 0.5) * TILE_SIZE)
        this.map.add(this)
    }

    eaten() {
        this.destroy()
        this.isEaten = true
    }
}
