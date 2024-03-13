import { AdvancedOptions, ContestVisibility, CustomizationOptions } from "@hooks/useDeployContest/store";
import { Steps } from "../..";
import { FC, useState } from "react";
import CreateContestConfirmLayout from "../Layout";
import { formatNumber } from "@helpers/formatNumber";
import { useMediaQuery } from "react-responsive";

interface CreateContestConfirmCustomizationProps {
  customization: {
    customization: CustomizationOptions;
    advancedOptions: AdvancedOptions;
  };
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmCustomization: FC<CreateContestConfirmCustomizationProps> = ({
  customization,
  step,
  onClick,
}) => {
  const { customization: customizationOptions, advancedOptions } = customization;
  const [isHovered, setIsHovered] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div className={`flex flex-col gap-4 ${isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"}`}>
        <p className="text-[16px] font-bold">parameters:</p>
        <ul className="flex flex-col pl-8">
          <li className="text-[16px] list-disc">
            {formatNumber(customizationOptions.maxSubmissions)} submission
            {customizationOptions.maxSubmissions !== 1 ? "s" : ""} allowed
          </li>
          <li className="text-[16px] list-disc">
            {formatNumber(customizationOptions.allowedSubmissionsPerUser)} submission
            {customizationOptions.allowedSubmissionsPerUser !== 1 ? "s" : ""} per address
          </li>
          <li className="text-[16px] list-disc">downvoting {advancedOptions.downvote ? "enabled" : "not enabled"}</li>
          <li className="text-[16px] list-disc">
            {advancedOptions.contestVisibility === ContestVisibility.Public ? "public contest" : "unlisted contest"}
          </li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmCustomization;
