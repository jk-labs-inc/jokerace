import { ContestVisibility } from "@hooks/useDeployContest/store";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

interface ContestParamsVisibilityProps {
  contestVisibility: ContestVisibility;
  onChange?: (value: ContestVisibility) => void;
}

const ContestParamsVisibility: FC<ContestParamsVisibilityProps> = ({ contestVisibility, onChange }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const title = isMobile ? "is the contest public?" : "is the contest public or unlisted?";
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">{title}</p>
      <div className="flex flex-col gap-2">
        <div className="flex w-2/3 md:w-[432px] border border-neutral-10 rounded-[25px] overflow-hidden text-[20px]">
          <div
            className={`w-full px-4 py-1 text-center cursor-pointer ${
              contestVisibility === ContestVisibility.Public
                ? "bg-neutral-14 text-true-black font-bold"
                : "bg-true-black text-neutral-11"
            }`}
            onClick={() => onChange?.(ContestVisibility.Public)}
          >
            public
          </div>
          <div
            className={`w-full px-4 py-1 text-center cursor-pointer ${
              contestVisibility === ContestVisibility.Unlisted
                ? "bg-neutral-14 text-true-black font-bold"
                : "bg-true-black text-neutral-11"
            }`}
            onClick={() => onChange?.(ContestVisibility.Unlisted)}
          >
            unlisted
          </div>
        </div>
        <p className="text-[16px] text-neutral-11">
          {contestVisibility === ContestVisibility.Public
            ? "you can always edit if a contest is public or unlisted on your user profile"
            : "unlisted contests can only be found on your profile or by url"}
        </p>
      </div>
    </div>
  );
};

export default ContestParamsVisibility;
