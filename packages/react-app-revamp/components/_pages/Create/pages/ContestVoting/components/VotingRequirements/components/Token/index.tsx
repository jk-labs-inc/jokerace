import CreateRequirementsSettings from "@components/_pages/Create/components/RequirementsSettings";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC } from "react";

type VotingRequirementsTokenSettingsError = Record<string, string | undefined>;

interface CreateVotingRequirementsTokenSettingsProps {
  error?: VotingRequirementsTokenSettingsError;
}

const CreateVotingRequirementsTokenSettings: FC<CreateVotingRequirementsTokenSettingsProps> = ({ error }) => {
  const { votingRequirements, setVotingRequirements } = useDeployContestStore(state => state);

  const onVotingRequirementChainChange = (option: string) => {
    setVotingRequirements({
      ...votingRequirements,
      chain: option,
    });
  };

  const onVotingRequirementTokenAddressChange = (address: string) => {
    setVotingRequirements({
      ...votingRequirements,
      tokenAddress: address,
    });
  };

  const onMinTokensRequiredChange = (minTokens: number | null) => {
    setVotingRequirements({
      ...votingRequirements,
      minTokensRequired: minTokens ?? 0,
    });
  };

  const onPowerTypeChange = (votingPowerType: string) => {
    setVotingRequirements({
      ...votingRequirements,
      powerType: votingPowerType,
    });
  };

  const onPowerValueChange = (votingPower: number | null) => {
    if (votingPower !== null) {
      const decimalPlaces = votingPower.toString().split(".")[1]?.length || 0;
      if (decimalPlaces <= 4) {
        setVotingRequirements({
          ...votingRequirements,
          powerValue: votingPower,
        });
      }
    }
  };

  return (
    <CreateRequirementsSettings
      step="voting"
      settingType={votingRequirements.type}
      chain={votingRequirements.chain}
      error={error}
      tokenAddress={votingRequirements.tokenAddress}
      minTokensRequired={votingRequirements.minTokensRequired}
      powerType={votingRequirements.powerType}
      powerValue={votingRequirements.powerValue}
      onChainChange={onVotingRequirementChainChange}
      onTokenAddressChange={onVotingRequirementTokenAddressChange}
      onMinTokensRequiredChange={onMinTokensRequiredChange}
      onPowerTypeChange={onPowerTypeChange}
      onPowerValueChange={onPowerValueChange}
    />
  );
};

export default CreateVotingRequirementsTokenSettings;
