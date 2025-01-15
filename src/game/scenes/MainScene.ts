import { Scene } from 'phaser'
import EventBus from '@/game/EventBus'
import Snake from '@/game/objects/Snake'
import TileMap from '@/game/objects/TileMap'

export default class MainScene extends Scene {
    constructor() {
        super('Game')
    }

    get snake(): Snake {
        return this.data.get('snake')
    }

    get currentMap(): TileMap {
        return this.data.get('currentMap')
    }

    preload() {
        this.load.json('startMap', '/assets/maps/start.json')
    }

    create() {
        const map = TileMap.create(this, this.cache.json.get('startMap'))
        map.draw()
        this.data.set('currentMap', map)

        const snake = new Snake(this)
        snake.draw(10, 10)
        this.data.set('snake', snake)

        EventBus.emit('current-scene-ready', this)
    }

    update() {
        this.snake.update()
    }
}
