import CreateVotingRequirementsSettings from "@components/_pages/Create/components/RequirementsSettings";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const CreateSubmissionRequirementsNftSettings = () => {
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

  const onSubmissionsRequirementMinTokensRequiredChange = (minTokens: string) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      minTokensRequired: minTokens,
    });
  };

  return (
    <CreateVotingRequirementsSettings
      step="submission"
      settingType="erc721"
      chain={submissionRequirements.chain}
      tokenAddress={submissionRequirements.tokenAddress}
      minTokensRequired="1"
      onChainChange={onSubmissionsRequirementChainChange}
      onTokenAddressChange={onSubmissionsRequirementTokenAddressChange}
      onMinTokensRequiredChange={onSubmissionsRequirementMinTokensRequiredChange}
    />
  );
};

export default CreateSubmissionRequirementsNftSettings;
