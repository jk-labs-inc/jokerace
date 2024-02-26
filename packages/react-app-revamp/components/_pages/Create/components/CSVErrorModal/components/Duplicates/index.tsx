import DialogModalV3 from "@components/UI/DialogModalV3";
import { ChevronDownIcon } from "@heroicons/react/outline";
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
      await navigator.clipboard.writeText(JSON.stringify(addresses));
      setCopyText("copied!");
      setTimeout(() => setCopyText("copy all"), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <DialogModalV3
      isOpen={isOpen}
      title="we’re seeing double 👀"
      className="w-full md:w-[900px] pb-8 pl-20 pr-4"
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <p className="text-[24px] text-neutral-11 font-bold">we’re seeing double 👀 </p>
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
            <div className="flex gap-2 items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
              <p className="text-[16px] font-bold text-positive-11">{isExpanded ? "view less" : "view all"}</p>
              <ChevronDownIcon
                className={`w-6 transition-transform duration-300 text-positive-11 ${isExpanded ? "rotate-180" : ""}`}
              />
            </div>
          )}
        </div>
      </div>
    </DialogModalV3>
  );
};

export default CSVErrorModalDuplicates;
