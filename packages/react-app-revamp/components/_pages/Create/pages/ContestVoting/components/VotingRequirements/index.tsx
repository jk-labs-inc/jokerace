import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDefaultDropdown, { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { addressRegex } from "@helpers/regex";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VotingMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { FC, useEffect, useState } from "react";
import CreateVotingRequirementsNftSettings from "./components/NFT";
import CreateVotingRequirementsTokenSettings from "./components/Token";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
  allowList: Record<string, number>;
};

const options: Option[] = [
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
];

interface CreateVotingRequirementsProps {
  isNextClicked: boolean;
}

const CreateVotingRequirements: FC<CreateVotingRequirementsProps> = ({ isNextClicked }) => {
  const {
    setVotingMerkle,
    setVotingAllowlist,
    votingTab,
    votingRequirements,
    setVotingRequirements,
    setVotingRequirementsOption,
    votingRequirementsOption,
  } = useDeployContestStore(state => state);
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});
  const onNextStep = useNextStep();

  const onRequirementChange = (option: string) => {
    setInputError({});
    setVotingRequirementsOption({
      value: option,
      label: options.find(o => o.value === option)?.label ?? "",
    });

    setVotingRequirements({
      ...votingRequirements,
      type: option,
      name: "",
      logo: "",
      tokenAddress: "",
      nftTokenId: "",
      nftType: "",
    });
  };

  const renderLayout = () => {
    switch (votingRequirementsOption.value) {
      case "erc721":
        return <CreateVotingRequirementsNftSettings error={inputError} />;
      case "erc20":
        return <CreateVotingRequirementsTokenSettings error={inputError} />;
    }
  };

  const initializeWorkerForVoters = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessageForVoters;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessageForVoters = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients, allowList } = event.data;

    setVotingAllowlist("prefilled", allowList);
    setVotingMerkle("prefilled", { merkleRoot, voters: recipients });
    setVotingRequirements({
      ...votingRequirements,
      timestamp: Date.now(),
    });
    toastSuccess("allowlist processed successfully.");
    resetUploadedAllowlist();
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

  const validateInput = () => {
    const errors: Record<string, string | undefined> = {};

    if (votingRequirements.tokenAddress === "" || addressRegex.test(votingRequirements.tokenAddress) === false) {
      errors.tokenAddressError = "Invalid token address";
    }

    if (votingRequirements.minTokensRequired === 0 || isNaN(votingRequirements.minTokensRequired)) {
      errors.minTokensRequiredError = "Minimum tokens required should be greater than 0";
    }

    if (votingRequirements.powerValue === 0 || isNaN(votingRequirements.powerValue)) {
      errors.powerValueError = "Voting power value should be greater than 0";
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchRequirementsMerkleData = async (type: string) => {
    toastLoading("processing your allowlist...", false);

    try {
      let votingAllowlist: Record<string, number> | Error;
      if (type === "erc721") {
        votingAllowlist = await fetchNftHolders(
          "voting",
          votingRequirements.tokenAddress,
          votingRequirements.chain,
          votingRequirements.minTokensRequired,
          votingRequirements.nftTokenId,
          votingRequirements.powerValue,
          votingRequirements.powerType,
        );
      } else {
        votingAllowlist = await fetchTokenHolders(
          "voting",
          votingRequirements.symbol,
          votingRequirements.tokenAddress,
          votingRequirements.chain,
          votingRequirements.minTokensRequired,
          votingRequirements.powerValue,
          votingRequirements.powerType,
        );
      }

      if (votingAllowlist instanceof Error) {
        setInputError({
          tokenAddressError: votingAllowlist.message,
        });
        toastDismiss();
        return;
      }

      const worker = initializeWorkerForVoters();
      worker.postMessage({
        decimals: 18,
        allowList: votingAllowlist,
      });
    } catch (error: any) {
      setInputError({
        tokenAddressError: error.message,
      });
      toastDismiss();
      return;
    }
  };

  const handleNextStep = async () => {
    const isValid = validateInput();

    if (!isValid) {
      return;
    }

    fetchRequirementsMerkleData(votingRequirementsOption.value);
  };

  const setUploadedVotingMerkle = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["csv"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const setUploadedAllowlist = (value: Record<string, number>) => {
    const keys: MerkleKey[] = ["csv"];
    keys.forEach(key => setVotingAllowlist(key, value));
  };

  const resetUploadedAllowlist = () => {
    setUploadedVotingMerkle(null);
    setUploadedAllowlist({});
  };

  useEffect(() => {
    if (isNextClicked && votingTab === 1) {
      handleNextStep();
    }
  }, [isNextClicked, votingTab]);

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">who can vote?</p>
        <>
          <CreateDefaultDropdown
            defaultOption={votingRequirementsOption}
            options={options}
            className="w-60 md:w-[240px]"
            onChange={onRequirementChange}
          />

          {renderLayout()}
        </>
      </div>
    </div>
  );
};

export default CreateVotingRequirements;
