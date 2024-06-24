import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { steps } from "@components/_pages/Create";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { MerkleKey, SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle, VoteType, VotingMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useCallback, useEffect } from "react";
import CSVEditorVoting, { VotingFieldObject } from "./components/CSVEditor";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateVotingAllowlist = () => {
  const {
    step,
    setVotingMerkle,
    setError,
    setSubmissionMerkle,
    setVotingAllowlist,
    votingAllowlist,
    votingRequirements,
    setVotingRequirements,
    submissionTypeOption,
    charge,
    setCharge,
    mobileStepTitle,
    resetMobileStepTitle,
    votingTab,
  } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const submittersAsVoters = submissionTypeOption.value === SubmissionType.SameAsVoters;

  const handleNextStepMobile = useCallback(() => {
    if (!mobileStepTitle || votingTab !== 2) return;

    if (mobileStepTitle === steps[step].title) {
      handleNextStep();
      resetMobileStepTitle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileStepTitle, onNextStep, resetMobileStepTitle, step]);

  // Mobile listeners
  useEffect(() => {
    handleNextStepMobile();
  }, [handleNextStepMobile]);

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

    setVotingAllowlist("manual", errorExists ? {} : newAllowList);
  };

  const initializeWorkerForVoters = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessageForVoters;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const initializeWorkersForVotersAndSubmitters = () => {
    const worker = new Worker(new URL("/workers/generateBatchRootsAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessageForVotersAndSubmitters;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessageForVotersAndSubmitters = (event: MessageEvent<WorkerMessageData[]>): void => {
    const results = event.data;
    const [votingMerkleData, submissionMerkleData] = results;

    if (votingMerkleData) {
      setVotingMerkle("manual", {
        merkleRoot: votingMerkleData.merkleRoot,
        voters: votingMerkleData.recipients,
      });
    }

    if (submissionMerkleData) {
      setSubmissionMerkle("manual", {
        merkleRoot: submissionMerkleData.merkleRoot,
        submitters: submissionMerkleData.recipients,
      });
    }
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlists processed successfully.");
    resetAllowlists();
    setBothSubmissionMerkles(null);
    terminateWorker(event.target as Worker);
  };

  const handleWorkerMessageForVoters = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setVotingMerkle("manual", { merkleRoot, voters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlist processed successfully.");
    resetAllowlists();
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
    if (Object.keys(votingAllowlist.manual).length === 0) {
      onNextStep();
      return;
    }

    toastLoading("processing your allowlist...", false);
    setCharge({
      ...charge,
      voteType: VoteType.PerTransaction,
    });
    if (submittersAsVoters) {
      const submissionAllowlist: Record<string, number> = Object.keys(votingAllowlist.manual).reduce(
        (acc, address) => {
          acc[address] = 10;
          return acc;
        },
        {} as Record<string, number>,
      );

      const worker = initializeWorkersForVotersAndSubmitters();
      worker.postMessage({
        allowLists: [
          { decimals: 18, allowList: votingAllowlist.manual },
          { decimals: 18, allowList: submissionAllowlist },
        ],
      });
    } else {
      const worker = initializeWorkerForVoters();
      worker.postMessage({
        decimals: 18,
        allowList: votingAllowlist.manual,
      });
    }
  };

  const setBothSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["prefilled", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setBothVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["prefilled", "csv"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const setBothAllowlists = (value: Record<string, number>) => {
    const keys: MerkleKey[] = ["prefilled", "csv"];
    keys.forEach(key => setVotingAllowlist(key, value));
  };

  const resetAllowlists = () => {
    setBothVotingMerkles(null);
    setBothAllowlists({});
    setVotingRequirements({
      ...votingRequirements,
      chain: "mainnet",
      tokenAddress: "",
      powerValue: 100,
      powerType: "token",
    });
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[20px] text-neutral-11 font-bold">to set allowlist manually:</p>
        <ul className="flex flex-col  pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">
            write or copy up to 100 addresses in the left column
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">write or copy number of votes in the right column</li>
        </ul>
        <CSVEditorVoting onChange={handleAllowListChange} />
      </div>

      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateVotingAllowlist;
