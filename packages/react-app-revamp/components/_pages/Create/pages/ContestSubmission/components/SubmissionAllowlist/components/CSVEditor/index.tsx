/* eslint-disable react-hooks/exhaustive-deps */
import { EMPTY_FIELDS_SUBMISSION } from "@components/_pages/Create/constants/csv";
import { validateSubmissionFields } from "@components/_pages/Create/utils/csv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import React, { FC, useEffect } from "react";
import { useAccount } from "wagmi";
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
  const currentStep = step + 1;

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
    setSubmissionMerkle("manual", null);
    setError(currentStep, { step: currentStep, message: "" });
  };

  const addEmptyFields = () => {
    updateFields(Array(15).fill(EMPTY_FIELDS_SUBMISSION));
  };

  const handleDelete = (index: number) => {
    const newFields = [...fields];

    newFields.splice(index, 1);

    updateFields(newFields, true);
  };

  return (
    <div className="flex flex-col gap-2">
      <table className="table-fixed border-collapse border-b border-dotted border-neutral-9 w-full md:w-[600px] text-left">
        <thead>
          <tr className="text-[16px] font-bold">
            <th className="py-2 uppercase ">
              <div className="flex items-center justify-between">
                <p className="uppercase">
                  Address <span className="normal-case">(starting with 0x)</span>
                </p>
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
    </div>
  );
};

export default CSVEditorSubmission;
