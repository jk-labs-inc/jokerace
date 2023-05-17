import Image from "next/image";
import React, { useState } from "react";

type TableRowProps = {
  address: string;
  votes: string;
  index: number;
  handlePaste: (index: number, event: React.ClipboardEvent) => void;
  handleChange: (index: number, field: string, value: string) => void;
};

const TableRow: React.FC<TableRowProps> = ({ address, votes, index, handlePaste, handleChange }) => {
  return (
    <tr className="border-b border-dotted border-neutral-9 text-[16px]">
      <td className="border-r border-dotted border-neutral-9 w-3/4">
        <input
          type="text"
          className="w-full bg-transparent outline-none border-none p-0"
          defaultValue={address}
          onPaste={event => handlePaste(index, event)}
          onChange={event => handleChange(index, "address", event.target.value)}
        />
      </td>
      <td className="">
        <input
          type="text"
          className="w-full bg-transparent outline-none border-none p-0"
          defaultValue={votes}
          onChange={event => handleChange(index, "votes", event.target.value)}
        />
      </td>
    </tr>
  );
};

const CSVEditor: React.FC = () => {
  const [fields, setFields] = useState(Array(15).fill({ address: "", votes: "" }));

  const handlePaste = (index: number, event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const lines = pasteData.split("\n");
    const newFields = [...fields];
    lines.forEach((line, lineIndex) => {
      const [address = "", votes = ""] = line.split("\t").map(str => str.trim());
      if (index + lineIndex < newFields.length) {
        newFields[index + lineIndex] = { address, votes };
      } else {
        newFields.push({ address, votes });
      }
    });
    setFields(newFields);
  };

  const handleChange = (index: number, field: string, value: string) => {
    setFields(prevFields =>
      prevFields.map((prevField, i) => {
        if (i !== index) {
          return prevField;
        }
        return { ...prevField, [field]: value };
      }),
    );
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
        <tbody>
          {fields.map((field, index) => (
            <TableRow key={index} {...field} index={index} handlePaste={handlePaste} handleChange={handleChange} />
          ))}
        </tbody>
      </table>
      <div className="flex flex-col text-[16px]">
        <div className="font-bold text-negative-11 flex gap-2 items-center">
          <Image src="/create-flow/trashcan.png" width={18} height={18} alt="trashcan" className="mt-[2px]" />
          clear full allowlist (including entries that aren’t visible)
        </div>
        <p className="italic text-neutral-11">only first 100 entries of allowlist are visible to preview and edit</p>
      </div>
    </div>
  );
};

export default CSVEditor;
