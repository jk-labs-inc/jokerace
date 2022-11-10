import shallow from 'zustand/shallow'
import Head from 'next/head'
import { chains } from '@config/wagmi'
import { getLayout as getLayoutContest } from '@layouts/LayoutViewContest'
import type { NextPage } from 'next'
import { useStore as useStoreContest } from '@hooks/useContest/store'
import { 
  useStore as useStoreRewardsModule,
  Provider as ProviderRewardsModule,
  createStore as createStoreRewardsModule 
} from '@hooks/useRewardsModule/store'
import { 
  useStore as useStoreFundRewardsModule,
  Provider as ProviderFundRewardsModule,
  createStore as createStoreFundRewardsModule 
} from '@hooks/useFundRewardsModule/store'
import { useRewardsModule } from '@hooks/useRewardsModule'
import Button from '@components/Button'
import {  ExclamationCircleIcon } from '@heroicons/react/outline'
import Loader from '@components/Loader'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import DialogFundRewardsModule from "@components/_pages/DialogFundRewardsModule"
import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule"
import ButtonWithdrawNativeReward from '@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward'
import RewardsWinner from '@components/_pages/RewardsWinner'
interface PageProps {
  address: string,
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address } = props
  const { isSuccess, isLoading, contestName, supportsRewardsModule, } = useStoreContest(state =>  ({ 
    //@ts-ignore
    isLoading: state.isLoading,
    //@ts-ignore
    contestName: state.contestName, 
    //@ts-ignore
    isSuccess: state.isSuccess,
    //@ts-ignore
    supportsRewardsModule: state.supportsRewardsModule,
   }), shallow);

  const storeRewardsModule = useStoreRewardsModule();
  const storeFundRewardsModule = useStoreFundRewardsModule()
  const { getContestRewardsModule, queryBalanceRewardsModule } = useRewardsModule()
  const [isWithdrawnFundsDialogOpen, setIsWithdrawFundsDialogOpen] = useState(false)
  const currentAccount = useAccount()
  useEffect(() => {
    if(supportsRewardsModule) getContestRewardsModule()
  }, [supportsRewardsModule])

  return (
    <>
      <Head>
        <title>Contest {contestName ? contestName : ""} rewards - JokeDAO</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
    <h1 className='sr-only'>Rewards of contest {contestName ? contestName : address} </h1>
    {!isLoading  && isSuccess && <>
      {!supportsRewardsModule ? <>
        <p className="p-3 mt-4 rounded-md bg-primary-1 text-primary-10 border-primary-4 mb-5 text-sm font-bold">
          This contest doesn&apos;t support rewards.
        </p>
      </> : <>
        {storeRewardsModule.isLoadingModule && <>
          <Loader scale="component">
            Loading rewards module...
          </Loader>
        </>}
        {storeRewardsModule.isLoadingModuleSuccess && <>
          <div className='animate-appear flex flex-col space-y-2 xs:flex-row xs:space-y-0 xs:space-i-3'>

          
          <p className="p-3 rounded-md overflow-hidden text-ellipsis border border-solid border-neutral-4 text-sm">
            Rewards module contract address: <a className='link' href={`${storeRewardsModule?.rewardsModule?.blockExplorers?.url}/address/${storeRewardsModule.rewardsModule?.contractAddress}`} target="_blank" rel="noopener noreferrer"
          >
            {storeRewardsModule.rewardsModule?.contractAddress}
          </a>
        </p>
        {storeRewardsModule.rewardsModule?.creator === currentAccount?.address && <div className='space-y-2 shrink-0 xs:my-auto'>
            <Button className="w-full" onClick={() => storeFundRewardsModule.setIsModalOpen(true)} scale="sm" intent="primary-outline">
            Send funds 
          </Button>
          <Button className="w-full"  scale="sm" intent="neutral-outline" onClick={() => setIsWithdrawFundsDialogOpen(true)}>
              Withdraw funds
          </Button>
        </div>}
    
        </div>
    <div className='flex flex-col animate-appear pt-4 space-y-8'>
      
      <ul className='space-y-6'>
          {storeRewardsModule.rewardsModule.payees.map(payee =>
          <li key={`rank-${`${payee}`}`}>
            <RewardsWinner 
              payee={payee}
              erc20Tokens={storeRewardsModule.rewardsModule.balance}
              contractRewardsModuleAddress={storeRewardsModule.rewardsModule.contractAddress} 
              abiRewardsModule={storeRewardsModule.rewardsModule.abi}
            />
          </li>  
          )}
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
<DialogFundRewardsModule queryBalanceRewardsModule={queryBalanceRewardsModule} setIsOpen={storeFundRewardsModule.setIsModalOpen} isOpen={storeFundRewardsModule.isModalOpen} />  
<DialogWithdrawFundsFromRewardsModule isOpen={isWithdrawnFundsDialogOpen} setIsOpen={setIsWithdrawFundsDialogOpen}>
    <ButtonWithdrawNativeReward contractRewardsModuleAddress={storeRewardsModule.rewardsModule.contractAddress} abiRewardsModule={storeRewardsModule.rewardsModule.abi} />
</DialogWithdrawFundsFromRewardsModule>
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

export const getLayout = (page: any) => {
  return getLayoutContest(
    <ProviderRewardsModule createStore={createStoreRewardsModule}>
      <ProviderFundRewardsModule createStore={createStoreFundRewardsModule}>
        {page}
      </ProviderFundRewardsModule>
    </ProviderRewardsModule>
  )
}
//@ts-ignore
Page.getLayout = getLayout

export default Page
