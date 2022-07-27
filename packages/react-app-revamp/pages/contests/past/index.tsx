import Head from 'next/head'
import { getLayout } from '@layouts/LayoutContests'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Past contests - JokeDAO</title>
        <meta name="description" content="Past contests on JokeDAO." />
      </Head>

     <div className="container mx-auto pt-10">
      <h1 className='sr-only'>Past contests</h1>
     </div>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
