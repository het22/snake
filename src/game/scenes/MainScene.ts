import EventBus from '@/game/EventBus'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload() {}

    create() {
        EventBus.emit('current-scene-ready', this)
    }
}
