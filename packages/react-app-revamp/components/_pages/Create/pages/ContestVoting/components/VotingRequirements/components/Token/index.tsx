import CreateRequirementsSettings from "@components/_pages/Create/components/RequirementsSettings";
import CreateVotingRequirementsSettings from "@components/_pages/Create/components/RequirementsSettings";
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

  const onMinTokensRequiredChange = (minTokens: string) => {
    setVotingRequirements({
      ...votingRequirements,
      minTokensRequired: parseFloat(minTokens),
    });
  };

  const onPowerTypeChange = (votingPowerType: string) => {
    setVotingRequirements({
      ...votingRequirements,
      powerType: votingPowerType,
    });
  };

  const onPowerValueChange = (votingPower: string) => {
    const decimalPlaces = (votingPower.split(".")[1] || "").length;
    if (decimalPlaces <= 4) {
      setVotingRequirements({
        ...votingRequirements,
        powerValue: parseFloat(votingPower),
      });
    }
  };

  return (
    <CreateRequirementsSettings
      step="voting"
      settingType={votingRequirements.type}
      chain={votingRequirements.chain}
      error={error}
      tokenAddress={votingRequirements.tokenAddress}
      minTokensRequired={votingRequirements.minTokensRequired.toString()}
      powerType={votingRequirements.powerType}
      powerValue={votingRequirements.powerValue.toString()}
      onChainChange={onVotingRequirementChainChange}
      onTokenAddressChange={onVotingRequirementTokenAddressChange}
      onMinTokensRequiredChange={onMinTokensRequiredChange}
      onPowerTypeChange={onPowerTypeChange}
      onPowerValueChange={onPowerValueChange}
    />
  );
};

export default CreateVotingRequirementsTokenSettings;
