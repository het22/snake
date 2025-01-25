import { TILE_SIZE } from '@/constants'
import MainScene from '@/game/scenes/MainScene'
import Food from '@/game/objects/Food'

export default class TileMap extends Phaser.GameObjects.Container {
    scene: MainScene
    tiles: Array<Array<Tile | Portal>>

    get columnSize(): number {
        return this.scene.cache.json.get(this.name).columnCount
    }

    get rowSize(): number {
        return this.scene.cache.json.get(this.name).rowCount
    }

    get foods(): Food[] {
        return this.scene.data
            .get('foods')
            .filter((food: Food) => food.map === this)
    }

    constructor(scene: MainScene, name: string) {
        super(scene)
        this.name = name

        const mapData = scene.cache.json.get(name)
        if (!mapData) {
            throw new Error(`맵 정보를 찾을 수 없습니다.(${name})`)
        }

        this.setPosition(
            (this.scene.game.canvas.width - this.columnSize * TILE_SIZE) / 2,
            (this.scene.game.canvas.height - this.rowSize * TILE_SIZE) / 2
        )

        this.tiles = Array.from({ length: mapData.rowCount }, (_, row) =>
            Array.from(
                { length: mapData.columnCount },
                (_, column) =>
                    new Tile(scene, this, {
                        map: name,
                        column,
                        row,
                        fill: mapData.visualTiles[row][column],
                        isCollidable: mapData.logicalTiles[row][column] === 1,
                    })
            )
        )

        const portalsData = scene.cache.json.get('portals')
        portalsData.forEach(([a, b]: any) => {
            let from, to
            if (a.map === mapData.name) {
                ;[from, to] = [a, b]
            } else if (b.map === mapData.name) {
                ;[from, to] = [b, a]
            } else {
                return
            }

            this.tiles[from.row][from.column].destroy(true)
            this.tiles[from.row][from.column] = new Portal(
                scene,
                this,
                {
                    map: name,
                    column: from.column,
                    row: from.row,
                    fill: Fill.Empty,
                    isCollidable: false,
                },
                to
            )
        })

        scene.data.set(
            'foods',
            (scene.data.get('foods') ?? []).concat(
                mapData.foods.map(
                    (food: any) => new Food(this, food.column, food.row)
                )
            )
        )
    }
}

class Tile extends Phaser.GameObjects.Container {
    map: TileMap
    column: number
    row: number
    fill: Fill
    isCollidable: boolean

    constructor(scene: MainScene, map: TileMap, tileData: TileData) {
        super(scene)
        this.map = map
        this.column = tileData.column
        this.row = tileData.row
        this.fill = tileData.fill
        this.isCollidable = tileData.isCollidable

        const tileObject = this.scene.add
            .rectangle(
                this.column * TILE_SIZE,
                this.row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE,
                this.fill === Fill.Normal ? 0x000000 : 0xffffff
            )
            .setOrigin(0, 0)
        this.add(tileObject)
        this.map.add(this)
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

export enum Fill {
    Empty = 0,
    Normal = 1,
}
