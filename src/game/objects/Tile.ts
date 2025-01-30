import MainScene from '@/game/scenes/MainScene'
import TileMap from '@/game/objects/TileMap'
import { Fill, TILE_SIZE } from '@/constants'

export default class Tile {
    scene: MainScene
    map: TileMap
    column: number
    row: number
    fill: Fill
    isCollidable: boolean

    private gameObject: Phaser.GameObjects.Rectangle | null = null

    constructor(scene: MainScene, map: TileMap, tileData: TileData) {
        this.scene = scene
        this.map = map
        this.column = tileData.column
        this.row = tileData.row
        this.fill = tileData.fill
        this.isCollidable = tileData.isCollidable
    }

    static createTile(
        scene: MainScene,
        map: TileMap,
        tileData: TileData
    ): Tile {
        return new Tile(scene, map, tileData)
    }

    static createPortal(
        scene: MainScene,
        map: TileMap,
        tileData: TileData,
        target: { map: string; column: number; row: number }
    ): Portal {
        return new Portal(scene, map, tileData, target)
    }

    create(): Phaser.GameObjects.Rectangle {
        const gameObject = new Phaser.GameObjects.Rectangle(
            this.scene,
            this.column * TILE_SIZE,
            this.row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            this.fill === Fill.Normal ? 0x000000 : 0xffffff
        ).setOrigin(0, 0)

        this.gameObject = gameObject

        return gameObject
    }

    destroy() {
        this.gameObject?.destroy()
        this.gameObject = null
    }
}

class Portal extends Tile {
    target: {
        map: string
        column: number
        row: number
    }

    constructor(
        scene: MainScene,
        map: TileMap,
        tileData: TileData,
        target: { map: string; column: number; row: number }
    ) {
        super(scene, map, tileData)
        this.target = target
    }
}

type TileData = {
    map: string
    column: number
    row: number
    fill: Fill
    isCollidable: boolean
}
