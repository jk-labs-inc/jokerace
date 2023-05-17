import Image from "next/image";
import React from "react";

type TableRowProps = {
  address: string;
  votes: string;
};

const TableRow: React.FC<TableRowProps> = ({ address, votes }) => {
  return (
    <tr className="border-b border-dotted border-neutral-9">
      <td className="border-r border-dotted border-neutral-9 px-4 py-3 w-3/4">{address}</td>
      <td className="px-4 py-2">{votes}</td>
    </tr>
  );
};

const CSVEditor: React.FC = () => {
  const emptyFields = Array(15).fill({ address: "", votes: "" });

  return (
    <div className="flex flex-col gap-2">
      <table className="table-fixed border-collapse border-b  border-dotted border-neutral-9 w-full max-w-[600px] text-left">
        <thead>
          <tr className="text-[16px] font-bold">
            <th className="w-3/4 py-2 uppercase ">Address</th>
            <th className="w-1/4 py-2 uppercase">Number of Votes</th>
          </tr>
        </thead>
        <tbody>
          {emptyFields.map((field, index) => (
            <TableRow key={index} {...field} />
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
