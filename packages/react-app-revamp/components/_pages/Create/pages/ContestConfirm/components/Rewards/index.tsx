import { formatBalance } from "@helpers/formatBalance";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { RewardPoolData } from "@hooks/useDeployContest/slices/contestCreateRewards";
import { FC, useMemo } from "react";
import { useFundPoolStore } from "@components/_pages/Create/pages/ContestRewards/components/FundPool/store";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmRewardsProps {
  step: number;
  rewardPoolData: RewardPoolData;
  addFundsToRewards: boolean;
  onClick: (step: number) => void;
}

const CreateContestConfirmRewards: FC<CreateContestConfirmRewardsProps> = ({
  step,
  rewardPoolData,
  addFundsToRewards,
  onClick,
}) => {
  const { recipients } = rewardPoolData;
  const tokenWidgets = useFundPoolStore(state => state.tokenWidgets);

  const seededRewardsText = useMemo(() => {
    if (!addFundsToRewards || tokenWidgets.length === 0) return null;

    const validTokens = tokenWidgets.filter(
      token => token.amount && token.amount !== "0" && token.amount !== "" && token.symbol,
    );

    if (validTokens.length === 0) return null;

    const tokensText = validTokens
      .map(token => `${formatBalance(token.amount)} ${token.symbol.toLowerCase()}`)
      .join(", ");

    return `seeded with ${tokensText} rewards pool`;
  }, [addFundsToRewards, tokenWidgets]);

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">rewards</p>
        <ul className="flex flex-col pl-6 list-disc">
          {recipients.map(recipient => (
            <li key={recipient.id} className="text-[16px]">
              {recipient.proportion}% to {recipient.place}
              <sup className="ml-px text-xs">{returnOnlySuffix(recipient.place)}</sup> place voters
            </li>
          ))}
          {seededRewardsText && <li className="text-[16px]">{seededRewardsText}</li>}
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmRewards;
