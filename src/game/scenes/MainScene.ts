import { Scene } from 'phaser'
import EventBus from '@/game/EventBus'
import Snake from '@/game/objects/Snake'
import Food from '@/game/objects/Food'
import World from '@/game/objects/World'

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

    get foods(): Food[] {
        return this.data.get('foods')
    }

    init() {
        const world = new World(this)
        this.data.set('world', world)
        this.add.existing(world)

        const snake = new Snake(this)
        this.data.set('snake', snake)
    }

    preload() {
        this.world.preload()
    }

    create() {
        this.world.setMap('start')
        this.snake.create(this.world.map, 10, 10)

        EventBus.emit('current-scene-ready', this)
    }

    update() {
        this.snake.update()
    }
}
