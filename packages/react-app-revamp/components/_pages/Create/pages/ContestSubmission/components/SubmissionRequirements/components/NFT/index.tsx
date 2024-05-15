import CreateRequirementsSettings, { TokenDetails } from "@components/_pages/Create/components/RequirementsSettings";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC } from "react";

interface CreateSubmissionRequirementsNftSettingsProps {
  error?: Record<string, string | undefined>;
}

const CreateSubmissionRequirementsNftSettings: FC<CreateSubmissionRequirementsNftSettingsProps> = ({ error }) => {
  const { submissionRequirements, setSubmissionRequirements } = useDeployContestStore(state => state);

  const onSubmissionsRequirementChainChange = (option: string) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      chain: option,
    });
  };

  const onSubmissionsRequirementTokenChange = (token: TokenDetails) => {
    const { address, symbol, name, logo, nftTokenType } = token;
    setSubmissionRequirements({
      ...submissionRequirements,
      tokenAddress: address,
      symbol,
      name,
      logo,
      nftType: nftTokenType ?? "",
      nftTokenId: "",
    });
  };

  const onSubmissionsRequirementMinTokensRequiredChange = (minTokens: number | null) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      minTokensRequired: minTokens ?? 0,
    });
  };

  const onSubmissionsRequirementTokenIdChange = (tokenId?: string) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      nftTokenId: tokenId,
    });
  };

  return (
    <CreateRequirementsSettings
      step="submission"
      settingType={submissionRequirements.type}
      error={error}
      chain={submissionRequirements.chain}
      token={{
        address: submissionRequirements.tokenAddress,
        symbol: submissionRequirements.symbol,
        name: submissionRequirements.name,
        logo: submissionRequirements.logo,
        nftTokenType: submissionRequirements.nftType,
      }}
      minTokensRequired={submissionRequirements.minTokensRequired}
      tokenId={submissionRequirements.nftTokenId}
      onChainChange={onSubmissionsRequirementChainChange}
      onTokenChange={onSubmissionsRequirementTokenChange}
      onMinTokensRequiredChange={onSubmissionsRequirementMinTokensRequiredChange}
      onTokenIdChange={onSubmissionsRequirementTokenIdChange}
    />
  );
};

export default CreateSubmissionRequirementsNftSettings;
