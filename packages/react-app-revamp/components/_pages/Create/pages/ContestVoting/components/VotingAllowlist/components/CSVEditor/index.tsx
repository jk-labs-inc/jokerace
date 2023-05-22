import FileUpload from "@components/_pages/Create/components/FileUpload";
import { EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { validateVotingFields } from "@components/_pages/Create/utils/csv";
import { parseCsvVoting } from "@helpers/parseVotingCsv";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import React, { FC, useEffect } from "react";
import ScrollableTableBody from "./TableBody";

export type VotingFieldObject = {
  address: string;
  votes: string;
  error: "address" | "votes" | "both" | null;
};

type CSVEditorProps = {
  onChange?: (fields: Array<VotingFieldObject>) => void;
};

const CSVEditorVoting: FC<CSVEditorProps> = ({ onChange }) => {
  const { votingAllowlistFields: fields, setVotingAllowlistFields: setFields } = useDeployContestStore(state => state);

  // If user clean the fields, reset the state
  useEffect(() => {
    if (fields.length) return;

    updateFields(Array(15).fill(EMPTY_FIELDS_VOTING));
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
      console.log("You can only paste up to 100 rows at a time.");
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
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };

    const error = validateVotingFields(newFields[index].address, newFields[index].votes);

    newFields[index] = { ...newFields[index], error };

    onChange?.(newFields);

    setFields(newFields);
  };

  const clearFields = () => updateFields(Array(15).fill(EMPTY_FIELDS_VOTING));

  const onFileSelectHandler = async (file: File) => {
    const results = await parseCsvVoting(file);
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
            <th className="w-1/4 py-2 uppercase">Number of Votes</th>
          </tr>
        </thead>
        <ScrollableTableBody
          fields={fields.slice(0, 100)}
          handlePaste={handlePaste}
          handleChange={handleChange}
          handleDelete={handleDelete}
        />
      </table>
      {fields.some(field => field.address !== "" || field.votes !== "") ? (
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
            csv should contain addresses in column <span className="uppercase">A</span> and number of votes in column{" "}
            <span className="uppercase">B</span> (no <br />
            headers or additional columns).
          </p>
        </div>
      )}
      <div className="mt-5">
        <FileUpload onFileSelect={onFileSelectHandler} type="csv" />
      </div>
    </div>
  );
};

export default CSVEditorVoting;
