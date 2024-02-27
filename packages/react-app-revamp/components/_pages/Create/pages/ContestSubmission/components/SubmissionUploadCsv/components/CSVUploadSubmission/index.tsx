import CSVErrorModalDuplicates from "@components/_pages/Create/components/CSVErrorModal/components/Duplicates";
import CSVErrorModalInvalidEntriesSubmission from "@components/_pages/Create/components/CSVErrorModal/components/InvalidEntries/components/Submission";
import FileUpload from "@components/_pages/Create/components/FileUpload";
import CSVParseError, {
  ParseError,
} from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor/CSVParseError";
import { SubmissionInvalidEntry } from "@helpers/csvTypes";
import { parseSubmissionCsv } from "@helpers/parseSubmissionsCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { SubmissionFieldObject } from "../../../SubmissionAllowlist/components/CSVEditor";

interface SubmissionCSVFileUploaderProps {
  onChange?: (fields: Array<SubmissionFieldObject>) => void;
  onNext?: () => void;
}

const SubmissionCSVFileUploader: FC<SubmissionCSVFileUploaderProps> = ({ onChange, onNext }) => {
  const { setError, step } = useDeployContestStore(state => state);
  const currentStep = step + 1;
  const { address } = useAccount();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [parseError, setParseError] = useState<ParseError>("");
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [invalidEntries, setInvalidEntries] = useState<SubmissionFieldObject[]>([]);
  const [validEntries, setValidEntries] = useState<SubmissionFieldObject[]>([]);
  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState<boolean>(false);
  const [isInvalidEntriesModalOpen, setIsInvalidEntriesModalOpen] = useState<boolean>(false);

  const handleDuplicateError = (invalidEntries: SubmissionInvalidEntry[]) => {
    const duplicateAddresses = invalidEntries.map(entry => entry.address);

    setDuplicates(duplicateAddresses);
    setIsDuplicatesModalOpen(true);
    setError(currentStep, { step: currentStep, message: "entries" });
  };

  const handleInvalidEntriesError = (invalidEntries: SubmissionInvalidEntry[]) => {
    const invalidEntriesFormatted = invalidEntries.map(entry => ({
      address: entry.address,
      error: true,
    }));

    setInvalidEntries(invalidEntriesFormatted);
    setIsInvalidEntriesModalOpen(true);
    setError(currentStep, { step: currentStep, message: "entries" });
  };

  const onFileSelectHandler = async (file: File) => {
    const results = await parseSubmissionCsv(file, address);

    switch (results.error?.kind) {
      case "unexpectedHeaders":
      case "missingColumns":
      case "limitExceeded":
        setParseError(results.error?.kind);
        return;
      default:
        setParseError("");
    }

    const validEntries = results.data.map(address => ({
      address,
      error: false,
    }));

    setValidEntries(validEntries);

    if (results.error?.kind === "duplicates") {
      handleDuplicateError(results.invalidEntries);
      return;
    }

    if (results.error?.kind === "invalidEntries") {
      handleInvalidEntriesError(results.invalidEntries);
      return;
    }

    setError(currentStep, { step: currentStep, message: "" });
    setUploadSuccess(true);
    onChange?.(validEntries);
  };

  const handleInvalidEntriesChange = (entries: SubmissionFieldObject[]) => {
    setInvalidEntries(entries);
    onChange?.([...entries, ...validEntries]);
  };

  const handleNext = () => {
    setIsInvalidEntriesModalOpen(false);
    onNext?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <FileUpload onFileSelect={onFileSelectHandler} type="csv" isSuccess={uploadSuccess} />
      <CSVParseError type={parseError} step="submission" />
      <CSVErrorModalDuplicates
        addresses={duplicates}
        isOpen={isDuplicatesModalOpen}
        setIsOpen={value => setIsDuplicatesModalOpen(value)}
      />
      <CSVErrorModalInvalidEntriesSubmission
        fields={invalidEntries}
        isOpen={isInvalidEntriesModalOpen}
        setIsOpen={value => setIsInvalidEntriesModalOpen(value)}
        onChange={entries => handleInvalidEntriesChange(entries)}
        onClick={handleNext}
      />
    </div>
  );
};

export default SubmissionCSVFileUploader;
