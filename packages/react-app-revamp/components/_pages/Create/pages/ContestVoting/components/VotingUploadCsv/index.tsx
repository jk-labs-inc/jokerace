import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { emptyVotingRequirements, MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VoteType, VotingMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { FC, useEffect } from "react";
import VotingCSVFileUploader, { VotingFieldObject } from "./components";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

interface CreateVotingCSVUploaderProps {
  isNextClicked: boolean;
}

const CreateVotingCSVUploader: FC<CreateVotingCSVUploaderProps> = ({ isNextClicked }) => {
  const {
    setVotingMerkle,
    votingTab,
    setVotingAllowlist,
    votingAllowlist,
    setVotingRequirementsOption,
    setVotingRequirements,
    setCharge,
    charge,
  } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();

  const handleAllowListChange = (fields: VotingFieldObject[]) => {
    let newAllowList: Record<string, number> = {};
    let errorExists = false;

    for (const field of fields) {
      if (field.address || field.votes) {
        newAllowList[field.address] = Number(field.votes);
        if (field.error !== null) {
          errorExists = true;
          break;
        }
      }
    }

    setVotingAllowlist("csv", errorExists ? {} : newAllowList);
  };

  const initializeWorkerForVoters = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessageForVoters;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessageForVoters = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setVotingMerkle("csv", { merkleRoot, voters: recipients });
    toastSuccess("allowlist processed successfully.");
    resetPrefilledAllowlist();

    onNextStep();

    terminateWorker(event.target as Worker);
  };

  const handleWorkerError = (error: ErrorEvent): void => {
    console.error("Worker error:", error);
    toastError("something went wrong, please try again.");
    terminateWorker(error.target as Worker);
  };

  const terminateWorker = (worker: Worker): void => {
    if (worker && worker.terminate) {
      worker.terminate();
    }
  };

  const handleNextStep = () => {
    if (Object.keys(votingAllowlist.csv).length === 0) {
      onNextStep();
      return;
    }

    toastLoading("Processing your allowlist...");
    setCharge({
      ...charge,
      voteType: VoteType.PerTransaction,
    });

    const worker = initializeWorkerForVoters();

    worker.postMessage({
      decimals: 18,
      allowList: votingAllowlist.csv,
    });
  };

  const setPrefilledVotingMerkle = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["prefilled"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const setPrefilledAllowlist = (value: Record<string, number>) => {
    const keys: MerkleKey[] = ["prefilled"];
    keys.forEach(key => setVotingAllowlist(key, value));
  };

  const resetPrefilledAllowlist = () => {
    setPrefilledVotingMerkle(null);
    setPrefilledAllowlist({});
    setVotingRequirements(emptyVotingRequirements);
    setVotingRequirementsOption({
      value: "erc20",
      label: "token holders",
    });
  };

  useEffect(() => {
    if (isNextClicked && votingTab === 0) {
      handleNextStep();
    }
  }, [isNextClicked, votingTab]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">
            put up to 100,000 addresses in the left column (each starting with "0x")
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            put number of votes in the right column, and save as a .csv file
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            make sure there are no additional headers or columns
          </li>
        </ul>
      </div>
      <VotingCSVFileUploader onChange={handleAllowListChange} onNext={handleNextStep} />
    </div>
  );
};

export default CreateVotingCSVUploader;
