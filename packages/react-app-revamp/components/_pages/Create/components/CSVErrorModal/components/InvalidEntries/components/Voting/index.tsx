import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { VotingFieldObject } from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor";
import ScrollableTableBody from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor/TableBody";
import { validateVotingFields } from "@components/_pages/Create/utils/csv";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

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
  const allFieldsWithoutErrors = fields.every(field => !field.error);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const addressRowTitle = isMobile ? "ADDRESS (starting 0x)" : "ADDRESS (starting with 0x)";
  const votesRowTitle = isMobile ? "VOTES" : "NUMBER OF VOTES";

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

    lines.forEach((line, lineIndex) => {
      const [address = "", votes = ""] = line.split("\t").map(str => str.trim());
      const error = validateVotingFields(address, votes);

      if (index + lineIndex < newFields.length) {
        newFields[index + lineIndex] = { address, votes, error };
      } else {
        newFields.push({ address, votes, error });
      }
    });

    onChange?.(newFields);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const fieldToChange = fields[index];
    const updatedField = { ...fieldToChange, [field]: value };

    const error = validateVotingFields(updatedField.address, updatedField.votes);

    updatedField.error = error;

    let updatedAllEntries = [...fields.slice(0)];
    updatedAllEntries[index] = updatedField;

    onChange?.(updatedAllEntries);
  };

  const handleDelete = (index: number) => {
    let newAllEntries = fields.filter((_, i) => i !== index);
    onChange?.(newAllEntries);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-neutral-8 bg-opacity-60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
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
                          <th className="w-2/3 py-2 normal-case">{addressRowTitle}</th>
                          <th className="md:w-1/3 py-2 uppercase">
                            <div className="flex items-center justify-between">
                              <span className="normal-case">{votesRowTitle}</span>
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
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default CSVErrorModalInvalidEntriesVoting;
