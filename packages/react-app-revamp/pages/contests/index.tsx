import Head from 'next/head'
import { getLayout } from '@layouts/LayoutContests'
import FormSearchContest from '@components/_pages/FormSearchContest'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contests - JokeDAO</title>
        <meta name="description" content="@TODO: change this" />
      </Head>

     <div className="container mx-auto pt-20">
      <h1 className='text-lg font-bold mb-4 flex flex-col text-center'><span aria-hidden="true" className='text-4xl -rotate-[10deg]'>🃏</span> <span>Search contest</span></h1>
      <FormSearchContest />
     </div>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
