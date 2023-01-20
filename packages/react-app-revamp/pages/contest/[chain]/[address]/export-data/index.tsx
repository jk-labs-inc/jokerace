import shallow from 'zustand/shallow'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { getLayout } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore } from '@hooks/useContest/store'
import getContestById from '@services/jokedao/supabase/getContestById'

interface PageProps {
  address: string
  chain: string
  data: {
    title: string
  }
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address, chain, data } = props
  const { isSuccess, isLoading, contestName } = useStore(state =>  ({ 
    //@ts-ignore
    isLoading: state.isLoading,
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    isSuccess: state.isSuccess,
   }), shallow);
  return (
    <>
      <Head>
        <title>Export data / {data?.title} - jokedao</title>
        <meta name="description" content={`Export the proposals data of ${data?.title} on jokedao`} />
        <meta property="og:title" content={`Export data / ${data?.title} - jokedao 🃏`} />
        <meta property='og:url'  content={`https://jokedao.io/contest/${chain}/${address}`} />
        <meta property="og:description" content={`Export the proposals data of"${data?.title}" on jokedao`} />
        <meta property="twitter:description" content={`Export the proposals data of"${data?.title}" on jokedao`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://jokedao.io/card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokedao_" />
        <meta name="twitter:image" content="https://jokedao.io/card.png" />
      </Head>
      <h1 className='sr-only'>Rules of contest {contestName ? contestName : address} </h1>
      {!isLoading  && isSuccess && <div className='animate-appear mt-4'>
        <p>
          This page is currently under development.
        </p>
        {/* <p>Let&apos;s create a spreadsheet of full data from your contest: <br/>
            proposals, addresses of submitters, voters, number of votes, etc.
        </p>
        <p className="mt-3 mb-6">
            You can use this to allocate rewards, track contributions, or find correlations among voters.
        </p>
        <ButtonDownloadContestDataAsCSV /> */}
    </div>}
  </>
)}

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params
  if (!REGEX_ETHEREUM_ADDRESS.test(address) || chains.filter(c => c.name.toLowerCase().replace(' ', '') === chain).length === 0 ) {
    return { notFound: true }
  }

  try {
    const { data } = await getContestById( {
      contestId: address,
      chainName: chain
    })
    return {
      props: {
        chain,
        address,
        data
      }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
