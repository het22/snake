import { TILE_SIZE } from '@/constants'
import MainScene from '@/game/scenes/MainScene'

interface SnakeSegment {
    column: number
    row: number
    gameObject: Phaser.GameObjects.Container | Phaser.GameObjects.Rectangle
}

export default class Snake {
    private scene: MainScene
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private segments: SnakeSegment[] = []
    private readonly moveFrameRate = 6
    private moveFrameCount = this.moveFrameRate

    constructor(scene: MainScene) {
        this.scene = scene
        this.cursors = scene.input.keyboard!.createCursorKeys()
    }

    private createHead() {
        const head = this.scene.add.container()
        head.setDepth(1)

        const headShape = this.scene.add.rectangle(
            0,
            0,
            TILE_SIZE,
            TILE_SIZE,
            0xffffff
        )
        headShape.setOrigin(0, 0)

        const eyeSize = 2
        const leftEye = this.scene.add.circle(5, 8, eyeSize, 0x000000)
        const rightEye = this.scene.add.circle(15, 8, eyeSize, 0x000000)
        head.add([headShape, leftEye, rightEye])

        return head
    }

    private createBody() {
        const body = this.scene.add.rectangle(
            0,
            0,
            TILE_SIZE,
            TILE_SIZE,
            0xffffff
        )
        body.setOrigin(0, 0)
        return body
    }

    draw(column: number, row: number): void {
        const head = this.createHead()
        head.setPosition(column * TILE_SIZE, row * TILE_SIZE)
        this.segments.push({
            column,
            row,
            gameObject: head,
        })

        for (let i = 1; i < 3; i++) {
            const body = this.createBody()
            body.setPosition(column * TILE_SIZE, row * TILE_SIZE)
            this.segments.push({
                column,
                row,
                gameObject: body,
            })
        }
    }

    move(key: Phaser.Input.Keyboard.Key): void {
        const currentHead = this.segments[0]

        let nextColumn = currentHead.column
        let nextRow = currentHead.row

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

        if (this.scene.currentMap.tiles[nextRow][nextColumn].isCollidable) {
            return
        }

        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].column = this.segments[i - 1].column
            this.segments[i].row = this.segments[i - 1].row
            this.segments[i].gameObject.x = this.segments[i].column * TILE_SIZE
            this.segments[i].gameObject.y = this.segments[i].row * TILE_SIZE
        }

        this.segments[0].column = nextColumn
        this.segments[0].row = nextRow
        this.segments[0].gameObject.x = nextColumn * TILE_SIZE
        this.segments[0].gameObject.y = nextRow * TILE_SIZE
    }

    grow() {
        const lastSegment = this.segments[this.segments.length - 1]
        const body = this.createBody()
        body.setPosition(
            lastSegment.column * TILE_SIZE,
            lastSegment.row * TILE_SIZE
        )
        this.segments.push({
            column: lastSegment.column,
            row: lastSegment.row,
            gameObject: body,
        })
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

        this.scene.currentMap.foods
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
}
