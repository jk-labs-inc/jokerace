import FileUpload from "@components/_pages/Create/components/FileUpload";
import { EMPTY_FIELDS_SUBMISSION } from "@components/_pages/Create/constants/csv";
import { validateSubmissionFields } from "@components/_pages/Create/utils/csv";
import DialogModalVoteForProposal from "@components/_pages/DialogModalVoteForProposal";
import { parseCsvSubmissions } from "@helpers/parseSubmissionsCsv";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import ScrollableTableBody from "./TableBody";

export type FieldObject = {
  address: string;
  error: boolean;
};

type CSVEditorProps = {
  onChange?: (fields: Array<FieldObject>) => void;
};

const CSVEditorSubmission: FC<CSVEditorProps> = ({ onChange }) => {
  const [fields, setFields] = useState<Array<FieldObject>>(Array(15).fill(EMPTY_FIELDS_SUBMISSION));

  // If user clean the fields, reset the state
  useEffect(() => {
    if (fields.length) return;

    updateFields(Array(15).fill(EMPTY_FIELDS_SUBMISSION));
  }, [fields]);

  // Update state and propagate changes to parent component
  const updateFields = (newFields: Array<FieldObject>, isDeleting = false) => {
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
      console.log("You can only paste up to 100 rows at a time.");
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
    setFields(prevFields => {
      const newFields = [...prevFields];
      newFields[index] = { address: value, error: validateSubmissionFields(value) };
      onChange?.(newFields);
      return newFields;
    });
  };

  const clearFields = () => updateFields(Array(15).fill(EMPTY_FIELDS_SUBMISSION));

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvSubmissions(file);
    const validEntries = results.data.map(address => ({
      address,
      error: false,
    }));

    const invalidEntries = results.invalidEntries.map(({ address, error }) => ({
      address,
      error,
    }));

    updateFields([...validEntries, ...invalidEntries]);
  };

  const handleDelete = (index: number) => {
    const newFields = [...fields];

    newFields.splice(index, 1);

    updateFields(newFields, true);
  };

  return (
    <div className="flex flex-col gap-2">
      <table className="table-fixed border-collapse border-b border-dotted border-neutral-9 w-full max-w-[600px] text-left">
        <thead>
          <tr className="text-[16px] font-bold">
            <th className="w-3/4 py-2 uppercase ">Address</th>
          </tr>
        </thead>
        <ScrollableTableBody
          fields={fields.slice(0, 100)}
          handlePaste={handlePaste}
          handleChange={handleChange}
          handleDelete={handleDelete}
        />
      </table>
      {fields.some(field => field.address !== "") ? (
        <div className="flex flex-col text-[16px] animate-fadeIn">
          <div
            className="font-bold text-negative-11 flex gap-2 items-center cursor-pointer hover:opacity-85 transition-opacity duration-300"
            onClick={clearFields}
          >
            <Image src="/create-flow/trashcan.png" width={18} height={18} alt="trashcan" className="mt-[2px]" />
            clear full allowlist (including entries that aren’t visible)
          </div>

          <p className="italic text-neutral-11">only first 100 entries of allowlist are visible to preview and edit</p>
        </div>
      ) : (
        <div className="flex flex-col text-[16px] mt-5">
          <p className="text-primary-10 font-bold">prefer to upload a csv?</p>
          <p className="text-neutral-11">
            csv should contain addresses in column <span className="uppercase">A</span> (no headers or additional
            columns).
          </p>
        </div>
      )}
      <div className="mt-5">
        <FileUpload onFileSelect={onFileSelectHandler} type="csv" />
      </div>
    </div>
  );
};

export default CSVEditorSubmission;
