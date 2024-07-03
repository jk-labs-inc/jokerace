import { Dialog } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { FC, useState } from "react";

interface CSVErrorModalDuplicatesProps {
  addresses: string[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ADDRESSES_LIMIT = 5;

const CSVErrorModalDuplicates: FC<CSVErrorModalDuplicatesProps> = ({ addresses, isOpen, setIsOpen }) => {
  const [copyText, setCopyText] = useState("copy all");
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedAddresses = isExpanded ? addresses : addresses.slice(0, ADDRESSES_LIMIT);

  const handleCopy = async () => {
    try {
      const addressesText = addresses.join(", ");
      await navigator.clipboard.writeText(addressesText);
      setCopyText("copied!");
      setTimeout(() => setCopyText("copy all"), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
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
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-bold text-true-white normal-case">we’re seeing double 👀</p>
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
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-8">
                    <p className="text-[20px] text-neutral-11">we found some addresses featured multiple times.</p>
                    <p className="text-[20px] text-neutral-11">
                      unfortunately, these need to be removed from the csv to <br /> process the allowlist.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleCopy}
                      className="flex gap-1 items-center justify-center w-[104px] h-8 bg-secondary-11 hover:bg-secondary-10 transition-colors duration-300 rounded-[10px] text-[16px] text-true-black font-bold"
                    >
                      <Image src="/create-flow/copy.svg" width={16} height={16} alt="copy" />
                      {copyText}
                    </button>
                    <ul className="flex flex-col pl-8">
                      {displayedAddresses.map((address, index) => (
                        <li key={index} className="text-[16px] text-secondary-11 list-disc normal-case">
                          {address}
                          {index === ADDRESSES_LIMIT - 1 && !isExpanded && addresses.length > ADDRESSES_LIMIT && (
                            <span className="text-neutral-11"> ...</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {addresses.length > ADDRESSES_LIMIT && (
                      <div
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        <p className="text-[16px] font-bold text-positive-11">
                          {isExpanded ? "view less" : "view all"}
                        </p>
                        <ChevronDownIcon
                          className={`w-6 transition-transform duration-300 text-positive-11 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default CSVErrorModalDuplicates;
