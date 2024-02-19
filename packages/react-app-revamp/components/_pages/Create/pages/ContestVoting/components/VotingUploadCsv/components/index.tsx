import FileUpload from "@components/_pages/Create/components/FileUpload";
import { parseCsvVoting } from "@helpers/parseVotingCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { VotingFieldObject } from "../../VotingAllowlist/components/CSVEditor";
import CSVParseError, { ParseError } from "../../VotingAllowlist/components/CSVEditor/CSVParseError";

interface VotingCSVFileUploaderProps {
  onChange?: (fields: Array<VotingFieldObject>) => void;
}

const VotingCSVFileUploader: FC<VotingCSVFileUploaderProps> = ({ onChange }) => {
  const { setError, errors, step } = useDeployContestStore(state => state);
  const currentStep = step + 1;
  const { address } = useAccount();
  const [parseError, setParseError] = useState<ParseError>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [roundedZeroCount, setRoundedZeroCount] = useState<number | undefined>(0);
  const currentStepError = errors.find(error => error.step === currentStep);
  const entriesError = currentStepError?.message === "entries";

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvVoting(file, address);

    switch (results.error?.kind) {
      case "unexpectedHeaders":
      case "missingColumns":
      case "limitExceeded":
      case "duplicates":
      case "allZero":
        setParseError(results.error.kind);
        return;
      default:
        setParseError("");
    }

    if (results.invalidEntries?.length) {
      setError(currentStep, { step: currentStep, message: "entries" });
      setParseError("invalidEntries");
      return;
    } else {
      setError(currentStep, { step: currentStep, message: "" });
      setUploadSuccess(true);
    }

    const validEntries = Object.entries(results.data).map(([address, votes]) => ({
      address,
      votes: String(votes),
      error: null,
    }));

    const invalidEntries = results.invalidEntries.map(({ address, votes, error }) => ({
      address,
      votes: String(votes),
      error,
    }));

    const allNewEntries = [...invalidEntries, ...validEntries];
    onChange?.(allNewEntries);
    setRoundedZeroCount(results.roundedZeroCount);
  };

  return (
    <div className="flex flex-col gap-4">
      <FileUpload onFileSelect={onFileSelectHandler} type="csv" isSuccess={uploadSuccess} />
      <CSVParseError type={parseError} step="voting" />
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
