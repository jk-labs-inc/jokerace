import shallow from 'zustand/shallow'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { getLayout } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore } from '@hooks/useContest/store'
import ButtonDownloadContestDataAsCSV from '@components/_pages/ButtonDownloadContestDataAsCSV'
import { CONTEST_STATUS } from '@helpers/contestStatus'
interface PageProps {
  address: string,
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address } = props
  const { isSuccess, isLoading, contestName, contestStatus } = useStore(state =>  ({ 
    //@ts-ignore
    isLoading: state.isLoading,
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    isSuccess: state.isSuccess,
    //@ts-ignore
    contestStatus: state.contestStatus,
   }), shallow);
  return (
    <>
      <Head>
        <title>Contest {contestName ? contestName : ""} rules - JokeDAO</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
    <h1 className='sr-only'>Rules of contest {contestName ? contestName : address} </h1>
    {!isLoading  && isSuccess && <>

    {contestStatus === CONTEST_STATUS.COMPLETED ? <div className='animate-appear mt-4'>
      <p>Let&apos;s create a spreadsheet of full data from your contest: <br/>
            proposals, addresses of submitters, voters, number of votes, etc.
        </p>
      <p className="my-3">
        You can use this to allocate rewards, track contributions, or find correlations among voters.
      </p>
      <div className='mb-6 text-neutral-12'>
        <p>Please note:</p>
        <ul className='mt-2 space-y-3'>
          <li>The first time a spreadsheet is exported can take a few minutes, so <span className='font-bold'>please be patient and do not reload the page.</span></li>
          <li>Includes data up to first 500 proposals and first 500 voters per proposal — <span className='font-bold'>please reach out if you need more data</span>.</li>
        </ul>
      </div>
      <ButtonDownloadContestDataAsCSV />
    </div> : <div className='mt-4 p-3 rounded-md border-solid border mb-5 text-sm font-bold bg-primary-1 text-primary-10 border-primary-4'>
        <p>
          Contest data will be available once the contest ends.
        </p>
    </div> }
    </>
    }
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
//@ts-ignore
Page.getLayout = getLayout

export default Page
