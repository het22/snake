import Head from 'next/head'
import dynamic from 'next/dynamic'

const GameComponent = dynamic(() => import('@/game/Component'), {
    ssr: false,
})

export default function Home() {
    return (
        <>
            <Head>
                <title>snake</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main>
                <GameComponent />
            </main>
        </>
    )
}
