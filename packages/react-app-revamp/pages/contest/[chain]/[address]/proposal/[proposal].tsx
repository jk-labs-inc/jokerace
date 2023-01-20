import shallow from 'zustand/shallow'
import { chains } from '@config/wagmi'
import { useStore as useStoreContest } from '@hooks/useContest/store'
import { useStore as useStoreCastVotes } from '@hooks/useCastVotes/store'
import { Provider as ProviderProposalVotes, createStore as createStoreProposalVotes } from '@hooks/useProposalVotes/store'
import { getLayout } from '@layouts/LayoutViewContest'
import ProposalContent from '@components/_pages/ProposalContent'
import ListProposalVotes from '@components/_pages/ListProposalVotes'
import { CONTEST_STATUS } from '@helpers/contestStatus'
import type { NextPage } from 'next'
import Button from '@components/Button'
import isProposalDeleted from '@helpers/isProposalDeleted'
import getContestById from '@services/jokedao/supabase/getContestById'

interface PageProps {
  address: string
  chain: string
  proposal: string
  data: {
    title: string
  }
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { data, address, chain, proposal } = props
  const { checkIfUserPassedSnapshotLoading, didUserPassSnapshotAndCanVote, currentUserAvailableVotesAmount, listProposalsData, contestName, contestStatus } = useStoreContest(state =>  ({ 
    //@ts-ignore
    contestStatus: state.contestStatus,
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    listProposalsData: state.listProposalsData,
    //@ts-ignore
    votesOpen: state.votesOpen,
    //@ts-ignore
    votesClose: state.votesClose,
    //@ts-ignore
    didUserPassSnapshotAndCanVote: state.didUserPassSnapshotAndCanVote,
    //@ts-ignore
    currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
    //@ts-ignore
    checkIfUserPassedSnapshotLoading: state.checkIfUserPassedSnapshotLoading,
   }), shallow);

   const { setPickedProposal, setIsModalOpen } = useStoreCastVotes(
    state => ({
      //@ts-ignore
      setPickedProposal: state.setPickedProposal,
      //@ts-ignore
      setIsModalOpen: state.setIsModalOpen,
    }),
    shallow,
  );

  function onClickProposalVote() {
    setPickedProposal(proposal);
    setIsModalOpen(true);
  }

  return (
    <>
    <h1 className='sr-only'>Proposal {proposal} - Contest {contestName ? contestName : address} </h1>
    {listProposalsData[proposal] && <div className='mt-6 animate-appear'>
        <ProposalContent 
          author={listProposalsData[proposal]?.authorEthereumAddress}
          content={listProposalsData[proposal]?.content}
        />
        {contestStatus === CONTEST_STATUS.VOTING_OPEN && proposal && proposal !== null && !isProposalDeleted(listProposalsData[proposal]?.content) && <div className='flex flex-col items-center justify-center mt-10'>

        <Button 
          isLoading={checkIfUserPassedSnapshotLoading}
          intent={(currentUserAvailableVotesAmount === 0 || checkIfUserPassedSnapshotLoading || !didUserPassSnapshotAndCanVote) ? 'primary-outline' : 'primary'}
          disabled={!didUserPassSnapshotAndCanVote || checkIfUserPassedSnapshotLoading || currentUserAvailableVotesAmount === 0} 
          onClick={onClickProposalVote}>
            {!checkIfUserPassedSnapshotLoading ? 'Cast your votes for this proposal' : 'Checking snapshot...'}
        </Button>
        <span className='text-2xs mt-1 text-neutral-11'>Available: {currentUserAvailableVotesAmount}</span>
        {<p className='text-2xs mt-1 text-neutral-11'>{checkIfUserPassedSnapshotLoading ? 'Checking snapshot...': !didUserPassSnapshotAndCanVote ? 'Your wallet didn\'t qualify to vote.' : 'Your wallet qualified to vote!'}</p>}
        </div>}
        {[CONTEST_STATUS.VOTING_OPEN, CONTEST_STATUS.COMPLETED].includes(contestStatus)  &&  <ProviderProposalVotes createStore={createStoreProposalVotes}>
          <div className='mt-8 text-sm'>
            {/* @ts-ignore */}
            <ListProposalVotes id={proposal} />
          </div>
        </ProviderProposalVotes>
      }
    
    </div>}
  </>
)}

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export async function getServerSideProps({ params }: any) {
  const { chain, address, proposal } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    const { data } = await getContestById( {
      contestId: address,
      chainName: chain
    })
    return {
      props: {
        proposal,
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