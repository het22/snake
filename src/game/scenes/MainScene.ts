import { Scene } from 'phaser'
import EventBus from '@/game/EventBus'
import Snake from '@/game/objects/Snake'
import Food from '@/game/objects/Food'
import World from '../objects/World'

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

    preload() {
        this.data.set('world', new World(this))
        this.world.preload()
    }

    create() {
        this.world.create()

        const snake = new Snake(this)
        snake.draw(10, 10)
        this.data.set('snake', snake)

        EventBus.emit('current-scene-ready', this)
    }

    update() {
        this.snake.update()
    }
}
