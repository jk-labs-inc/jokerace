import Head from 'next/head'
import { getLayout } from '@layouts/LayoutContests'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Upcoming contests - JokeDAO</title>
        <meta name="description" content="Upcoming contests on JokeDAO." />
      </Head>

     <div className="container mx-auto pt-10">
      <h1 className='sr-only'>Upcoming contests</h1>
     </div>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
