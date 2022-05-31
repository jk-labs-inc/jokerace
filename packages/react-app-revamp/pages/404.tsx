import Head from 'next/head'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page not found - JokeDAO</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <div className="container m-auto sm:text-center">
      <h1 className='text-4xl font-black mb-3 text-primary-10'>Page not found</h1>
      {/*  eslint-disable-next-line react/no-unescaped-entities */}
      <p className='text-neutral-12'>Sorry ! The page you are looking for was deleted or it doesn't exist.</p>

      </div>
    </>
  )
}

export default Page
