/* eslint-disable react-hooks/exhaustive-deps */
import FileUpload from "@components/_pages/Create/components/FileUpload";
import { EMPTY_FIELDS_SUBMISSION } from "@components/_pages/Create/constants/csv";
import CSVParseError, {
  ParseError,
} from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor/CSVParseError";
import { validateSubmissionFields } from "@components/_pages/Create/utils/csv";
import { parseCsvSubmissions } from "@helpers/parseSubmissionsCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import ScrollableTableBody from "./TableBody";

export type SubmissionFieldObject = {
  address: string;
  error: boolean;
};

type CSVEditorProps = {
  onChange?: (fields: Array<SubmissionFieldObject>) => void;
};

const CSVEditorSubmission: FC<CSVEditorProps> = ({ onChange }) => {
  const {
    submissionAllowlistFields: fields,
    setSubmissionAllowlistFields: setFields,
    setSubmissionMerkle,
    errors,
    setError,
    step,
  } = useDeployContestStore(state => state);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const currentStep = step + 1;
  const [parseError, setParseError] = useState<ParseError>("");

  // If user clean the fields, reset the state
  useEffect(() => {
    if (fields.length) return;

    addEmptyFields();
  }, [fields]);

  // Update state and propagate changes to parent component
  const updateFields = (newFields: Array<SubmissionFieldObject>, isDeleting = false) => {
    if (newFields.length === 100) {
      newFields.push(EMPTY_FIELDS_SUBMISSION);
    }
    if (newFields.length < 100 && !isDeleting) {
      newFields.push(EMPTY_FIELDS_SUBMISSION);
    }
    setFields(newFields);
    onChange?.(newFields);
  };

  const handlePaste = (index: number, event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const lines = pasteData.split("\n");

    if (lines.length > 100) {
      return;
    }

    let newFields = [...fields]; // Create a copy of the fields array

    lines.forEach((line, lineIndex) => {
      const address = line.trim();
      const error = validateSubmissionFields(address);

      if (index + lineIndex < newFields.length) {
        newFields[index + lineIndex] = { address, error };
      } else {
        newFields.push({ address, error });
      }
    });

    updateFields(newFields);
  };

  const handleChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = { address: value, error: validateSubmissionFields(value) };
    onChange?.(newFields);
    setFields(newFields);
  };

  const clearFields = () => {
    addEmptyFields();
    setSubmissionMerkle(null);
    setError(currentStep, { step: currentStep, message: "" });
    setUploadSuccess(false);
  };

  const addEmptyFields = () => {
    updateFields(Array(15).fill(EMPTY_FIELDS_SUBMISSION));
  };

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvSubmissions(file);

    switch (results.error?.kind) {
      case "missingColumns":
        setParseError("missingColumns");
        addEmptyFields();
        return;
      case "limitExceeded":
        setParseError("limitExceeded");
        addEmptyFields();
        return;
      case "duplicates":
        setParseError("duplicates");
        addEmptyFields();
        return;
      default:
        setParseError("");
    }

    if (results.invalidEntries?.length) {
      setError(currentStep, { step: currentStep, message: "entries" });
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

    const invalidEntries = results.invalidEntries.map(({ address, error }) => ({
      address,
      error,
    }));

    // Prepend invalid entries to the existing ones and then append valid entries
    updateFields([...invalidEntries, ...currentEntries, ...validEntries]);
  };

  const handleDelete = (index: number) => {
    const newFields = [...fields];

    newFields.splice(index, 1);

    updateFields(newFields, true);
  };

  return (
    <div className="flex flex-col gap-2">
      <table className="table-fixed border-collapse border-b border-dotted border-neutral-9 w-[300px] md:w-[600px] text-left">
        <thead>
          <tr className="text-[16px] font-bold">
            <th className="py-2 uppercase ">
              <div className="flex items-center justify-between">
                <span className="uppercase">Address</span>
                {fields.some(field => field.address !== "") && (
                  <Image
                    src="/create-flow/trashcan.png"
                    width={18}
                    height={18}
                    alt="trashcan"
                    className="cursor-pointer"
                    onClick={clearFields}
                  />
                )}
              </div>
            </th>
          </tr>
        </thead>
        <ScrollableTableBody
          fields={fields.slice(0, 100)}
          handlePaste={handlePaste}
          handleChange={handleChange}
          handleDelete={handleDelete}
        />
      </table>
      <CSVParseError type={parseError} step="submission" />
      {fields.some(field => field.address !== "") ? (
        <p className="italic text-neutral-11 text-[16px] ">
          only first 100 entries of allowlist are visible to preview and edit
        </p>
      ) : (
        <div className="flex flex-col text-[16px] mt-5">
          <p className="text-primary-10 font-bold">prefer to upload a csv?</p>
          <p className="text-neutral-11">
            csv should contain addresses in column <span className="uppercase">A</span> (no <br />
            headers or additional columns).
          </p>
        </div>
      )}
      <div className="mt-5">
        <FileUpload onFileSelect={onFileSelectHandler} type="csv" step={currentStep} isSuccess={uploadSuccess} />
      </div>
    </div>
  );
};

export default CSVEditorSubmission;
