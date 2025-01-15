import { TILE_SIZE } from '@/constants'
import TileMap from '@/game/objects/TileMap'

export default class Food {
    private scene: Phaser.Scene
    private gameObject: Phaser.GameObjects.Arc

    map: TileMap
    column: number
    row: number
    isEaten: boolean

    constructor(
        scene: Phaser.Scene,
        map: TileMap,
        column: number,
        row: number
    ) {
        this.scene = scene
        this.map = map
        this.column = column
        this.row = row
        this.isEaten = false
    }

    draw() {
        this.gameObject = this.scene.add.circle(
            (this.column + 0.5) * TILE_SIZE,
            (this.row + 0.5) * TILE_SIZE,
            5,
            0xffffff
        )
    }

    eaten() {
        this.gameObject.destroy()
        this.isEaten = true
    }
}
