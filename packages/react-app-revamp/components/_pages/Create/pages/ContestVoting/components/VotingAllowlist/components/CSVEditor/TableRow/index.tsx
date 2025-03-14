import { FC } from "react";
import { VotingFieldObject } from "../../../../VotingUploadCsv/components";

type TableRowProps = VotingFieldObject & {
  index: number;
  handlePaste: (index: number, event: React.ClipboardEvent) => void;
  handleChange: (index: number, field: string, value: string) => void;
  handleDelete: (index: number) => void;
};

const TableRow: FC<TableRowProps> = ({ address, votes, error, index, handlePaste, handleChange, handleDelete }) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === ".") {
      event.preventDefault();
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = event => {
    event.target.value = event.target.value.replace(/[^0-9]*/g, "");
  };

  return (
    <tr className="border-b border-dotted border-neutral-9 text-[16px] group">
      <td
        className={`border-r border-dotted border-neutral-9 w-2/3 ${
          error === "address" || error === "both" ? "text-negative-11" : ""
        }`}
      >
        <input
          type="text"
          className="w-full bg-transparent outline-none border-none p-0 placeholder-neutral-10"
          value={address}
          onPaste={event => handlePaste(index, event)}
          onChange={event => handleChange(index, "address", event.target.value)}
        />
      </td>
      <td
        className={`${
          error === "votes" || error === "both" || error === "exceededLimit" ? "text-negative-11" : ""
        } relative`}
      >
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="w-full bg-transparent outline-none border-none pl-2 placeholder-neutral-10"
            value={votes}
            onChange={event => handleChange(index, "votes", event.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => handleDelete(index)}
          >
            <img src="/create-flow/trashcan.png" width={20} height={20} alt="trashcan" className="mt-[2px]" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
