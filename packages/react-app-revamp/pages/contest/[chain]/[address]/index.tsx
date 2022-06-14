import shallow from 'zustand/shallow'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { getLayout } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore } from '@hooks/useContest'
import ListProposals from '@components/_pages/ListProposals'

interface PageProps {
  address: string,
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address } = props
  const { isLoading, contestName } = useStore(state =>  ({ 
    //@ts-ignore
    isLoading: state.isLoading, 
    //@ts-ignore
    contestName: state.contestName, 
   }), shallow);
  return (
    <>
      <Head>
        <title>Contest {contestName ?? address } - JokeDAO</title>
        <meta name="description" content="@TODO: change this" />
      </Head>
    <h1 className='sr-only'>Contest {contestName ?? address} </h1>
    {!isLoading && <>
      <ListProposals />
    </>}
  </>
)}

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params
  if (!REGEX_ETHEREUM_ADDRESS.test(address) || chains.filter(c => c.name.toLowerCase() === chain).length === 0 ) {
    return { notFound: true }
  }

  try {
    return {
      props: {
        address,
      }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}
Page.getLayout = getLayout

export default Page
