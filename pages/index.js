import Head from 'next/head'
import MapEditor from '../components/MapEditor'

export default function Home() {
  return (
    <>
      <Head>
        <title>NodeScape - Interactive Graph Editor</title>
        <meta name="description" content="Interactive graph editor built with React Flow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            padding: '1rem',
            borderBottom: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.5rem',
              color: 'var(--theme-text)',
              transition: 'color 0.3s ease',
            }}
          >
            NodeScape
          </h1>
          <p
            style={{
              margin: '0.5rem 0 0 0',
              color: 'var(--theme-text-secondary)',
              transition: 'color 0.3s ease',
            }}
          >
            Interactive Graph Editor
          </p>
        </header>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MapEditor />
        </div>
      </main>
    </>
  )
}
