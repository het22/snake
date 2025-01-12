import MainScene from '@/game/scenes/MainScene'

export default class Map {
    private scene: MainScene
    private mapData: number[][]

    constructor(scene: MainScene, mapData: number[][]) {
        this.scene = scene
        this.mapData = mapData
        this.initMap()
    }

    private initMap(): void {
        const gridSize = this.scene.gridSize
        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                if (this.mapData[y][x] !== 1) continue

                if (y > 0 && this.mapData[y - 1][x] !== 1) {
                    this.scene.add
                        .line(
                            0,
                            0,
                            x * gridSize,
                            y * gridSize,
                            (x + 1) * gridSize,
                            y * gridSize,
                            0xffffff
                        )
                        .setOrigin(0, 0)
                }

                if (
                    y < this.mapData.length - 1 &&
                    this.mapData[y + 1][x] !== 1
                ) {
                    this.scene.add
                        .line(
                            0,
                            0,
                            x * gridSize,
                            (y + 1) * gridSize,
                            (x + 1) * gridSize,
                            (y + 1) * gridSize,
                            0xffffff
                        )
                        .setOrigin(0, 0)
                }

                if (x > 0 && this.mapData[y][x - 1] !== 1) {
                    this.scene.add
                        .line(
                            0,
                            0,
                            x * gridSize,
                            y * gridSize,
                            x * gridSize,
                            (y + 1) * gridSize,
                            0xffffff
                        )
                        .setOrigin(0, 0)
                }

                if (
                    x < this.mapData[y].length - 1 &&
                    this.mapData[y][x + 1] !== 1
                ) {
                    this.scene.add
                        .line(
                            0,
                            0,
                            (x + 1) * gridSize,
                            y * gridSize,
                            (x + 1) * gridSize,
                            (y + 1) * gridSize,
                            0xffffff
                        )
                        .setOrigin(0, 0)
                }
            }
        }
    }

    public isWall(x: number, y: number): boolean {
        return this.mapData[y][x] === 1
    }
}
