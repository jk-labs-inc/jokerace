import FileUpload from "@components/_pages/Create/components/FileUpload";
import CSVParseError, {
  ParseError,
} from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor/CSVParseError";
import { parseSubmissionCsv } from "@helpers/parseSubmissionsCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { SubmissionFieldObject } from "../../../SubmissionAllowlist/components/CSVEditor";

interface SubmissionCSVFileUploaderProps {
  onChange?: (fields: Array<SubmissionFieldObject>) => void;
}

const SubmissionCSVFileUploader: FC<SubmissionCSVFileUploaderProps> = ({ onChange }) => {
  const { submissionAllowlistFields: fields, setError, step } = useDeployContestStore(state => state);
  const currentStep = step + 1;
  const { address } = useAccount();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [parseError, setParseError] = useState<ParseError>("");

  const onFileSelectHandler = async (file: File) => {
    const results = await parseSubmissionCsv(file, address);

    switch (results.error?.kind) {
      case "unexpectedHeaders":
      case "missingColumns":
      case "limitExceeded":
      case "duplicates":
        setParseError(results.error?.kind);
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
    // Get current entries
    let currentEntries = fields;

    // Filter out the empty fields
    currentEntries = currentEntries.filter(field => field.address !== "");
    const validEntries = results.data.map(address => ({
      address,
      error: false,
    }));

    onChange?.(validEntries);
  };

  return (
    <div className="flex flex-col gap-4">
      <FileUpload onFileSelect={onFileSelectHandler} type="csv" isSuccess={uploadSuccess} />
      <CSVParseError type={parseError} step="submission" />
    </div>
  );
};

export default SubmissionCSVFileUploader;
