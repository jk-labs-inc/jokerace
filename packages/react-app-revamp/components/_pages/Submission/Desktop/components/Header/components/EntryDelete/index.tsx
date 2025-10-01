import useContestAuthor from "@components/_pages/Submission/hooks/useContestAuthor";
import useEntryData from "@components/_pages/Submission/hooks/useEntryData";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

const SubmittionPageDesktopEntryDelete = () => {
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const { contestAuthor, isLoading, isError } = useContestAuthor({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });
  const { proposalData, isLoadingProposal, isErrorProposal } = useEntryData({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    proposalId: proposalId,
  });
  const { address } = useAccount();

  if (isLoading || isLoadingProposal || isError || isErrorProposal) return null;

  if (!contestAuthor || !proposalData) return null;

  if (address !== contestAuthor || address !== proposalData.author) return null;

  return <div>SubmittionPageDesktopEntryDelete</div>;
};

export default SubmittionPageDesktopEntryDelete;
