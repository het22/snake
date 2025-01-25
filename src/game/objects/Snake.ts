import { TILE_SIZE } from '@/constants'
import MainScene from '@/game/scenes/MainScene'
import TileMap from '@/game/objects/TileMap'

export default class Snake extends Phaser.GameObjects.Container {
    scene: MainScene
    segments: Segment[]
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private readonly moveFrameRate = 6
    private moveFrameCount = this.moveFrameRate

    get head(): Head {
        return this.segments[0]
    }

    get tail(): Body {
        return this.segments[this.segments.length - 1]
    }

    constructor(scene: MainScene) {
        super(scene)
        this.segments = []
        this.cursors = scene.input.keyboard!.createCursorKeys()
    }

    create(map: TileMap, column: number, row: number): void {
        this.segments.push(new Head(this.scene, map, column, row))
        this.segments.push(new Body(this.scene, map, column, row))
        this.segments.push(new Body(this.scene, map, column, row))
        this.segments.push(new Body(this.scene, map, column, row))
        this.add([...this.segments].reverse())
        map.add(this)
    }

    update(): void {
        const keysDown = [
            this.cursors.up,
            this.cursors.down,
            this.cursors.left,
            this.cursors.right,
        ].filter((key) => key.isDown)

        if (keysDown.length > 0) {
            if (this.moveFrameCount++ > this.moveFrameRate) {
                const latestKeyDown = keysDown.reduce((acc, key) => {
                    if (!key.isDown) {
                        return acc
                    }

                    return acc.timeDown > key.timeDown ? acc : key
                }, keysDown[0])

                this.move(latestKeyDown)

                this.moveFrameCount = 0
            }
        } else {
            this.moveFrameCount = this.moveFrameRate
        }

        this.scene.world.map.foods
            .filter((food) => !food.isEaten)
            .forEach((food) => {
                if (
                    this.segments[0].column === food.column &&
                    this.segments[0].row === food.row
                ) {
                    food.eaten()
                    this.grow()
                }
            })
    }

    move(key: Phaser.Input.Keyboard.Key): void {
        let nextColumn = this.head.column
        let nextRow = this.head.row
        let nextMap = this.head.map

        if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
            nextColumn++
        } else if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) {
            nextColumn--
        } else if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) {
            nextRow++
        } else if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) {
            nextRow--
        } else {
            return
        }

        const { columnSize, rowSize, tiles } = this.scene.world.map
        if (
            nextColumn >= 0 &&
            nextRow >= 0 &&
            nextColumn < columnSize &&
            nextRow < rowSize
        ) {
            const nextTile = tiles[nextRow][nextColumn]
            if (nextTile.isCollidable) {
                return
            }
        } else {
            const portal = tiles[this.head.row][this.head.column]
            if (!('target' in portal)) {
                return
            }

            this.scene.world.setMap(portal.target.map)

            nextColumn = portal.target.column
            nextRow = portal.target.row
            nextMap = this.scene.world.maps.get(portal.target.map)!

            const prevMap = this.parentContainer
            if (prevMap !== nextMap) {
                prevMap.remove(this)
                nextMap.add(this)
            }
        }

        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].column = this.segments[i - 1].column
            this.segments[i].row = this.segments[i - 1].row
            this.segments[i].map = this.segments[i - 1].map
        }

        this.segments[0].column = nextColumn
        this.segments[0].row = nextRow
        this.segments[0].map = nextMap

        this.removeAll()
        this.add(
            [...this.segments.filter((seg) => seg.map === nextMap)].reverse()
        )
    }

    grow() {
        const body = new Body(
            this.scene,
            this.tail.map,
            this.tail.column,
            this.tail.row
        )
        this.segments.push(body)
        this.addAt(body, 0)
    }
}

class Segment extends Phaser.GameObjects.Container {
    scene: MainScene
    private _map: string
    private _column: number
    private _row: number

    constructor(scene: MainScene, map: TileMap, column: number, row: number) {
        super(scene)
        this._map = map.name
        this.column = column
        this.row = row
    }

    get map(): TileMap {
        return this.scene.world.maps.get(this._map)!
    }

    get column(): number {
        return this._column
    }

    get row(): number {
        return this._row
    }

    set map(value: TileMap) {
        this._map = value.name
    }

    set column(value: number) {
        this._column = value
        this.setX(value * TILE_SIZE)
    }

    set row(value: number) {
        this._row = value
        this.setY(value * TILE_SIZE)
    }
}

class Head extends Segment {
    constructor(scene: MainScene, map: TileMap, column: number, row: number) {
        super(scene, map, column, row)
        this.add([
            this.scene.add
                .rectangle(0, 0, TILE_SIZE, TILE_SIZE, 0x000000)
                .setOrigin(0, 0),
            this.scene.add.circle(5, 8, 2, 0xffffff),
            this.scene.add.circle(15, 8, 2, 0xffffff),
        ])
    }
}

class Body extends Segment {
    constructor(scene: MainScene, map: TileMap, column: number, row: number) {
        super(scene, map, column, row)
        this.add(
            this.scene.add
                .rectangle(0, 0, TILE_SIZE, TILE_SIZE, 0x000000)
                .setOrigin(0, 0)
        )
    }
}
