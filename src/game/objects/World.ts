import TileMap from '@/game/objects/TileMap'
import MainScene from '../scenes/MainScene'

type MapName = 'start' | 'cave'

export default class World {
    scene: MainScene
    maps: Map<MapName, TileMap>
    currentMap: TileMap

    constructor(scene: MainScene) {
        this.scene = scene
        this.maps = new Map()
    }

    preload() {
        this.scene.load.json('start', '/assets/maps/start.json')
        this.scene.load.json('cave', '/assets/maps/cave.json')
    }

    create() {
        this.setCurrentMap('start')
    }

    setCurrentMap(name: MapName) {
        let map = this.maps.get(name)

        if (!map) {
            map = TileMap.create(this.scene, this.scene.cache.json.get(name))
            this.maps.set(name, map)
        }

        this.currentMap = map

        map.draw()
    }
}
