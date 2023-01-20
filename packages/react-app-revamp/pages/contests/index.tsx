import Head from 'next/head'
import { getLayout } from '@layouts/LayoutContests'
import FormSearchContest from '@components/_pages/FormSearchContest'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contests - jokedao</title>
        <meta name="description" content="Check upcoming, live and past contests on jokedao, the open-source collaborative decision-making platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jokedao.io/" />
        <meta property="og:title" content="Search contests on jokedao 🃏" />
        <meta property="og:description" content="Check upcoming, live and past contests on jokedao, the open-source collaborative decision-making platform." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://jokedao.io/card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokedao_" />
        <meta name="twitter:description" content="Check upcoming, live and past contests on jokedao, the open-source collaborative decision-making platform." />
        <meta name="twitter:image" content="https://jokedao.io/card.png" />
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
