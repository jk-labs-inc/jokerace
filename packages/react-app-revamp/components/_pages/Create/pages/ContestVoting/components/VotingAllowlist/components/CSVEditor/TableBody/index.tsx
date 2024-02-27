import { FC } from "react";
import { VotingFieldObject } from "..";
import TableRow from "../TableRow";

type TableBodyProps = {
  fields: VotingFieldObject[];
  handlePaste: (index: number, event: React.ClipboardEvent) => void;
  handleChange: (index: number, field: string, value: string) => void;
  handleDelete: (index: number) => void;
};

const ScrollableTableBody: FC<TableBodyProps> = ({ fields, handlePaste, handleChange, handleDelete }) => {
  return (
    <div className="overflow-y-auto w-[360px] md:w-[600px]" style={{ maxHeight: "calc(15 * 2rem)" }}>
      <table className="table-fixed w-full text-left">
        <tbody>
          {fields.map((field, index) => (
            <TableRow
              key={index}
              index={index}
              address={field.address}
              votes={field.votes}
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
