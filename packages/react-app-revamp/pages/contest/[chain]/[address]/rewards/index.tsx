import shallow from "zustand/shallow";
import Head from "next/head";
import { Tab } from "@headlessui/react";
import { chains } from "@config/wagmi";
import { getLayout as getLayoutContest } from "@layouts/LayoutViewContest";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import {
  useStore as useStoreRewardsModule,
  Provider as ProviderRewardsModule,
  createStore as createStoreRewardsModule,
} from "@hooks/useRewardsModule/store";
import {
  useStore as useStoreFundRewardsModule,
  Provider as ProviderFundRewardsModule,
  createStore as createStoreFundRewardsModule,
} from "@hooks/useFundRewardsModule/store";
import { useRewardsModule } from "@hooks/useRewardsModule";
import Button from "@components/Button";
import Loader from "@components/Loader";
import { Fragment, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import DialogFundRewardsModule from "@components/_pages/DialogFundRewardsModule";
import DialogCheckBalanceRewardsModule from "@components/_pages/DialogCheckBalanceRewardsModule";
import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule";
import ButtonWithdrawNativeReward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward";
import ButtonWithdrawERC20Reward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawERC20Reward";
import RewardsWinner from "@components/_pages/RewardsWinner";
import { useRouter } from "next/router";
import { isBefore } from "date-fns";
interface PageProps {
  address: string;
}
//@ts-ignore
const Page = (props: PageProps) => {
  const { address } = props;
  const { votesClose, isSuccess, isLoading, contestName, supportsRewardsModule } = useStoreContest(
    (state: any) => ({
      votesClose: state.votesClose,
      isLoading: state.isLoading,
      contestName: state.contestName,
      isSuccess: state.isSuccess,
      supportsRewardsModule: state.supportsRewardsModule,
    }),
    shallow,
  );

  const storeRewardsModule = useStoreRewardsModule();
  const storeFundRewardsModule = useStoreFundRewardsModule();
  const { getContestRewardsModule } = useRewardsModule();
  const [isWithdrawnFundsDialogOpen, setIsWithdrawFundsDialogOpen] = useState(false);
  const [isDialogCheckBalanceOpen, setIsDialogCheckBalanceOpen] = useState(false);
  const currentAccount = useAccount();
  const { chain } = useNetwork();
  const { asPath } = useRouter();

  useEffect(() => {
    if (supportsRewardsModule) getContestRewardsModule();
  }, [supportsRewardsModule]);

  return (
    <>
      <Head>
        <title>Contest {contestName ? contestName : ""} rewards - JokeDAO</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <h1 className="sr-only">Rewards of contest {contestName ? contestName : address} </h1>
      {!isLoading && isSuccess && (
        <>
          {!supportsRewardsModule ? (
            <>
              <p className="p-3 mt-4 rounded-md bg-primary-1 text-primary-10 border-primary-4 mb-5 text-sm font-bold">
                This contest doesn&apos;t support rewards.
              </p>
            </>
          ) : (
            <>
              {/* @ts-ignore */}
              {storeRewardsModule.isLoadingModule && (
                <>
                  <Loader scale="component">Loading rewards module...</Loader>
                </>
              )}
              {/* @ts-ignore */}
              {storeRewardsModule.isLoadingModuleSuccess && (
                <>
               {isBefore(new Date(), new Date(votesClose)) && <p className="animate-appear p-3 mt-4 rounded-md bg-primary-1 text-primary-10 border-primary-4 mb-5 text-sm font-bold">
                 Contest must end to send rewards.
                </p>}
                  <div className="animate-appear flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-i-8">
                    <p className="p-3 rounded-md overflow-hidden text-ellipsis border border-solid border-neutral-4 text-sm">
                      {/* @ts-ignore */}
                      Rewards module contract address:{" "}
                      <a
                        className="link"
                        //@ts-ignore
                        href={`${storeRewardsModule?.rewardsModule?.blockExplorers?.url}/address/${storeRewardsModule.rewardsModule?.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* @ts-ignore */}
                        {storeRewardsModule.rewardsModule?.contractAddress}
                      </a>
                    </p>
                    <div className="space-y-2 2xs:space-y-0 md:space-y-2 flex flex-col 2xs:justify-evenly 2xs:items-center 2xs:flex-row md:justify-start md:flex-col md:w-max-content shrink-0 md:my-auto">
                      {/* @ts-ignore */}
                      {storeRewardsModule.rewardsModule?.creator === currentAccount?.address && (
                        <>
                          <Button
                            className="w-full 2xs:w-fit-content md:w-full"
                            //@ts-ignore
                            onClick={() => storeFundRewardsModule.setIsModalOpen(true)}
                            scale="sm"
                            intent="primary-outline"
                          >
                            💸 Add funds
                          </Button>
                          <Button
                            className="w-full 2xs:w-fit-content md:w-full"
                            scale="sm"
                            intent="neutral-outline"
                            onClick={() => setIsWithdrawFundsDialogOpen(true)}
                          >
                            🤑 Withdraw funds
                          </Button>
                        </>
                      )}
                      <Button
                        className="w-full 2xs:w-fit-content md:w-full"
                        //@ts-ignore
                        onClick={() => setIsDialogCheckBalanceOpen(true)}
                        scale="sm"
                        intent="ghost-neutral"
                      >
                        💰 Check balance
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col animate-appear pt-4 space-y-8">
                    <ul className="space-y-6">
                      {/* @ts-ignore */}
                      {storeRewardsModule?.rewardsModule?.payees?.map(payee => (
                        <li className="animate-appear" key={`rank-${`${payee}`}`}>
                          <RewardsWinner
                            chainId={
                              chains.filter(
                                chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2],
                              )?.[0]?.id
                            }
                            payee={payee}
                            //@ts-ignore
                            erc20Tokens={storeRewardsModule.rewardsModule.balance}
                            //@ts-ignore
                            contractRewardsModuleAddress={storeRewardsModule.rewardsModule.contractAddress}
                            //@ts-ignore
                            abiRewardsModule={storeRewardsModule.rewardsModule.abi}
                            //@ts-ignore
                            totalShares={storeRewardsModule.rewardsModule.totalShares}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <DialogCheckBalanceRewardsModule
                    isOpen={isDialogCheckBalanceOpen}
                    //@ts-ignore
                    setIsOpen={setIsDialogCheckBalanceOpen}
                  />
                  <DialogFundRewardsModule
                    //@ts-ignore
                    setIsOpen={storeFundRewardsModule.setIsModalOpen}
                    //@ts-ignore
                    isOpen={storeFundRewardsModule.isModalOpen}
                  />
                  <DialogWithdrawFundsFromRewardsModule
                    isOpen={isWithdrawnFundsDialogOpen}
                    //@ts-ignore
                    setIsOpen={setIsWithdrawFundsDialogOpen}
                  >
                    <Tab.Group>
                      <Tab.List className="animate-appear overflow-hidden text-xs font-medium mb-6 divide-i divide-neutral-4 flex rounded-full border-solid border border-neutral-4">
                        {["ERC20", chain?.nativeCurrency?.symbol].map(tab => (
                          <Tab key={tab} as={Fragment}>
                            {({ selected }) => (
                              /* Use the `selected` state to conditionally style the selected tab. */
                              <button
                                className={`normal-case p-1 w-1/2 text-center
                ${selected ? "bg-positive-9 text-positive-1 font-bold" : ""}`}
                              >
                                {tab}
                              </button>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        <Tab.Panel>
                          {/* @ts-ignore */}
                          {storeRewardsModule?.rewardsModule?.balance?.length > 0 ? <ul className="flex flex-col items-center space-y-6">
                            {/* @ts-ignore */}
                            {storeRewardsModule?.rewardsModule?.balance?.map(token => (
                              <li
                                className="flex flex-col items-center"
                                key={`withdraw-erc20-${token.contractAddress}`}
                              >
                                <ButtonWithdrawERC20Reward
                                  //@ts-ignore
                                  contractRewardsModuleAddress={storeRewardsModule.rewardsModule.contractAddress}
                                  //@ts-ignore
                                  abiRewardsModule={storeRewardsModule.rewardsModule.abi}
                                  tokenAddress={token.contractAddress}
                                />
                              </li>
                            ))}
                          </ul> : <>
                              <p className="italic animate-appear text-neutral-11">No balance found for ERC20 tokens.</p>
                          </>}
                        </Tab.Panel>
                        <Tab.Panel className="flex flex-col items-center">
                          <ButtonWithdrawNativeReward
                            //@ts-ignore
                            contractRewardsModuleAddress={storeRewardsModule.rewardsModule.contractAddress}
                            //@ts-ignore
                            abiRewardsModule={storeRewardsModule.rewardsModule.abi}
                          />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </DialogWithdrawFundsFromRewardsModule>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        address,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export const getLayout = (page: any) => {
  return getLayoutContest(
    <ProviderRewardsModule createStore={createStoreRewardsModule}>
      <ProviderFundRewardsModule createStore={createStoreFundRewardsModule}>{page}</ProviderFundRewardsModule>
    </ProviderRewardsModule>,
  );
};
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
