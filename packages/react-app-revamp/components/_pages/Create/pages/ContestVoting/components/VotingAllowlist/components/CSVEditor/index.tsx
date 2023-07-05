import FileUpload from "@components/_pages/Create/components/FileUpload";
import { EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { validateVotingFields } from "@components/_pages/Create/utils/csv";
import { parseCsvVoting } from "@helpers/parseVotingCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import CSVParseError, { ParseError } from "./CSVParseError";
import ScrollableTableBody from "./TableBody";

export type VotingFieldObject = {
  address: string;
  votes: string;
  error: "address" | "votes" | "both" | null;
};

type CSVEditorProps = {
  onChange?: (fields: Array<VotingFieldObject>) => void;
  onErrorChange?: (error: string) => void;
};

const CSVEditorVoting: FC<CSVEditorProps> = ({ onChange }) => {
  const {
    votingAllowlistFields: fields,
    setVotingAllowlistFields: setFields,
    setVotingMerkle,
    setError,
    step,
    errors,
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
  const updateFields = (newFields: Array<VotingFieldObject>, isDeleting = false) => {
    if (newFields.length === 100) {
      newFields.push(EMPTY_FIELDS_VOTING);
    }
    if (newFields.length < 100 && !isDeleting) {
      newFields.push(EMPTY_FIELDS_VOTING);
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
      const [address = "", votes = ""] = line.split("\t").map(str => str.trim());
      const error = validateVotingFields(address, votes);

      // Update the field at the specified index if it exists, or create a new field
      if (index + lineIndex < newFields.length) {
        newFields[index + lineIndex] = { address, votes, error };
      } else {
        newFields.push({ address, votes, error });
      }
    });

    updateFields(newFields);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const fieldToChange = fields[index];

    // Create a new field object with the changed value
    const updatedField = { ...fieldToChange, [field]: value };

    const error = validateVotingFields(updatedField.address, updatedField.votes);

    // Add error to the new field object
    updatedField.error = error;

    // Replace the old field object with the new one in the array
    const updatedFields = [...fields.slice(0, index), updatedField, ...fields.slice(index + 1)];

    onChange?.(updatedFields);

    setFields(updatedFields);
  };

  const addEmptyFields = () => {
    updateFields(Array(15).fill(EMPTY_FIELDS_VOTING));
  };

  const clearFields = () => {
    updateFields(Array(15).fill(EMPTY_FIELDS_VOTING));
    setVotingMerkle(null);
    setError(currentStep, { step: currentStep, message: "" });
    setUploadSuccess(false);
  };

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvVoting(file);

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
      case "over18Decimal":
        setParseError("over18Decimal");
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

    let currentEntries = fields;

    currentEntries = currentEntries.filter(field => field.address !== "" || field.votes !== "");

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
            <th className="w-2/3 py-2 uppercase">Address</th>
            <th className="w-1/3 py-2 uppercase">
              <div className="flex items-center justify-between">
                <span className="uppercase">Number of Votes</span>
                {fields.some(field => field.address !== "" || field.votes !== "") && (
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
      <CSVParseError type={parseError} step="voting" />
      {fields.some(field => field.address !== "" || field.votes !== "") ? (
        <p className="italic text-neutral-11 text-[16px]">
          Only first 100 entries of allowlist are visible to preview and edit
        </p>
      ) : (
        <div className="flex flex-col text-[16px] mt-5">
          <p className="text-primary-10 font-bold">Prefer to upload a CSV?</p>
          <p className="text-neutral-11">
            CSV should contain addresses in column <span className="uppercase">A</span> and number of votes in column{" "}
            <span className="uppercase">B</span> (no headers or additional columns).
          </p>
        </div>
      )}

      <div className="mt-5">
        <FileUpload onFileSelect={onFileSelectHandler} type="csv" step={currentStep} isSuccess={uploadSuccess} />
      </div>
    </div>
  );
};

export default CSVEditorVoting;
