import DialogModalV3 from "@components/UI/DialogModalV3";
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import CrossIcon from "@components/UI/Icons/Cross";
import { chains } from "@config/wagmi";
import { ExclamationIcon } from "@heroicons/react/outline";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useBalance } from "wagmi";
import CreateTextInput from "../Create/components/TextInput";

interface DialogCheckBalanceRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
export const DialogCheckBalanceRewardsModule: FC<DialogCheckBalanceRewardsModuleProps> = ({ isOpen, setIsOpen }) => {
  const rewardsStore = useRewardsStore(state => state);
  const { asPath } = useRouter();
  const [inputRewardsModuleBalanceCheck, setInputRewardsModuleBalanceCheck] = useState("");
  const queryTokenBalance = useBalance({
    addressOrName: rewardsStore?.rewards?.contractAddress,
    chainId: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id,
    token: inputRewardsModuleBalanceCheck,
    //@ts-ignore
    enabled: inputRewardsModuleBalanceCheck !== "" && inputRewardsModuleBalanceCheck?.match(/^0x[a-fA-F0-9]{40}$/),
    onSuccess(data) {
      if (parseFloat(data?.formatted) > 0) {
        const newBalance = {
          contractAddress: inputRewardsModuleBalanceCheck,
          tokenBalance: data?.formatted,
        };

        if (!rewardsStore.rewards.balance) {
          rewardsStore.setRewards({
            ...rewardsStore.rewards,
            balance: [newBalance],
          });
        } else {
          const existingBalance = rewardsStore.rewards.balance.find(
            (bal: any) => bal.contractAddress === inputRewardsModuleBalanceCheck,
          );

          if (!existingBalance) {
            rewardsStore.setRewards({
              ...rewardsStore.rewards,
              balance: [...rewardsStore.rewards.balance, newBalance],
            });
          }
        }
      }
    },
  });

  useEffect(() => {
    // reset state when modal closes
    if (!isOpen) {
      setInputRewardsModuleBalanceCheck("");
    }
  }, [isOpen]);

  return (
    <DialogModalV3
      title="Check rewards module balance"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="xl:w-[1000px] 3xl:w-[1000px]"
    >
      <div className="flex flex-col gap-4 animate-appear md:pl-[50px] lg:pl-[60px] mt-[60px] pb-[60px]">
        <p className="text-[20px] text-neutral-11">
          Don&apos;t see a token you expected? Add the address below to refresh balances on this page
        </p>
        <div>
          <CreateTextInput
            className="w-[500px]"
            placeholder="0x..."
            type="text"
            onChange={setInputRewardsModuleBalanceCheck}
          />

          {queryTokenBalance?.isError && (
            <div className="pt-2 flex items-center">
              <CrossIcon />
              <p className="text-negative-11 text-2xs">{queryTokenBalance?.error?.message}</p>{" "}
            </div>
          )}
          {queryTokenBalance?.isSuccess && (
            <div className="pt-2 flex items-center gap-1">
              <CheckmarkIcon color="#78FFC6" />
              <p className="text-positive-11 text-[16px] uppercase">${queryTokenBalance?.data?.symbol}</p>{" "}
            </div>
          )}
        </div>
        {queryTokenBalance?.data?.formatted && (
          <div className="flex gap-2 animate-appear text-[16px] pt-6 font-bold">
            <p>balance:</p>
            <p className="uppercase text-positive-11">
              {queryTokenBalance?.data?.formatted} ${queryTokenBalance?.data?.symbol}
            </p>
          </div>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogCheckBalanceRewardsModule;
