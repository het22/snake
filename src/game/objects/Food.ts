import { TILE_SIZE } from '@/constants'
import TileMap from '@/game/objects/TileMap'
import MainScene from '@/game/scenes/MainScene'

export default class Food {
    scene: MainScene
    map: TileMap
    column: number
    row: number
    isEaten: boolean

    private container: Phaser.GameObjects.Container | null = null

    constructor(scene: MainScene, map: TileMap, column: number, row: number) {
        this.scene = scene
        this.map = map
        this.column = column
        this.row = row
        this.isEaten = false
    }

    create() {
        const container = this.scene.add.container(
            (this.column + 0.5) * TILE_SIZE,
            (this.row + 0.5) * TILE_SIZE
        )

        container.add(this.scene.add.circle(0, 0, 5, 0x000000))
        container.add(this.scene.add.circle(0, 0, 2, 0xffffff))

        return container
    }

    destroy() {
        this.container?.destroy()
        this.container = null
    }

    eaten() {
        this.isEaten = true
        this.destroy()
    }
}
