import Head from 'next/head'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>JokeDAO - open-source, collaborative decision-making platform</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <div className='m-auto'>
        <img srcSet="/logo@desktop.png 768w" sizes="(min-width: 768px) 768px" src="/logo@mobile.png" alt="" />
      </div>
    </>
  )
}

export default Page
