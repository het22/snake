import { TILE_SIZE } from '@/constants'
import MainScene from '@/game/scenes/MainScene'

type Tile = {
    fill: Fill
    isCollidable: boolean
}

export enum Fill {
    Empty = 0,
    Normal = 1,
}

export default class TileMap {
    name: string
    scene: MainScene
    tiles: Array<Array<Tile>>

    private constructor(
        scene: MainScene,
        name: string,
        tiles: Array<Array<Tile>>
    ) {
        this.scene = scene
        this.name = name
        this.tiles = tiles
    }

    static create(scene: MainScene, mapData: any) {
        return new TileMap(
            scene,
            mapData.name,
            Array.from({ length: mapData.rowCount }, (_, row) =>
                Array.from({ length: mapData.columnCount }, (_, column) => ({
                    fill: mapData.visualTiles[row][column],
                    isCollidable: mapData.logicalTiles[row][column] === 1,
                }))
            )
        )
    }

    draw() {
        const columnCount = this.tiles[0].length
        const rowCount = this.tiles.length
        const tileMapOrigin = {
            x: (this.scene.game.canvas.width - columnCount * TILE_SIZE) / 2,
            y: (this.scene.game.canvas.height - rowCount * TILE_SIZE) / 2,
        }

        for (let row = 0; row < rowCount; row++) {
            for (let column = 0; column < columnCount; column++) {
                const tile = this.tiles[row][column]
                const tileOrigin = {
                    x: tileMapOrigin.x + column * TILE_SIZE,
                    y: tileMapOrigin.y + row * TILE_SIZE,
                }

                switch (tile.fill) {
                    case Fill.Normal:
                        this.scene.add
                            .rectangle(
                                tileOrigin.x,
                                tileOrigin.y,
                                TILE_SIZE,
                                TILE_SIZE,
                                0xffffff
                            )
                            .setOrigin(0, 0)
                        break
                    case Fill.Empty:
                        break
                }
            }
        }
    }
}
