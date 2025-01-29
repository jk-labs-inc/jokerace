import { ButtonSize } from "@components/UI/ButtonV3";
import ButtonV3 from "@components/UI/ButtonV3";
import { FC } from "react";

interface EntryNavigationProps {
  currentIndex: number;
  totalProposals: number;
  isProposalLoading: boolean;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
}

const EntryNavigation: FC<EntryNavigationProps> = ({
  currentIndex,
  totalProposals,
  isProposalLoading,
  onPreviousEntry,
  onNextEntry,
}) => {
  return (
    <>
      {currentIndex !== 0 && (
        <ButtonV3
          colorClass="bg-primary-2"
          textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[12px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
          size={ButtonSize.DEFAULT}
          onClick={onPreviousEntry}
          isDisabled={isProposalLoading}
        >
          <div className="transition-transform duration-200 group-hover:-translate-x-1">
            <img src="/contest/previous-entry.svg" alt="prev-entry" width={14} height={12} className="mt-1" />
          </div>
          prev entry
        </ButtonV3>
      )}
      {currentIndex !== totalProposals - 1 && (
        <ButtonV3
          colorClass="bg-primary-2"
          textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[12px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
          size={ButtonSize.DEFAULT}
          onClick={onNextEntry}
          isDisabled={isProposalLoading}
        >
          next entry
          <div className="transition-transform duration-200 group-hover:translate-x-1">
            <img src="/contest/next-entry.svg" alt="prev-entry" width={14} height={12} className="mt-[3px]" />
          </div>
        </ButtonV3>
      )}
    </>
  );
};

export default EntryNavigation;
