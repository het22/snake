import TileMap from '@/game/objects/TileMap'
import MainScene from '../scenes/MainScene'

export default class World {
    scene: MainScene
    maps: Map<string, TileMap>
    currentMap: TileMap

    constructor(scene: MainScene) {
        this.scene = scene
        this.maps = new Map()
    }

    preload() {
        this.scene.load.json('portals', '/assets/maps/portals.json')
        this.scene.load.json('start', '/assets/maps/start.json')
        this.scene.load.json('cave', '/assets/maps/cave.json')
    }

    create() {
        this.setCurrentMap('start')
    }

    setCurrentMap(name: string) {
        let map = this.maps.get(name)

        if (!map) {
            map = TileMap.create(this.scene, name)
            this.maps.set(name, map)
        }

        this.currentMap = map

        map.draw()
    }
}
