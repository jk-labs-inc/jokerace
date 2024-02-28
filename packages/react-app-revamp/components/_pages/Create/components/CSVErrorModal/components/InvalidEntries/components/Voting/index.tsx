import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import { VotingFieldObject } from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor";
import ScrollableTableBody from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor/TableBody";
import { validateVotingFields } from "@components/_pages/Create/utils/csv";
import { FC, useState } from "react";

interface CSVErrorModalInvalidEntriesVotingProps {
  fields: VotingFieldObject[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onChange?: (fields: Array<VotingFieldObject>) => void;
  onClick?: () => void;
}

const CSVErrorModalInvalidEntriesVoting: FC<CSVErrorModalInvalidEntriesVotingProps> = ({
  fields,
  isOpen,
  setIsOpen,
  onChange,
  onClick,
}) => {
  const [allEntries, setAllEntries] = useState<Array<VotingFieldObject>>([]);
  const allFieldsWithoutErrors = fields.every(field => !field.error);

  const handleReuploadCSV = () => {
    setIsOpen(false);
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
    onChange?.(newAllEntries);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const fieldToChange = fields[index];
    const updatedField = { ...fieldToChange, [field]: value };

    const error = validateVotingFields(updatedField.address, updatedField.votes);

    updatedField.error = error;

    let updatedAllEntries = [...allEntries.slice(0)];
    updatedAllEntries[index] = updatedField;

    setAllEntries(updatedAllEntries);

    onChange?.(updatedAllEntries);
  };

  const handleDelete = (index: number) => {
    let newFields = [...fields.slice(0)];
    let newAllEntries = [...allEntries.slice(0)];

    if (index < newAllEntries.length) {
      newAllEntries.splice(index, 1);
    }

    newFields.splice(index, 1);

    setAllEntries(newAllEntries);
    onChange?.(newAllEntries);
  };

  return (
    <DialogModalV3
      isOpen={isOpen}
      title="we spied some issues 🕵️"
      className="w-full md:w-[900px] pb-8 pl-20 pr-4"
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <p className="text-[24px] text-neutral-11 font-bold">we spied some issues 🕵️</p>
          <p className="text-[20px] text-neutral-11">
            alas, addresses need to start with “0x”, followed by 40 characters <br />
            and votes need to be numerical (ie “69”).
          </p>
          <p className="text-[20px] text-neutral-11">
            edit or delete them below—or close this popup to reupload the csv.
          </p>
        </div>
        {fields.length === 0 ? null : (
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
        )}

        <div className="flex flex-col w-40 items-center gap-2 mt-2">
          <ButtonV3
            colorClass={`text-[16px] bg-gradient-next rounded-[10px] font-bold  text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
            size={ButtonSize.DEFAULT_LONG}
            isDisabled={!allFieldsWithoutErrors}
            onClick={onClick}
          >
            next
          </ButtonV3>
          <p
            className="text-[16px] text-neutral-11 cursor-pointer hover:text-neutral-12 transition-colors duration-300"
            onClick={handleReuploadCSV}
          >
            i’ll reupload csv
          </p>
        </div>
      </div>
    </DialogModalV3>
  );
};

export default CSVErrorModalInvalidEntriesVoting;
