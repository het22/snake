import { TILE_SIZE } from '@/constants'
import MainScene from '@/game/scenes/MainScene'

interface SnakeSegment {
    column: number
    row: number
    gameObject: Phaser.GameObjects.Container | Phaser.GameObjects.Rectangle
}

export default class Snake {
    private scene: MainScene
    private segments: SnakeSegment[] = []
    private direction: 'up' | 'down' | 'left' | 'right' | null = null
    private lastMoveTime: number = 0
    private moveInterval: number = 300

    constructor(scene: MainScene) {
        this.scene = scene
        this.setupControls()
    }

    private setupControls(): void {
        this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up'
                    break
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down'
                    break
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left'
                    break
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right'
                    break
            }
        })
    }

    draw(column: number, row: number): void {
        const head = this.scene.add.container(
            column * TILE_SIZE + 1,
            row * TILE_SIZE + 1
        )
        head.setDepth(1)

        const headShape = this.scene.add.rectangle(
            0,
            0,
            TILE_SIZE - 2,
            TILE_SIZE - 2,
            0xffffff
        )
        headShape.setOrigin(0, 0)

        const eyeSize = 4
        const leftEye = this.scene.add.rectangle(
            2,
            6,
            eyeSize,
            eyeSize,
            0x000000
        )
        leftEye.setOrigin(0, 0)

        const rightEye = this.scene.add.rectangle(
            12,
            6,
            eyeSize,
            eyeSize,
            0x000000
        )
        rightEye.setOrigin(0, 0)

        head.add([headShape, leftEye, rightEye])

        this.segments.push({
            column,
            row,
            gameObject: head,
        })

        for (let i = 1; i < 3; i++) {
            const segment = this.scene.add.rectangle(
                column * TILE_SIZE + 1,
                row * TILE_SIZE + 1,
                TILE_SIZE - 2,
                TILE_SIZE - 2,
                0xffffff
            )
            segment.setOrigin(0, 0)
            this.segments.push({
                column,
                row,
                gameObject: segment,
            })
        }
    }

    update(time: number): void {
        if (time - this.lastMoveTime > this.moveInterval) {
            this.move()
            this.lastMoveTime = time
        }
    }

    move(): void {
        const currentHead = this.segments[0]
        const nextColumn =
            currentHead.column +
            (this.direction === 'right'
                ? 1
                : this.direction === 'left'
                ? -1
                : 0)
        const nextRow =
            currentHead.row +
            (this.direction === 'down' ? 1 : this.direction === 'up' ? -1 : 0)

        if (this.scene.currentMap.tiles[nextRow][nextColumn].isCollidable) {
            return
        }

        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].column = this.segments[i - 1].column
            this.segments[i].row = this.segments[i - 1].row
            this.segments[i].gameObject.x =
                this.segments[i].column * TILE_SIZE + 1
            this.segments[i].gameObject.y = this.segments[i].row * TILE_SIZE + 1
        }

        this.segments[0].column = nextColumn
        this.segments[0].row = nextRow
        this.segments[0].gameObject.x = nextColumn * TILE_SIZE + 1
        this.segments[0].gameObject.y = nextRow * TILE_SIZE + 1
    }
}
