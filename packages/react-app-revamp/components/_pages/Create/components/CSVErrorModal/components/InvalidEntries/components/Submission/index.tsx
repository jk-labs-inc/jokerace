import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { SubmissionFieldObject } from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor";
import ScrollableTableBody from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor/TableBody";
import { validateSubmissionFields } from "@components/_pages/Create/utils/csv";
import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
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
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-neutral-8 bg-opacity-60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex min-h-full w-full items-center justify-center">
          <DialogPanel
            className={`text-sm mx-auto min-h-screen max-h-screen w-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] md:w-[900px] bg-true-black 2xs:rounded-[10px]`}
          >
            <div className="px-6 py-6 md:pl-24 md:pr-14 md:py-10">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-bold text-true-white normal-case">
                      <p className="text-[24px] text-neutral-11 font-bold">we spied some issues 🕵️</p>
                    </p>
                    <Image
                      src="/modal/modal_close.svg"
                      alt="close"
                      width={30}
                      height={24}
                      onClick={() => setIsOpen(false)}
                      className="cursor-pointer hover:scale-[1.1]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
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
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CSVErrorModalInvalidEntriesSubmission;
