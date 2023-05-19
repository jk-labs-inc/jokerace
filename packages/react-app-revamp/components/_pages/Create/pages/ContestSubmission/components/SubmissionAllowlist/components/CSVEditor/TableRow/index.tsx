import { FC } from "react";
import Image from "next/image";
import { FieldObject } from "..";

type TableRowProps = FieldObject & {
  index: number;
  handlePaste: (index: number, event: React.ClipboardEvent) => void;
  handleChange: (index: number, value: string) => void;
  handleDelete: (index: number) => void;
};

const TableRow: FC<TableRowProps> = ({ address, error, index, handlePaste, handleChange, handleDelete }) => (
  <tr className="border-b border-dotted border-neutral-9 text-[16px] group">
    <td className={` border-dotted border-neutral-9 w-full ${error ? "text-negative-11" : ""}`}>
      <div className="flex justify-between items-center">
        <input
          type="text"
          className="w-full bg-transparent outline-none border-none p-0"
          value={address}
          onPaste={event => handlePaste(index, event)}
          onChange={event => handleChange(index, event.target.value)}
        />
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          onClick={() => handleDelete(index)}
        >
          <Image src="/create-flow/trashcan.png" width={20} height={20} alt="trashcan" className="mt-[2px]" />
        </div>
      </div>
    </td>
  </tr>
);

export default TableRow;
