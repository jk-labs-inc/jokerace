import Head from 'next/head'
import { Provider, createStore } from "@components/_pages/WizardFormCreateContest/store"
import WizardFormCreateContest from '@components/_pages/WizardFormCreateContest'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create a new contest - jokedao</title>
        <meta name="description" content="Create your contest on jokedao, the open-source collaborative decision-making platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jokedao.io/" />
        <meta property="og:title" content="Create your contest on jokedao 🃏" />
        <meta property="og:description" content="Create your contest on jokedao, the open-source collaborative decision-making platform." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://jokedao.io/card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokedao_" />
        <meta name="twitter:description" content="Create your contest on jokedao, the open-source collaborative decision-making platform." />
        <meta name="twitter:image" content="https://jokedao.io/card.png" />
      </Head>

     <div className="container mx-auto pt-5">
        <h1 className='sr-only'>Create a new contest</h1>
        <Provider createStore={createStore}> 
          <WizardFormCreateContest />
        </Provider>
     </div>
    </>
  )
}

export default Page
