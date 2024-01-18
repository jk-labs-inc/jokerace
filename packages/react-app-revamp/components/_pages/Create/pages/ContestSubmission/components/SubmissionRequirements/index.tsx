/* eslint-disable react-hooks/exhaustive-deps */
import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDropdown, { Option } from "@components/_pages/Create/components/Dropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { tokenAddressRegex } from "@helpers/regex";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { useEffect, useState } from "react";
import CreateSubmissionRequirementsNftSettings from "./components/NFT";
import CreateSubmissionRequirementsTokenSettings from "./components/Token";

const options: Option[] = [
  { value: "anyone", label: "anyone" },
  { value: "voters", label: "voters (same requirements)" },
  { value: "erc20Holders", label: "token holders" },
  { value: "nftHolders", label: "NFT holders" },
];

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionRequirements = () => {
  const {
    step,
    submissionRequirementsOption,
    setSubmissionRequirementsOption,
    setSubmissionAllowlistFields,
    setSubmissionMerkle,
    submissionRequirements,
    votingRequirements,
    setSubmissionRequirements,
    votingAllowlist,
  } = useDeployContestStore(state => state);
  const submissionRequirementsValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([
    () => submissionRequirementsValidation?.[1].validation(submissionRequirementsOption, "submissionRequirements"),
  ]);
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});

  const renderLayout = () => {
    switch (submissionRequirementsOption) {
      case "nftHolders":
        return <CreateSubmissionRequirementsNftSettings error={inputError} />;
      case "erc20Holders":
        return <CreateSubmissionRequirementsTokenSettings error={inputError} />;
      default:
        return null;
    }
  };

  const onSubmissionRequirementsOptionChange = (value: string) => {
    setSubmissionRequirementsOption(value);
    setInputError({});
  };

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("prefilled", { merkleRoot, submitters: recipients });
    setSubmissionAllowlistFields([]);
    onNextStep();
    toastSuccess("allowlist processed successfully.");
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

  const setBothSubmissionMerkles = (value: SubmissionMerkle | null) => {
    setSubmissionMerkle("manual", value);
    setSubmissionMerkle("prefilled", value);
  };

  const validateInput = () => {
    const errors: Record<string, string | undefined> = {};

    if (
      submissionRequirements.tokenAddress === "" ||
      tokenAddressRegex.test(submissionRequirements.tokenAddress) === false
    ) {
      errors.tokenAddressError = "Invalid token address";
    }

    if (submissionRequirements.minTokensRequired === 0 || isNaN(submissionRequirements.minTokensRequired)) {
      errors.minTokensRequiredError = "Minimum tokens required should be greater than 0";
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVotersSameRequirements = () => {
    toastLoading("processing your allowlist...", false);
    const worker = initializeWorker();
    const allowList = Object.keys(votingAllowlist.manual).length ? votingAllowlist.manual : votingAllowlist.prefilled;
    const isVotingAllowlistPrefilled = allowList === votingAllowlist.prefilled;

    const submissionAllowlist: Record<string, number> = Object.keys(allowList).reduce((acc, address) => {
      acc[address] = 10;
      return acc;
    }, {} as Record<string, number>);

    if (isVotingAllowlistPrefilled) {
      const { tokenAddress, minTokensRequired, timestamp, type, chain } = votingRequirements;
      setSubmissionRequirements({
        tokenAddress,
        minTokensRequired,
        timestamp,
        type,
        chain,
      });
    }

    worker.postMessage({
      decimals: 18,
      allowList: submissionAllowlist,
    });
  };

  const fetchRequirementsMerkleData = async (type: string) => {
    const isValid = validateInput();

    if (!isValid) {
      return;
    }

    let result: Record<string, number>;
    toastLoading("processing your allowlist...", false);

    try {
      const fetchMerkleData = type === "nftHolders" ? fetchNftHolders : fetchTokenHolders;

      result = await fetchMerkleData(
        "submission",
        submissionRequirements.tokenAddress,
        submissionRequirements.chain,
        submissionRequirements.minTokensRequired,
      );

      if (result instanceof Error) {
        setInputError({
          tokenAddressError: result.message,
        });
        toastDismiss();
        return;
      }

      const worker = initializeWorker();
      worker.postMessage({
        decimals: 18,
        allowList: result,
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
    if (submissionRequirementsOption === "voters") {
      handleVotersSameRequirements();
    } else if (submissionRequirementsOption) {
      fetchRequirementsMerkleData(submissionRequirementsOption);
    } else {
      setSubmissionAllowlistFields([]);
      setBothSubmissionMerkles(null);
      onNextStep();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can submit?</p>
        <CreateDropdown
          value={submissionRequirementsOption}
          options={options}
          className="w-full md:w-[300px] text-[20px] cursor-pointer"
          searchEnabled={false}
          onChange={onSubmissionRequirementsOptionChange}
        />
        {renderLayout()}
      </div>
      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </>
  );
};

export default CreateSubmissionRequirements;
