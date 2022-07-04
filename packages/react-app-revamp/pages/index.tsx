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
        <img
            className="mx-auto"
            src="/home@300.jpg"
            sizes="(max-width: 479px) 512px, (max-width: 660px) 876px, (max-width: 1199px) 1000px, (max-width: 1398px) 1200px, (min-width: 1399px) 1400px"
            srcSet="/home@876.jpg 660w, /home@1000.jpg 992w, /home@1200.jpg 1200w, /home@1440.jpg 1399w"
            alt=""
          />
      </div>
    </>
  )
}

export default Page
