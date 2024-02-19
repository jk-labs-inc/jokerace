import CreateRequirementsSettings from "@components/_pages/Create/components/RequirementsSettings";
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

  const onSubmissionsRequirementTokenAddressChange = (address: string) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      tokenAddress: address,
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
      tokenAddress={submissionRequirements.tokenAddress}
      minTokensRequired={submissionRequirements.minTokensRequired}
      onChainChange={onSubmissionsRequirementChainChange}
      onTokenAddressChange={onSubmissionsRequirementTokenAddressChange}
      onMinTokensRequiredChange={onSubmissionsRequirementMinTokensRequiredChange}
    />
  );
};

export default CreateSubmissionRequirementsTokenSettings;
