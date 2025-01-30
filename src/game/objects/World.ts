import TileMap from '@/game/objects/TileMap'
import MainScene from '@/game/scenes/MainScene'
import { MapName } from '@/constants'
export default class World {
    scene: MainScene
    maps: Map<MapName, TileMap>

    private _map: TileMap | null

    get map(): TileMap | null {
        return this._map
    }

    set map(map: MapName | TileMap) {
        const previousMap = this.map
        previousMap?.destroy()

        if (typeof map === 'string') {
            this._map = this.maps.get(map)!
        } else {
            this._map = map
        }

        this.scene.add.existing(this._map.create())
    }

    constructor(scene: MainScene) {
        this.scene = scene
        this.maps = new Map()
        this._map = null
    }

    preload() {
        this.scene.load.json('portals', '/assets/maps/portals.json')
        this.scene.load.json('start', '/assets/maps/start.json')
        this.scene.load.json('cave', '/assets/maps/cave.json')
    }

    create() {
        for (const name of Object.values(MapName)) {
            this.maps.set(name, new TileMap(this.scene, name))
        }
    }
}
