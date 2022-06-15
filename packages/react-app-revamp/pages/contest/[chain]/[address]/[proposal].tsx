import shallow from 'zustand/shallow'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { useStore } from '@hooks/useContest'
import { Provider, createStore } from '@hooks/useProposalVotes'
import { getLayout } from '@layouts/LayoutViewContest'
import ProposalContent from '@components/_pages/ProposalContent'
import ListProposalVotes from '@components/_pages/ListProposalVotes'
import type { NextPage } from 'next'
import { isAfter } from 'date-fns'

interface PageProps {
  address: string,
  proposal: string
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { query: { proposal, address }} = useRouter()
  const { isLoading, listProposalsData, contestName, votesOpen, votesClose } = useStore(state =>  ({ 
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    isLoading: state.isLoading,
    //@ts-ignore
    listProposalsData: state.listProposalsData,
    //@ts-ignore
    votesOpen: state.votesOpen,
    //@ts-ignore
    votesClose: state.votesClose
   }), shallow);

  return (
    <>
      <Head>
        <title>Proposal {proposal} - Contest {contestName ?? address} - JokeDAO</title>
        <meta name="description" content="@TODO: change this" />
      </Head>
    <h1 className='sr-only'>Proposal {proposal} - Contest {contestName ?? address} </h1>
    {!isLoading && listProposalsData[proposal] && <div className='animate-appear'>
        <ProposalContent 
          author={listProposalsData[proposal]?.author}
          content={listProposalsData[proposal]?.content}
        />
        {isAfter(new Date(), votesOpen) &&  <Provider createStore={createStore}>
          <div className='mt-8 text-sm'>
            <ListProposalVotes id={proposal} />
          </div>
        </Provider>}
    </div>}
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