import DialogModal from "@components/UI/DialogModal";
import FormField from "@components/UI/FormField";
import FormInput from "@components/UI/FormInput";
import { chains } from "@config/wagmi";
import { CheckIcon, ExclamationIcon, ShieldExclamationIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useState } from "react";
import { useBalance, useNetwork } from "wagmi";
import { useRewardsStore } from "@hooks/useRewards/store";

interface DialogCheckBalanceRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
export const DialogCheckBalanceRewardsModule = (props: DialogCheckBalanceRewardsModuleProps) => {
  const { ...dialogProps } = props;
  const rewardsStore = useRewardsStore(state => state);
  const { asPath } = useRouter();
  const [inputRewardsModuleBalanceCheck, setInputRewardsModuleBalanceCheck] = useState("");
  const { chain } = useNetwork();
  const queryTokenBalance = useBalance({
    addressOrName: rewardsStore?.rewards?.contractAddress,
    chainId: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id,
    token: inputRewardsModuleBalanceCheck,
    //@ts-ignore
    enabled: inputRewardsModuleBalanceCheck !== "" && inputRewardsModuleBalanceCheck?.match(/^0x[a-fA-F0-9]{40}$/),
    onSuccess(data) {
      if (parseFloat(data?.formatted) > 0) {
        rewardsStore.setRewards({
          ...rewardsStore.rewards,
          balance: {
            ...rewardsStore.rewards.balance,
            contractAddress: inputRewardsModuleBalanceCheck,
            tokenBalance: data?.formatted,
          },
        });
      }
    },
  });

  return (
    <DialogModal title="Check rewards module balance" {...dialogProps}>
      <div className="animate-appear">
        <FormField>
          <FormField.InputField>
            <FormField.Label
              hasError={
                !inputRewardsModuleBalanceCheck.match(/^0x[a-fA-F0-9]{40}$/) && inputRewardsModuleBalanceCheck !== ""
              }
              className="text-sm"
              htmlFor="inputRewardsModuleBalanceCheck"
            >
              Don&apos;t see a token you expected? Add the address below to refresh balances on this page
            </FormField.Label>
            <FormField.Description id="inputRewardsModuleBalanceCheck-description">
              The Ethereum address of the ERC20 token you want to check the balance of
            </FormField.Description>
            <FormInput
              className="max-w-full w-auto 2xs:w-full"
              placeholder="0x..."
              type="text"
              onChange={e => setInputRewardsModuleBalanceCheck(e.currentTarget.value)}
              id="inputRewardsModuleBalanceCheck"
              name="inputRewardsModuleBalanceCheck"
              hasError={
                !inputRewardsModuleBalanceCheck.match(/^0x[a-fA-F0-9]{40}$/) && inputRewardsModuleBalanceCheck !== ""
              }
              aria-describedby="inputRewardsModuleBalanceCheck-description inputRewardsModuleBalanceCheck-note inputRewardsModuleBalanceCheck-helpblock"
            />
          </FormField.InputField>
          {queryTokenBalance?.data && (
            <div className="pt-2 flex items-center">
              <CheckIcon className="mie-2 w-5 shrink-0 text-positive-11" />
              <p className="text-neutral-11 text-2xs normal-case font-bold">
                {/* @ts-ignore */}
                {queryTokenBalance?.data?.name} (${queryTokenBalance?.data?.symbol})
              </p>
            </div>
          )}
          {queryTokenBalance?.isError && (
            <div className="pt-2 flex items-center">
              <ExclamationIcon className="mie-2 w-5 shrink-0 text-negative-11" />
              <p className="text-negative-11 text-2xs">{queryTokenBalance?.error?.message}</p>{" "}
            </div>
          )}
          {!queryTokenBalance?.data && (
            <p
              id="input-inputRewardsModuleBalanceCheck-note"
              className="text-2xs pt-2 text-secondary-11 flex flex-wrap items-center"
            >
              <ShieldExclamationIcon className="text-secondary-11 mie-1ex w-5" />
              The token must be a valid &nbsp;
              <span className="font-mono normal-case">ERC20</span>&nbsp; token on {chain?.name}
              <br />
              <a
                target="_blank"
                rel="nofollow noreferrer"
                href="https://metamask.zendesk.com/hc/en-us/articles/360059683451-How-to-find-a-token-contract-address"
              >
                Check <span className="link">this article</span> on how to find token addresses
              </a>
            </p>
          )}
          <FormField.HelpBlock
            hasError={
              !inputRewardsModuleBalanceCheck.match(/^0x[a-fA-F0-9]{40}$/) && inputRewardsModuleBalanceCheck !== ""
            }
            id="input-inputRewardsModuleBalanceCheck-helpblock"
          >
            The token address must be a valid Ethereum address
          </FormField.HelpBlock>
        </FormField>
      </div>

      {queryTokenBalance?.data?.formatted && (
        <div className="animate-appear normal-case pt-6 font-bold">
          {queryTokenBalance?.data?.formatted} {queryTokenBalance?.data?.symbol}
        </div>
      )}
    </DialogModal>
  );
};

export default DialogCheckBalanceRewardsModule;
