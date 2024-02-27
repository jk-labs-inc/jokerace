import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import { SubmissionFieldObject } from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor";
import ScrollableTableBody from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor/TableBody";
import { validateSubmissionFields } from "@components/_pages/Create/utils/csv";
import { FC } from "react";

interface CSVErrorModalInvalidEntriesSubmissionProps {
  fields: SubmissionFieldObject[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onChange?: (fields: Array<SubmissionFieldObject>) => void;
  onClick?: () => void;
}

const CSVErrorModalInvalidEntriesSubmission: FC<CSVErrorModalInvalidEntriesSubmissionProps> = ({
  fields,
  isOpen,
  setIsOpen,
  onChange,
  onClick,
}) => {
  const allFieldsWithoutErrors = fields.every(field => !field.error);

  const handlePaste = (index: number, event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const lines = pasteData
      .split("\n")
      .map(line => line.trim())
      .filter(line => line);

    if (lines.length > 100) {
      return;
    }

    let newFields = [...fields];

    lines.forEach((line, lineIndex) => {
      const currentPasteIndex = index + lineIndex;
      const isDuplicate =
        newFields.some((field, idx) => field.address === line && idx !== currentPasteIndex) ||
        lines.slice(lineIndex + 1).includes(line);

      const error = validateSubmissionFields(line) || (isDuplicate ? true : false);

      if (currentPasteIndex < newFields.length) {
        newFields[currentPasteIndex] = { address: line, error };
      } else {
        newFields.push({ address: line, error });
      }
    });

    onChange?.(newFields);
  };

  const handleChange = (index: number, value: string) => {
    const newFields = [...fields];
    const isDuplicate = newFields.some((field, idx) => field.address === value && index !== idx);
    const error = validateSubmissionFields(value) || (isDuplicate ? true : false);

    newFields[index] = { address: value, error };

    onChange?.(newFields);
  };

  const handleDelete = (index: number) => {
    const newFields = [...fields];

    newFields.splice(index, 1);

    onChange?.(newFields);
  };

  const handleReuploadCSV = () => {
    setIsOpen(false);
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
            alas, addresses need to start with “0x”, followed by 40 characters.
          </p>
          <p className="text-[20px] text-neutral-11">
            edit or delete them below—or close this popup to reupload the csv.
          </p>
        </div>
        {fields.length === 0 ? null : (
          <div className="flex flex-col gap-2">
            <table className="table-fixed w-full md:w-[600px] text-left">
              <thead>
                <tr className="text-[16px] font-bold">
                  <th className="py-2 uppercase ">
                    <div className="flex items-center justify-between">
                      <p className="uppercase">
                        Address <span className="normal-case">(starting with 0x)</span>
                      </p>
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

export default CSVErrorModalInvalidEntriesSubmission;
