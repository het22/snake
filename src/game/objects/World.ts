import TileMap from '@/game/objects/TileMap'
import MainScene from '@/game/scenes/MainScene'

export default class World extends Phaser.GameObjects.Container {
    scene: MainScene
    maps: Map<string, TileMap>
    map: TileMap

    constructor(scene: MainScene) {
        super(scene)
        this.scene = scene
        this.maps = new Map()
    }

    preload() {
        this.scene.load.json('portals', '/assets/maps/portals.json')
        this.scene.load.json('start', '/assets/maps/start.json')
        this.scene.load.json('cave', '/assets/maps/cave.json')
    }

    addMap(name: string): TileMap {
        const map = new TileMap(this.scene, name)
        this.maps.set(name, map)
        return map
    }

    setMap(name: string) {
        const prevMap = this.map
        prevMap?.removeFromDisplayList()

        const nextMap = this.maps.get(name) ?? this.addMap(name)
        nextMap.addToDisplayList()
        this.map = nextMap
    }
}
