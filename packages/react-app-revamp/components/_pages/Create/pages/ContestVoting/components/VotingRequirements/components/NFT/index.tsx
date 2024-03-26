import CreateRequirementsSettings, { TokenDetails } from "@components/_pages/Create/components/RequirementsSettings";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC } from "react";

type VotingRequirementsNftSettingsError = Record<string, string | undefined>;

interface CreateVotingRequirementsNftSettingsProps {
  error?: VotingRequirementsNftSettingsError;
}

const CreateVotingRequirementsNftSettings: FC<CreateVotingRequirementsNftSettingsProps> = ({ error }) => {
  const { votingRequirements, setVotingRequirements } = useDeployContestStore(state => state);

  const onVotingRequirementChainChange = (option: string) => {
    setVotingRequirements({
      ...votingRequirements,
      chain: option,
    });
  };

  const onVotingRequirementTokenChange = (token: TokenDetails) => {
    const { address, name, logo, symbol, nftTokenType } = token;

    setVotingRequirements({
      ...votingRequirements,
      tokenAddress: address,
      name,
      symbol,
      logo,
      nftType: nftTokenType ?? "",
      nftTokenId: null,
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

  const onTokenIdChange = (tokenId: number | null) => {
    setVotingRequirements({
      ...votingRequirements,
      nftTokenId: tokenId,
    });
  };

  return (
    <CreateRequirementsSettings
      step="voting"
      settingType={votingRequirements.type}
      chain={votingRequirements.chain}
      error={error}
      token={{
        address: votingRequirements.tokenAddress,
        symbol: votingRequirements.symbol,
        name: votingRequirements.name,
        logo: votingRequirements.logo,
        nftTokenType: votingRequirements.nftType,
      }}
      minTokensRequired={votingRequirements.minTokensRequired}
      powerType={votingRequirements.powerType}
      powerValue={votingRequirements.powerValue}
      tokenId={votingRequirements.nftTokenId}
      onChainChange={onVotingRequirementChainChange}
      onTokenChange={onVotingRequirementTokenChange}
      onMinTokensRequiredChange={onMinTokensRequiredChange}
      onPowerTypeChange={onPowerTypeChange}
      onPowerValueChange={onPowerValueChange}
      onTokenIdChange={onTokenIdChange}
    />
  );
};

export default CreateVotingRequirementsNftSettings;
