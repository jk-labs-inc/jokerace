import Head from 'next/head'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Contest  - JokeDAO</title>
        <meta name="description" content="@TODO: change this" />
      </Head>

     <div className="container mx-auto pt-5 ">
        <h1 className='sr-only'>Contest {id} </h1>

        <p>Contest data</p>
        
     </div>
    </>
  )
}

export default Page
