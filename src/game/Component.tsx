import { useLayoutEffect, useRef } from 'react'
import MainScene from '@/game/scenes/MainScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game-container',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000',
    scene: [MainScene],
}

export default function GameComponent() {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)

    useLayoutEffect(() => {
        if (!containerRef.current) {
            return
        }

        const game = new Phaser.Game({
            ...config,
            parent: containerRef.current,
        })
        gameRef.current = game

        return () => {
            game.destroy(true)
            gameRef.current = null
        }
    }, [])

    return <div id="game-container" ref={containerRef} />
}
