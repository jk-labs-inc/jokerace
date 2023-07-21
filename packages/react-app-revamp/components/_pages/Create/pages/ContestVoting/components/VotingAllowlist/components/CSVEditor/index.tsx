import FileUpload from "@components/_pages/Create/components/FileUpload";
import { EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { validateVotingFields } from "@components/_pages/Create/utils/csv";
import { parseCsvVoting } from "@helpers/parseVotingCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { cloneDeep } from "lodash";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import CSVParseError, { ParseError } from "./CSVParseError";
import ScrollableTableBody from "./TableBody";

export type VotingFieldObject = {
  address: string;
  votes: string;
  error: "address" | "votes" | "both" | "exceededLimit" | null;
};

type CSVEditorProps = {
  onChange?: (fields: Array<VotingFieldObject>) => void;
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
  const [allEntries, setAllEntries] = useState<Array<VotingFieldObject>>([]);
  const [roundedZeroCount, setRoundedZeroCount] = useState<number | undefined>(0);
  const currentStepError = errors.find(error => error.step === currentStep);
  const entriesError = currentStepError?.message === "entries";

  useEffect(() => {
    if (fields.length) return;
    addEmptyFields();
  }, [fields]);

  const updateFields = (newFields: Array<VotingFieldObject>, isDeleting = false) => {
    let tempFields = cloneDeep(newFields);
    if (isDeleting) {
      while (tempFields.length < 100) {
        tempFields.push(EMPTY_FIELDS_VOTING);
      }
    } else {
      if (tempFields.length === 100) {
        tempFields.push(EMPTY_FIELDS_VOTING);
      }
      if (tempFields.length < 100) {
        tempFields.push(EMPTY_FIELDS_VOTING);
      }
    }
    setFields(tempFields);
    onChange?.(tempFields);
  };

  const handlePaste = (index: number, event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const lines = pasteData.split("\n");

    if (lines.length > 100) {
      return;
    }

    let newFields = [...fields.slice(0)];
    let newAllEntries = [...allEntries.slice(0)];

    lines.forEach((line, lineIndex) => {
      const [address = "", votes = ""] = line.split("\t").map(str => str.trim());
      const error = validateVotingFields(address, votes);

      if (index + lineIndex < newFields.length) {
        newFields[index + lineIndex] = { address, votes, error };
        newAllEntries[index + lineIndex] = { address, votes, error };
      } else {
        newFields.push({ address, votes, error });
        newAllEntries.push({ address, votes, error });
      }
    });

    setAllEntries(newAllEntries);
    setFields(newFields.slice(0, 100));
    onChange?.(newAllEntries);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const fieldToChange = fields[index];
    const updatedField = { ...fieldToChange, [field]: value };

    const error = validateVotingFields(updatedField.address, updatedField.votes);

    updatedField.error = error;
    let updatedFields = [...fields.slice(0, index), updatedField, ...fields.slice(index + 1)];

    let updatedAllEntries = [...allEntries.slice(0)];
    updatedAllEntries[index] = updatedField;

    setFields(updatedFields);
    setAllEntries(updatedAllEntries);
    onChange?.(updatedAllEntries);
  };

  const addEmptyFields = () => {
    const emptyFields = Array(15).fill(EMPTY_FIELDS_VOTING);
    updateFields(emptyFields);
    setAllEntries(emptyFields);
  };

  const clearFields = () => {
    addEmptyFields();
    setVotingMerkle(null);
    setError(currentStep, { step: currentStep, message: "" });
    setUploadSuccess(false);
  };

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvVoting(file);

    switch (results.error?.kind) {
      case "missingColumns":
      case "limitExceeded":
      case "duplicates":
      case "allZero":
        setParseError(results.error.kind);
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
    setAllEntries(allNewEntries);
    onChange?.(allNewEntries);
    setFields(allNewEntries.slice(0, 100));
    setRoundedZeroCount(results.roundedZeroCount);
  };

  const handleDelete = (index: number) => {
    let newFields = [...fields.slice(0)];
    let newAllEntries = [...allEntries.slice(0)];

    if (index < newAllEntries.length) {
      newAllEntries.splice(index, 1);
    }

    newFields.splice(index, 1);

    if (newFields.length < 100) {
      newFields.push(EMPTY_FIELDS_VOTING);
    }
    setAllEntries(newAllEntries);
    setFields(newFields);
    onChange?.(newAllEntries);
  };

  return (
    <div className="flex flex-col gap-2">
      <table className="table-fixed  w-[300px] md:w-[600px] text-left">
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
          fields={fields}
          handlePaste={handlePaste}
          handleChange={handleChange}
          handleDelete={handleDelete}
        />
      </table>
      <CSVParseError type={parseError} step="voting" />
      {fields.some(field => field.address !== "" || field.votes !== "") ? (
        entriesError || fields.some(field => field.error === "exceededLimit") ? (
          <p className="font-bold text-negative-11 text-[16px]">
            Your votes input should be less than 1 billion and no more than 4 decimal places.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="italic text-neutral-11 text-[16px]">
              Only first 100 entries of allowlist are visible to preview and edit <br />
            </p>
            <div>
              {uploadSuccess && (
                <p className="text-neutral-11 text-[16px]">
                  please note: we rounded all entries with more than 4 decimals
                </p>
              )}
              {roundedZeroCount && roundedZeroCount > 0 ? (
                <p className="text-positive-11 text-[16px]">
                  we removed <span className="font-bold">{roundedZeroCount} </span>
                  {roundedZeroCount > 1 ? "entries" : "entry"} that had less than 0.0001 votes
                </p>
              ) : null}
            </div>
          </div>
        )
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
