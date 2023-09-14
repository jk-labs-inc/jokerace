import ButtonV3 from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import CrossIcon from "@components/UI/Icons/Cross";
import { useContestStore } from "@hooks/useContest/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useTokenBalance } from "@hooks/useTokenBalance";
import { useWithdrawReward } from "@hooks/useWithdrawRewards";
import { utils } from "ethers";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CreateTextInput from "../Create/components/TextInput";

interface DialogCheckBalanceRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const DialogCheckBalanceRewardsModule: FC<DialogCheckBalanceRewardsModuleProps> = ({ isOpen, setIsOpen }) => {
  const rewardsStore = useRewardsStore(state => state);
  const { contestAuthorEthereumAddress } = useContestStore(state => state);
  const { address, isConnected } = useAccount();
  const creator = isConnected && address ? contestAuthorEthereumAddress === address : false;
  const [inputRewardsModuleBalanceCheck, setInputRewardsModuleBalanceCheck] = useState("");
  const { contractWriteWithdrawReward, txWithdraw } = useWithdrawReward(
    rewardsStore?.rewards?.contractAddress,
    rewardsStore?.rewards?.abi,
    "erc20",
    inputRewardsModuleBalanceCheck,
  );
  const { queryTokenBalance, error } = useTokenBalance(inputRewardsModuleBalanceCheck);
  const [tokenAlreadyAdded, setTokenAlreadyAdded] = useState(false);

  useEffect(() => {
    if (!inputRewardsModuleBalanceCheck) return;

    if (rewardsStore.rewards.balance) {
      const existingBalance = rewardsStore.rewards.balance.find(
        (bal: any) => bal.contractAddress?.toLowerCase() == inputRewardsModuleBalanceCheck?.toLowerCase(),
      );

      if (existingBalance) {
        setTokenAlreadyAdded(true);
      } else {
        setTokenAlreadyAdded(false);
      }
    } else {
      setTokenAlreadyAdded(false);
    }
  }, [inputRewardsModuleBalanceCheck, rewardsStore.rewards.balance]);

  useEffect(() => {
    if (!isOpen) {
      setInputRewardsModuleBalanceCheck("");
      setTokenAlreadyAdded(false);
    }
  }, [isOpen]);

  const addReward = () => {
    if (!queryTokenBalance) return;

    const newBalance = {
      contractAddress: inputRewardsModuleBalanceCheck,
      tokenBalance: queryTokenBalance.formatted,
    };

    if (!rewardsStore.rewards.balance) {
      rewardsStore.setRewards({
        ...rewardsStore.rewards,
        balance: [newBalance],
      });
    } else {
      rewardsStore.setRewards({
        ...rewardsStore.rewards,
        balance: [...rewardsStore.rewards.balance, newBalance],
      });
    }
  };

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
            className="w-full md:w-[500px]"
            placeholder="0x..."
            type="text"
            onChange={setInputRewardsModuleBalanceCheck}
          />

          {error && (
            <div className="pt-2 gap-2 flex items-center">
              <CrossIcon color="#FF78A9" />
              <p className="text-negative-11 text-2xs">{error}</p>{" "}
            </div>
          )}
          {queryTokenBalance && tokenAlreadyAdded && (
            <div className="pt-2 flex items-center gap-1">
              <CheckmarkIcon color="#78FFC6" />
              <p className="text-positive-11 text-[16px]">
                <span className="uppercase">${queryTokenBalance?.symbol}</span> has already been added to your rewards
              </p>
            </div>
          )}
        </div>
        {queryTokenBalance?.formatted && !tokenAlreadyAdded && (
          <ul className="flex gap-6 text-[16px] pt-6 font-bold list-explainer animate-appear">
            <li className="flex items-center uppercase">
              {parseFloat(utils.formatUnits(queryTokenBalance.value, queryTokenBalance.decimals))} $
              {queryTokenBalance?.symbol}
            </li>
            <div className="flex gap-2">
              <ButtonV3 size="extraSmall" color="bg-gradient-distribute" onClick={addReward}>
                add
              </ButtonV3>
              {creator && (
                <ButtonV3
                  disabled={txWithdraw.isLoading}
                  size="extraSmall"
                  color="bg-gradient-withdraw"
                  onClick={() => contractWriteWithdrawReward.write()}
                >
                  Withdraw
                </ButtonV3>
              )}
            </div>
          </ul>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogCheckBalanceRewardsModule;
