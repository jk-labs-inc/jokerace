/* eslint-disable react-hooks/exhaustive-deps */
import FileUpload from "@components/_pages/Create/components/FileUpload";
import { EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { validateVotingFields } from "@components/_pages/Create/utils/csv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { cloneDeep } from "lodash";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
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
  const currentStep = step + 1;
  const [allEntries, setAllEntries] = useState<Array<VotingFieldObject>>([]);

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
    setVotingMerkle("manual", null);
    setError(currentStep, { step: currentStep, message: "" });
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
      <table className="table-fixed w-[360px] md:w-[600px] text-left">
        <thead>
          <tr className="text-[16px] font-bold">
            <th className="w-1/2 md:w-2/3 py-2 uppercase">
              Address <span className="normal-case">(starting with 0x)</span>
            </th>
            <th className="w-1/2 md:w-1/3 py-2 uppercase">
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
    </div>
  );
};

export default CSVEditorVoting;
