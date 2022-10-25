import shallow from 'zustand/shallow'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { getLayout } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore } from '@hooks/useContest/store'
import { useRewardsModule } from '@hooks/useRewardsModule'
import Button from '@components/Button'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import Loader from '@components/Loader'

interface PageProps {
  address: string,
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address } = props
  const { isSuccess, isLoading, contestName } = useStore(state =>  ({ 
    //@ts-ignore
    isLoading: state.isLoading,
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    isSuccess: state.isSuccess,
   }), shallow);

  const { supportsRewardsModule, queryContestOfficialRewardsModule, queryRewardsModule } = useRewardsModule()
  return (
    <>
      <Head>
        <title>Contest {contestName ? contestName : ""} rewards - JokeDAO</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
    <h1 className='sr-only'>Rewards of contest {contestName ? contestName : address} </h1>
    {!isLoading  && isSuccess && <>
      {queryContestOfficialRewardsModule.isLoading && <>
        <Loader>
          Loading rewards module...
        </Loader>
      </>}

      {queryContestOfficialRewardsModule.isSuccess && <>
        {supportsRewardsModule ? <> 
          <div className='flex flex-col animate-appear pt-4 space-y-8'>
        <ul className='space-y-6'>
            <li>
                <h2 className='font-bold text-lg mb-1'>1st place</h2>
                <p className='mb-2'>Wins {new Intl.NumberFormat().format(4000)} <span className='uppercase text-positive-10'>$USDC</span></p>
                <Button className="!pis-2 items-center" intent="positive" scale="xs">
                    <CheckCircleIcon className='w-6 mie-1'/>
                    Execute transaction
                </Button>
            </li>

            <li>
                <h2 className='font-bold text-lg mb-1'>2nd place</h2>
                <p className='mb-2'>Wins {new Intl.NumberFormat().format(2000)} <span className='uppercase text-positive-10'>$USDC</span></p>
                <p className='text-sm italic font-bold text-negative-11'>Tied winners, transaction canceled</p>
            </li>

            <li>
                <h2 className='font-bold text-lg mb-1'>3rd place</h2>
                <p className='mb-2'>Wins {new Intl.NumberFormat().format(1000)} <span className='uppercase text-positive-10'>$USDC</span></p>
                <p className='text-sm italic font-bold'>Transaction already executed (<a className="link" target="_blank" rel="nofollow noreferrer" href={`#`} >view on explorer</a>)</p>
            </li>
        </ul>
        <p className='text-sm'>
            Note: <br />
            In case of ties, corresponding transactions are canceled so the contest creator can decide how to pay out manually.
        </p>
        
        <Button intent="ghost-negative" className='!mt-12 mx-auto'>
            <ExclamationCircleIcon className='w-6'/>
            &nbsp;
            <span className='uppercase px-1ex'>Cancel all rewards</span>
            &nbsp;
            <ExclamationCircleIcon className='w-6'/>

        </Button>
    </div>
        
        </> : <>
          <p className="p-3 mt-4 rounded-md border-solid border mb-5 text-sm font-bold">
          This contest doesn&apos;t support rewards.
        </p> 
        </>}
      </>}
    </>}
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
