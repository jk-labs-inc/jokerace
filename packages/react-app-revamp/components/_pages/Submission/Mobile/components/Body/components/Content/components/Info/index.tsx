import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import SubmissionDeleteButton from "@components/_pages/Submission/components/Buttons/Delete";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useContestStore } from "@hooks/useContest/store";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import SubmissionPageMobileBodyContentInfoVotes from "./components/Votes";

const SubmissionPageMobileBodyContentInfo = () => {
  const proposalStaticData = useSubmissionPageStore(useShallow(state => state.proposalStaticData));
  const { address: userAddress } = useAccount();
  const contestAuthorEthereumAddress = useContestStore(useShallow(state => state.contestAuthorEthereumAddress));
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const { canDeleteProposal } = useDeleteProposal();

  const allowDelete = canDeleteProposal(
    userAddress,
    contestAuthorEthereumAddress,
    proposalStaticData?.author ?? "",
    contestStatus,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <UserProfileDisplay
          ethereumAddress={proposalStaticData?.author ?? ""}
          shortenOnFallback={true}
          textColor="text-neutral-9"
        />
        {allowDelete && (
          <SubmissionDeleteButton
            onClick={() => {
              /* TODO: handle delete */
            }}
          />
        )}
      </div>
      <SubmissionPageMobileBodyContentInfoVotes />
    </div>
  );
};

export default SubmissionPageMobileBodyContentInfo;
