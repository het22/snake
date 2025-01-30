import { Scene } from 'phaser'
import EventBus from '@/game/EventBus'
import Snake from '@/game/objects/Snake'
import Food from '@/game/objects/Food'
import World from '@/game/objects/World'
import { MapName } from '@/constants'

export default class MainScene extends Scene {
    constructor() {
        super('Game')
    }

    get world(): World {
        return this.data.get('world')
    }

    get snake(): Snake {
        return this.data.get('snake')
    }

    init() {
        this.data.set('world', new World(this))
        this.data.set('snake', new Snake(this))
    }

    preload() {
        this.world.preload()
    }

    create() {
        this.world.create()
        this.world.map = MapName.Start

        EventBus.emit('current-scene-ready', this)
    }

    update() {}
}
