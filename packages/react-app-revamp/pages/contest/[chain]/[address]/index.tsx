import shallow from 'zustand/shallow'
import { chains } from '@config/wagmi'
import { getLayout } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore } from '@hooks/useContest/store'
import ListProposals from '@components/_pages/ListProposals'
import getContestById from '@services/jokedao/supabase/getContestById'

interface PageProps {
  address: string
  chain: string
  data: {
    title: string
    cover_image_src_uri: string | null
  }
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address, chain, data } = props
  const { isSuccess, isLoading, isListProposalsLoading, isListProposalsSuccess, contestName } = useStore((state: any) =>  ({ 
    isLoading: state.isLoading,
    isListProposalsLoading: state.isListProposalsLoading, 
    isListProposalsSuccess: state.isListProposalsSuccess,
    contestName: state.contestName, 
    isSuccess: state.isSuccess,
   }), shallow);
  return (
    <>
    <h1 className='sr-only'>Contest {contestName ? contestName : address} </h1>
    {!isLoading && !isListProposalsLoading && isSuccess && isListProposalsSuccess && <div className='animate-appear mt-8'>
      <ListProposals />
    </div>}
  </>
)}

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export async function getServerSideProps({ params }: any) {
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
