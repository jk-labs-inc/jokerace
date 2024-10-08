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
    const { networkName, contractAddress } = contestData;

    const submitters = submissionMerkle ? submissionMerkle.submitters : [];
    const voters = votingMerkle ? votingMerkle.voters : [];
    const submitterSet = new Set(submitters.map(submitter => submitter.address));
    const voterSet = new Set(voters.map(voter => voter.address));

    // Combine voters and submitters, removing duplicates
    const allParticipants = Array.from(
      new Set([...voters.map(voter => voter.address), ...submitters.map(submitter => submitter.address)]),
    );

    const everyoneCanSubmit = submitters.length === 0;
    await indexContestParticipantsV3(
      contractAddress,
      allParticipants,
      voterSet,
      submitterSet,
      voters,
      networkName,
      everyoneCanSubmit,
    );

    postMessage({ success: true });
  } catch (error: any) {
    postMessage({ success: false, error: error.message });
  }
};
