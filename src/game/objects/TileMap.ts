import { TILE_SIZE } from '@/constants'
import MainScene from '@/game/scenes/MainScene'
import Food from '@/game/objects/Food'

type Tile = {
    mapName: string
    column: number
    row: number
    fill: Fill
    isCollidable: boolean
    portal?: Portal
}

type Portal = {
    mapName: string
    column: number
    row: number
}

export enum Fill {
    Empty = 0,
    Normal = 1,
}

export default class TileMap extends Phaser.GameObjects.Container {
    scene: MainScene
    tiles: Array<Array<Tile>>

    get foods(): Food[] {
        return this.scene.foods.filter((food) => food.map === this)
    }

    get columnSize(): number {
        return this.tiles[0].length
    }

    get rowSize(): number {
        return this.tiles.length
    }

    private constructor(scene: MainScene, tiles: Array<Array<Tile>>) {
        super(scene)
        this.tiles = tiles
    }

    static create(scene: MainScene, mapName: string) {
        const mapData = scene.cache.json.get(mapName)
        if (!mapData) {
            throw new Error(`맵 정보를 찾을 수 없습니다.(${mapName})`)
        }

        const tiles = Array.from({ length: mapData.rowCount }, (_, row) =>
            Array.from(
                { length: mapData.columnCount },
                (_, column) =>
                    ({
                        mapName: mapData.name,
                        column,
                        row,
                        fill: mapData.visualTiles[row][column],
                        isCollidable: mapData.logicalTiles[row][column] === 1,
                    } as Tile)
            )
        )

        const portalsData = scene.cache.json.get('portals')
        portalsData.forEach(([a, b]: any) => {
            let from, to
            if (a.mapName === mapData.name) {
                ;[from, to] = [a, b]
            } else if (b.mapName === mapData.name) {
                ;[from, to] = [b, a]
            } else {
                return
            }

            tiles[from.row][from.column].portal = {
                mapName: to.mapName,
                column: to.column,
                row: to.row,
            }
        })

        const map = new TileMap(scene, tiles)
        map.name = mapData.name
        map.setX(
            (scene.game.canvas.width - mapData.columnCount * TILE_SIZE) / 2
        )
        map.setY((scene.game.canvas.height - mapData.rowCount * TILE_SIZE) / 2)
        scene.add.existing(map)

        scene.data.set(
            'foods',
            (scene.data.get('foods') ?? []).concat(
                mapData.foods.map(
                    (food: any) => new Food(map, food.column, food.row)
                )
            )
        )
        return map
    }

    draw() {
        for (let row = 0; row < this.rowSize; row++) {
            for (let column = 0; column < this.columnSize; column++) {
                const tile = this.tiles[row][column]
                const tileOriginX = column * TILE_SIZE
                const tileOriginY = row * TILE_SIZE

                let tileObject: Phaser.GameObjects.GameObject

                switch (tile.fill) {
                    case Fill.Normal:
                        tileObject = this.scene.add
                            .rectangle(
                                tileOriginX,
                                tileOriginY,
                                TILE_SIZE,
                                TILE_SIZE,
                                0x000000
                            )
                            .setOrigin(0, 0)
                        break
                    case Fill.Empty:
                        tileObject = this.scene.add
                            .rectangle(
                                tileOriginX,
                                tileOriginY,
                                TILE_SIZE,
                                TILE_SIZE,
                                0xffffff
                            )
                            .setOrigin(0, 0)
                        break
                }

                this.add(tileObject)
            }
        }

        this.foods.forEach((food) => food.draw())
    }
}
