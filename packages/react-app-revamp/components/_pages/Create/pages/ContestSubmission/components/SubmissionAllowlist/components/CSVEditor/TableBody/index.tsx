import { FC } from "react";
import { SubmissionFieldObject } from "..";
import TableRow from "../TableRow";

type TableBodyProps = {
  fields: SubmissionFieldObject[];
  handlePaste: (index: number, event: React.ClipboardEvent) => void;
  handleChange: (index: number, value: string) => void;
  handleDelete: (index: number) => void;
};

const ScrollableTableBody: FC<TableBodyProps> = ({ fields, handlePaste, handleChange, handleDelete }) => {
  return (
    <div className="overflow-y-auto w-[360px] md:w-[600px]" style={{ maxHeight: "calc(15 * 2rem)" }}>
      <table className="table-fixed border-collapse border-b border-dotted border-neutral-9 w-full text-left">
        <tbody>
          {fields.map((field, index) => (
            <TableRow
              key={index}
              index={index}
              address={field.address}
              error={field.error}
              handlePaste={handlePaste}
              handleChange={handleChange}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableTableBody;
