import useNavigateProposals from "@components/_pages/Submission/hooks/useNavigateProposals";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";

const SubmissionPageDesktopEntryNavigation = () => {
  const { currentIndex, totalProposals, handlePreviousEntry, handleNextEntry } = useNavigateProposals();

  return (
    <div className="flex items-center gap-2">
      {currentIndex !== 0 && (
        <ButtonV3
          colorClass="bg-primary-2"
          textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[12px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
          size={ButtonSize.DEFAULT_LONG}
          onClick={handlePreviousEntry}
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
          size={ButtonSize.DEFAULT_LONG}
          onClick={handleNextEntry}
        >
          next entry
          <div className="transition-transform duration-200 group-hover:translate-x-1">
            <img src="/contest/next-entry.svg" alt="prev-entry" width={14} height={12} className="mt-[3px]" />
          </div>
        </ButtonV3>
      )}
    </div>
  );
};

export default SubmissionPageDesktopEntryNavigation;
