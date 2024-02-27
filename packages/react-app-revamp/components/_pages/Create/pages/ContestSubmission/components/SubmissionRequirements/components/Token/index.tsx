import CreateRequirementsSettings, { TokenDetails } from "@components/_pages/Create/components/RequirementsSettings";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC } from "react";

interface CreateSubmissionRequirementsTokenSettingsProps {
  error?: Record<string, string | undefined>;
}

const CreateSubmissionRequirementsTokenSettings: FC<CreateSubmissionRequirementsTokenSettingsProps> = ({ error }) => {
  const { submissionRequirements, setSubmissionRequirements } = useDeployContestStore(state => state);

  const onSubmissionsRequirementChainChange = (option: string) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      chain: option,
    });
  };

  const onSubmissionsRequirementTokenChange = (token: TokenDetails) => {
    const { address, name, logo, symbol } = token;
    setSubmissionRequirements({
      ...submissionRequirements,
      tokenAddress: address,
      symbol,
      name,
      logo,
    });
  };

  const onSubmissionsRequirementMinTokensRequiredChange = (minTokens: number | null) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      minTokensRequired: minTokens ?? 0,
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
      }}
      minTokensRequired={submissionRequirements.minTokensRequired}
      onChainChange={onSubmissionsRequirementChainChange}
      onTokenChange={onSubmissionsRequirementTokenChange}
      onMinTokensRequiredChange={onSubmissionsRequirementMinTokensRequiredChange}
    />
  );
};

export default CreateSubmissionRequirementsTokenSettings;
