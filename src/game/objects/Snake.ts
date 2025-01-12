import MainScene from '@/game/scenes/MainScene'

interface SnakeSegment {
    gridX: number
    gridY: number
    gameObject: Phaser.GameObjects.Container | Phaser.GameObjects.Rectangle
}

export default class Snake {
    private scene: MainScene
    private segments: SnakeSegment[] = []
    private direction: 'up' | 'down' | 'left' | 'right' | null = null
    private lastMoveTime: number = 0
    private moveInterval: number = 300

    constructor(scene: MainScene, startGridX: number, startGridY: number) {
        this.scene = scene
        this.initSegments(startGridX, startGridY)
        this.setupControls()
    }

    private initSegments(startGridX: number, startGridY: number): void {
        const head = this.scene.add.container(
            startGridX * this.scene.gridSize,
            startGridY * this.scene.gridSize
        )
        head.setDepth(1)

        const headShape = this.scene.add.rectangle(
            0,
            0,
            this.scene.gridSize - 2,
            this.scene.gridSize - 2,
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
            gridX: startGridX,
            gridY: startGridY,
            gameObject: head,
        })

        for (let i = 1; i < 3; i++) {
            const segment = this.scene.add.rectangle(
                startGridX * this.scene.gridSize,
                startGridY * this.scene.gridSize,
                this.scene.gridSize - 2,
                this.scene.gridSize - 2,
                0xffffff
            )
            segment.setOrigin(0, 0)
            this.segments.push({
                gridX: startGridX,
                gridY: startGridY,
                gameObject: segment,
            })
        }
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

    update(time: number): void {
        if (time - this.lastMoveTime > this.moveInterval) {
            this.move()
            this.lastMoveTime = time
        }
    }

    move(): void {
        const currentHead = this.segments[0]
        const nextGridX =
            currentHead.gridX +
            (this.direction === 'right'
                ? 1
                : this.direction === 'left'
                ? -1
                : 0)
        const nextGridY =
            currentHead.gridY +
            (this.direction === 'down' ? 1 : this.direction === 'up' ? -1 : 0)

        if (
            nextGridX < 0 ||
            nextGridX >= this.scene.gridMaxX ||
            nextGridY < 0 ||
            nextGridY >= this.scene.gridMaxY
        ) {
            return
        }

        if (this.scene.map.isWall(nextGridX, nextGridY)) {
            return
        }

        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].gridX = this.segments[i - 1].gridX
            this.segments[i].gridY = this.segments[i - 1].gridY
            this.segments[i].gameObject.x =
                this.segments[i].gridX * this.scene.gridSize
            this.segments[i].gameObject.y =
                this.segments[i].gridY * this.scene.gridSize
        }

        this.segments[0].gridX = nextGridX
        this.segments[0].gridY = nextGridY
        this.segments[0].gameObject.x = nextGridX * this.scene.gridSize
        this.segments[0].gameObject.y = nextGridY * this.scene.gridSize
    }
}
