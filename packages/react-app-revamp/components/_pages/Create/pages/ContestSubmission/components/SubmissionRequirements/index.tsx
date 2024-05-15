import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { steps } from "@components/_pages/Create";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDefaultDropdown from "@components/_pages/Create/components/DefaultDropdown";
import { Option } from "@components/_pages/Create/components/TagDropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { addressRegex } from "@helpers/regex";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { useCallback, useEffect, useState } from "react";
import CreateSubmissionRequirementsNftSettings from "./components/NFT";
import CreateSubmissionRequirementsTokenSettings from "./components/Token";

const options: Option[] = [
  { value: "anyone", label: "anyone" },
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
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
    setSubmissionRequirements,
    submissionRequirements,
    mobileStepTitle,
    submissionTab,
    resetMobileStepTitle,
  } = useDeployContestStore(state => state);
  const submissionRequirementsValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([
    () => submissionRequirementsValidation?.[1].validation(submissionRequirementsOption, "submissionRequirements"),
  ]);
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNextStepMobile = useCallback(() => {
    if (!mobileStepTitle || submissionTab !== 0) return;

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

  const renderLayout = () => {
    //TODO: see why content jumps when dropdown changes
    switch (submissionRequirementsOption.value) {
      case "erc721":
        return (
          <div className={`${isDropdownOpen ? "opacity-20 transition-opacity duration-300 ease-in-out" : ""}`}>
            <CreateSubmissionRequirementsNftSettings error={inputError} />
          </div>
        );

      case "erc20":
        return (
          <div className={`${isDropdownOpen ? "opacity-20 transition-opacity duration-300 ease-in-out" : ""}`}>
            <CreateSubmissionRequirementsTokenSettings error={inputError} />
          </div>
        );
      default:
        return null;
    }
  };

  const onSubmissionRequirementsOptionChange = (value: string) => {
    setSubmissionRequirementsOption({
      value,
      label: options.find(option => option.value === value)?.label ?? "",
    });
    setSubmissionRequirements({
      ...submissionRequirements,
      type: value,
      tokenAddress: "",
      name: "",
      logo: "",
      nftTokenId: "",
    });
    setInputError({});
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("prefilled", { merkleRoot, submitters: recipients });
    setOtherSubmissionMerkles(null);
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

  const setOtherSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "prefilled", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const validateInput = () => {
    const errors: Record<string, string | undefined> = {};

    if (
      submissionRequirements.tokenAddress === "" ||
      addressRegex.test(submissionRequirements.tokenAddress) === false
    ) {
      errors.tokenAddressError = "Invalid token address";
    }

    if (submissionRequirements.minTokensRequired === 0 || isNaN(submissionRequirements.minTokensRequired)) {
      errors.minTokensRequiredError = "Minimum tokens required should be greater than 0";
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchRequirementsMerkleData = async (type: Option) => {
    const isValid = validateInput();

    if (!isValid) {
      return;
    }

    toastLoading("processing your allowlist...", false);

    try {
      let result;
      if (type.value === "erc721") {
        result = await fetchNftHolders(
          "submission",
          submissionRequirements.tokenAddress,
          submissionRequirements.chain,
          submissionRequirements.minTokensRequired,
          submissionRequirements.nftTokenId,
        );
      } else {
        result = await fetchTokenHolders(
          "submission",
          submissionRequirements.tokenAddress,
          submissionRequirements.chain,
          submissionRequirements.minTokensRequired,
        );
      }

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
    if (submissionRequirementsOption.value === "erc20" || submissionRequirementsOption.value === "erc721") {
      fetchRequirementsMerkleData(submissionRequirementsOption);
    } else {
      setSubmissionAllowlistFields([]);
      setAllSubmissionMerkles(null);
      onNextStep();
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">who can submit?</p>
        <CreateDefaultDropdown
          defaultOption={submissionRequirementsOption}
          options={options}
          className="w-48 md:w-[240px]"
          onChange={onSubmissionRequirementsOptionChange}
          onMenuStateChange={value => setIsDropdownOpen(value)}
        />
        {renderLayout()}
      </div>
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateSubmissionRequirements;
