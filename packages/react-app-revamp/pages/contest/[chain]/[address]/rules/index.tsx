import shallow from 'zustand/shallow'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { getLayout } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore } from '@hooks/useContest/store'
import Steps from '@layouts/LayoutViewContest/Timeline/Steps'
import { format } from 'date-fns'
import { CONTEST_STATUS } from '@helpers/contestStatus'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
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
  const { address, data, chain } = props
  const { asPath } = useRouter()
  const accountData = useAccount()
  const { contestState, checkIfUserPassedSnapshotLoading, snapshotTaken, didUserPassSnapshotAndCanVote, usersQualifyToVoteIfTheyHoldTokenAtTime, votingToken, contestMaxNumberSubmissionsPerUser,  amountOfTokensRequiredToSubmitEntry, contestMaxProposalCount, isSuccess, isLoading, contestName, submitProposalToken } = useStore(state =>  ({ 
    //@ts-ignore
    votingToken: state.votingToken,
    //@ts-ignore
    isLoading: state.isLoading,
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    isSuccess: state.isSuccess,
    //@ts-ignore
    amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
    //@ts-ignore
    contestMaxProposalCount: state.contestMaxProposalCount,
    //@ts-ignore
    contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
    //@ts-ignore
    usersQualifyToVoteIfTheyHoldTokenAtTime: state.usersQualifyToVoteIfTheyHoldTokenAtTime,
    //@ts-ignore
    didUserPassSnapshotAndCanVote: state.didUserPassSnapshotAndCanVote,
    //@ts-ignore
    snapshotTaken: state.snapshotTaken,
    //@ts-ignore
    checkIfUserPassedSnapshotLoading: state.checkIfUserPassedSnapshotLoading,
    //@ts-ignore
    contestState: state.contestState,
    //@ts-ignore
    submitProposalToken: state.submitProposalToken,
   }), shallow);

  return (
    <>
      <Head>
        <title>Rules / {data?.title} - jokedao</title>
        <meta name="description" content={`Read the rules of ${data?.title} on jokedao`} />
        <meta property="og:title" content={`Rules / ${data?.title} - jokedao 🃏`} />
        <meta property='og:url'  content={`https://jokedao.io/contest/${chain}/${address}`} />
        <meta property="og:description" content={`Read the rules of "${data?.title}" on jokedao`} />
        <meta property="twitter:description" content={`Read the rules of "${data?.title}" on jokedao`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://jokedao.io/card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokedao_" />
        <meta name="twitter:image" content="https://jokedao.io/card.png" />
      </Head>
      <h1 className='sr-only'>Rules of contest {contestName ? contestName : address} </h1>
      {!isLoading  && isSuccess && <div className='animate-appear space-y-8'>
      {contestState !== CONTEST_STATUS.SNAPSHOT_ONGOING && <section className='animate-appear'>
       <p className={`p-3 mt-4 rounded-md border-solid border mb-5 text-sm font-bold
       ${(!snapshotTaken || checkIfUserPassedSnapshotLoading || !accountData?.address) ? ' border-neutral-4' : didUserPassSnapshotAndCanVote ? 'bg-positive-1 text-positive-10 border-positive-4' : ' bg-primary-1 text-primary-10 border-primary-4'}`
       }>
         {!accountData?.address ? "Connect your wallet to see if you qualified to vote." : checkIfUserPassedSnapshotLoading ? 'Checking snapshot...' : !snapshotTaken ? 'Snapshot hasn\'t been taken yet.': didUserPassSnapshotAndCanVote ? 'Congrats ! Your wallet qualified to vote.' : 'Too bad, your wallet didn\'t qualify to vote.'}
       </p>
     </section>}
     <section>
       <h2 className='uppercase font-bold mb-2'>Rules</h2>
       <ul className='list-disc pis-4 leading-loose'>
          <li>
           {amountOfTokensRequiredToSubmitEntry === 0 ?  <span className='font-bold'>Anyone can submit</span> : <>
           <span className='font-bold'>{new Intl.NumberFormat().format(amountOfTokensRequiredToSubmitEntry)}{" "}<span className='normal-case'>${submitProposalToken.symbol}</span>{" "}required</span>{' '}to submit a proposal</>}</li>
         <li>Qualified wallets can submit up to <span className='font-bold'>
          {new Intl.NumberFormat().format(contestMaxNumberSubmissionsPerUser)} proposal{contestMaxNumberSubmissionsPerUser > 1 && "s"}
         </span>
           
           </li>
         <li>Token holders qualify to vote if they have token by <span className="font-bold">{format(usersQualifyToVoteIfTheyHoldTokenAtTime, "PPP p")}</span></li>
         <li>
           <span className='font-bold'>Contest accepts up to {new Intl.NumberFormat().format(contestMaxProposalCount)} proposals</span>{" "}total
          </li>
       </ul>
     </section>
     <section>
      <h2 className='uppercase font-bold mb-2'>Submission token</h2>
      {submitProposalToken?.address !== votingToken?.address ? <ul className='list-disc pis-4 leading-loose'>
        <li title={`$${submitProposalToken.symbol}`} className='list-item'><span className='block whitespace-nowrap overflow-hidden text-ellipsis'>Symbol: <span className='font-bold normal-case'>${submitProposalToken.symbol}</span></span></li>
        <li title={`${new Intl.NumberFormat().format(submitProposalToken.totalSupply.formatted)}`} className='list-item'><span className='block whitespace-nowrap overflow-hidden text-ellipsis'>Total supply: <span className='font-bold'>{new Intl.NumberFormat().format(submitProposalToken.totalSupply.formatted)}</span></span></li>
        <li title={submitProposalToken.address} className='list-item'><span className='block whitespace-nowrap overflow-hidden text-ellipsis'>Contract: <a className='link' target="_blank" rel="noreferrer nofollow" href={`${chains.filter(chain => chain.name.replace(' ', '').toLowerCase() === asPath.split("/")[2])[0].blockExplorers?.default.url}/address/${submitProposalToken.address}`.replace('//address', '/address')}>{submitProposalToken.address}</a></span></li>
      </ul> : <p className='italic text-neutral-11'>
        No submission token for this contest
      </p>}
     </section>
     <section>
      <h2 className='uppercase font-bold mb-2'>Voting token</h2>
      <ul className='list-disc pis-4 leading-loose'>
        <li title={`$${votingToken.symbol}`} className='list-item'><span className='block whitespace-nowrap overflow-hidden text-ellipsis'>Symbol: <span className='font-bold normal-case'>${votingToken.symbol}</span></span></li>
        <li title={`${new Intl.NumberFormat().format(votingToken.totalSupply.formatted)}`} className='list-item'><span className='block whitespace-nowrap overflow-hidden text-ellipsis'>Total supply: <span className='font-bold'>{new Intl.NumberFormat().format(votingToken.totalSupply.formatted)}</span></span></li>
        <li title={votingToken.address} className='list-item'><span className='block whitespace-nowrap overflow-hidden text-ellipsis'>Contract: <a className='link' target="_blank" rel="noreferrer nofollow" href={`${chains.filter(chain => chain.name.replace(' ', '').toLowerCase() === asPath.split("/")[2])[0].blockExplorers?.default.url}/address/${votingToken.address}`.replace('//address', '/address')}>{votingToken.address}</a></span></li>
      </ul>
     </section>
     <section>
       <h2 className='uppercase leading-relaxed font-bold mb-2'>Timeline</h2>
       <Steps />
     </section>
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
