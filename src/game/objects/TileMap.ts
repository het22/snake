import { MapName, TILE_SIZE, Fill } from '@/constants'
import MainScene from '@/game/scenes/MainScene'
import Food from '@/game/objects/Food'
import Tile from '@/game/objects/Tile'

export default class TileMap {
    scene: MainScene
    name: MapName

    private tiles: Array<Array<Tile>>
    private foods: Food[]
    private container: Phaser.GameObjects.Container | null = null

    get columnSize(): number {
        return this.tiles[0].length
    }

    get rowSize(): number {
        return this.tiles.length
    }

    constructor(scene: MainScene, name: MapName) {
        this.scene = scene
        this.name = name

        const mapData = scene.cache.json.get(name)
        this.tiles = Array.from({ length: mapData.rowCount }, (_, row) =>
            Array.from({ length: mapData.columnCount }, (_, column) =>
                Tile.createTile(scene, this, {
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

            this.tiles[from.row][from.column] = Tile.createPortal(
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

        this.foods = mapData.foods.map(
            (food: any) => new Food(scene, this, food.column, food.row)
        )
    }

    create(): Phaser.GameObjects.Container {
        const container = new Phaser.GameObjects.Container(this.scene)
        container.setPosition(
            (this.scene.game.canvas.width - this.columnSize * TILE_SIZE) / 2,
            (this.scene.game.canvas.height - this.rowSize * TILE_SIZE) / 2
        )
        this.container = container

        this.tiles.forEach((row) => {
            row.forEach((tile) => {
                container.add(tile.create())
            })
        })

        this.foods
            .filter((food) => !food.isEaten)
            .forEach((food) => {
                container.add(food.create())
            })

        return container
    }

    destroy() {
        this.container?.destroy()
        this.container = null

        this.tiles.forEach((row) => {
            row.forEach((tile) => {
                tile.destroy()
            })
        })

        this.foods.forEach((food) => {
            food.destroy()
        })
    }
}
