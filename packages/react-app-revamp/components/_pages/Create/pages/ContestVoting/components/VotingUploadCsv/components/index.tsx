import CSVErrorModalDuplicates from "@components/_pages/Create/components/CSVErrorModal/components/Duplicates";
import CSVErrorModalInvalidEntriesVoting from "@components/_pages/Create/components/CSVErrorModal/components/InvalidEntries/components/Voting";
import FileUpload from "@components/_pages/Create/components/FileUpload";
import { VotingInvalidEntry } from "@helpers/csvTypes";
import { parseCsvVoting } from "@helpers/parseVotingCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { VotingFieldObject } from "../../VotingAllowlist/components/CSVEditor";
import CSVParseError, { ParseError } from "../../VotingAllowlist/components/CSVEditor/CSVParseError";

interface VotingCSVFileUploaderProps {
  onChange?: (fields: Array<VotingFieldObject>) => void;
  onNext?: () => void;
}

const VotingCSVFileUploader: FC<VotingCSVFileUploaderProps> = ({ onChange, onNext }) => {
  const { setError, step } = useDeployContestStore(state => state);
  const currentStep = step + 1;
  const { address } = useAccount();
  const [parseError, setParseError] = useState<ParseError>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [roundedZeroCount, setRoundedZeroCount] = useState<number | undefined>(0);
  const [duplicateAddresses, setDuplicateAddresses] = useState<string[]>([]);
  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState<boolean>(false);
  const [isInvalidEntriesModalOpen, setIsInvalidEntriesModalOpen] = useState<boolean>(false);
  const [validEntries, setValidEntries] = useState<VotingFieldObject[]>([]);
  const [invalidEntries, setInvalidEntries] = useState<VotingFieldObject[]>([]);

  const handleDuplicateError = (invalidEntries: VotingInvalidEntry[]) => {
    const duplicateAddresses = invalidEntries.map(entry => entry.address);

    setDuplicateAddresses(duplicateAddresses);
    setIsDuplicatesModalOpen(true);
    setError(currentStep, { step: currentStep, message: "entries" });
  };

  const handleInvalidEntriesError = (invalidEntries: VotingInvalidEntry[]) => {
    const invalidEntriesFormatted = invalidEntries.map(({ address, votes, error }) => ({
      address,
      votes: String(votes),
      error,
    }));

    setInvalidEntries(invalidEntriesFormatted);
    setIsInvalidEntriesModalOpen(true);
    setError(currentStep, { step: currentStep, message: "entries" });
  };

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvVoting(file, address);

    switch (results.error?.kind) {
      case "unexpectedHeaders":
      case "missingColumns":
      case "limitExceeded":
      case "allZero":
        setParseError(results.error.kind);
        return;
      default:
        setParseError("");
    }

    const validEntries = Object.entries(results.data).map(([address, votes]) => ({
      address,
      votes: String(votes),
      error: null,
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
    setRoundedZeroCount(results.roundedZeroCount);
  };

  const handleInvalidEntriesChange = (entries: VotingFieldObject[]) => {
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
      <CSVParseError type={parseError} step="voting" />
      <CSVErrorModalDuplicates
        addresses={duplicateAddresses}
        isOpen={isDuplicatesModalOpen}
        setIsOpen={value => setIsDuplicatesModalOpen(value)}
      />
      <CSVErrorModalInvalidEntriesVoting
        fields={invalidEntries}
        isOpen={isInvalidEntriesModalOpen}
        setIsOpen={value => setIsInvalidEntriesModalOpen(value)}
        onChange={entries => handleInvalidEntriesChange(entries)}
        onClick={handleNext}
      />
      <div className="flex flex-col gap-4">
        <div>
          {uploadSuccess && (
            <p className="text-neutral-11 text-[16px]">please note: we rounded all entries with more than 4 decimals</p>
          )}
          {roundedZeroCount && roundedZeroCount > 0 ? (
            <p className="text-positive-11 text-[16px]">
              we removed <span className="font-bold">{roundedZeroCount} </span>
              {roundedZeroCount > 1 ? "entries" : "entry"} that had less than 0.0001 votes
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VotingCSVFileUploader;
