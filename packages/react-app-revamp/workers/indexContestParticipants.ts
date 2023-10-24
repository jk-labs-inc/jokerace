import { ContestValues } from "@hooks/useContestsIndexV3";
import { SubmissionMerkle, VotingMerkle } from "@hooks/useDeployContest/types";
import { indexContestParticipantsV3 } from "lib/participants";

interface EventData {
  contestData: ContestValues;
  votingMerkle: VotingMerkle;
  submissionMerkle: SubmissionMerkle | null;
}

self.onmessage = async (event: MessageEvent<EventData>) => {
  try {
    const { contestData, votingMerkle, submissionMerkle } = event.data;

    const submitters = submissionMerkle ? submissionMerkle.submitters : [];
    const voterSet = new Set(votingMerkle.voters.map(voter => voter.address));
    const submitterSet = new Set(submitters.map(submitter => submitter.address));

    // Combine voters and submitters, removing duplicates
    const allParticipants = Array.from(
      new Set([...votingMerkle.voters.map(voter => voter.address), ...submitters.map(submitter => submitter.address)]),
    );

    const everyoneCanSubmit = submitters.length === 0;
    await indexContestParticipantsV3(
      contestData.contractAddress,
      allParticipants,
      voterSet,
      submitterSet,
      votingMerkle.voters,
      contestData.networkName,
      everyoneCanSubmit,
    );

    postMessage({ success: true });
  } catch (error: any) {
    postMessage({ success: false, error: error.message });
  }
};
