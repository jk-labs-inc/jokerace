import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDropdown from "@components/_pages/Create/components/Dropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders } from "lib/permissioning";
import { useState } from "react";
import CreateVotingRequirementsNftSettings from "./components/NFT";
import { requirementsDropdownOptions } from "./config";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
  allowList: Record<string, number>;
};

const CreateVotingRequirements = () => {
  const {
    step,
    setVotingMerkle,
    votingMerkle,
    setError,
    setVotingAllowlist,
    setVotingAllowlistFields,
    votingAllowlist,
    votingRequirements,
  } = useDeployContestStore(state => state);
  const [selectedRequirement, setSelectedRequirement] = useState(requirementsDropdownOptions[0].value);
  const votingValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([arg => votingValidation?.[0].validation(arg)]);

  const onRequirementChange = (option: string) => {
    setSelectedRequirement(option);
  };

  const renderLayout = () => {
    switch (selectedRequirement) {
      case "NFT holders":
        return <CreateVotingRequirementsNftSettings />;
      default:
        return null;
    }
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients, allowList } = event.data;

    setVotingAllowlist("prefilled", allowList);
    setVotingMerkle("prefilled", { merkleRoot, voters: recipients });

    onNextStep(allowList);
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlist processed successfully.");
    resetManualAllowlist();
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

  const handleNextStep = async () => {
    toastLoading("processing your allowlist...", false);
    const result = await fetchNftHolders(
      votingRequirements.tokenAddress,
      votingRequirements.chain,
      votingRequirements.minTokensRequired,
      votingRequirements.powerValue,
      votingRequirements.powerType,
    );

    if (result instanceof Error) {
      toastError(result.message);
      return;
    } else {
      const worker = initializeWorker();
      worker.postMessage({
        decimals: 18,
        allowList: result,
      });
    }
  };

  const resetManualAllowlist = () => {
    setVotingMerkle("manual", null);
    setVotingAllowlist("manual", {});
    setVotingAllowlistFields([]);
  };

  return (
    <div className="mt-5 md:ml-[20px] flex flex-col gap-5">
      <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can vote?</p>
      <div className="flex flex-col gap-5">
        <CreateDropdown
          value={requirementsDropdownOptions[0].value}
          options={requirementsDropdownOptions}
          className="w-full md:w-48 text-[16px] md:text-[24px] cursor-pointer"
          searchEnabled={false}
          onChange={onRequirementChange}
        />
        {renderLayout()}
      </div>

      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </div>
  );
};

export default CreateVotingRequirements;
