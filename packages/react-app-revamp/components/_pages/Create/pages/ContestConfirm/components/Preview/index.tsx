import { EntryPreview, EntryPreviewConfig } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";
import { useMediaQuery } from "react-responsive";
interface CreateContestConfirmPreviewProps {
  entryPreviewConfig: EntryPreviewConfig;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmPreview: FC<CreateContestConfirmPreviewProps> = ({ entryPreviewConfig, step, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div
        className={`flex flex-col gap-4 ${
          isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"
        } transition-colors duration-300`}
      >
        <p className="text-[16px] font-bold">entries:</p>
        <ul className="flex flex-col pl-8">
          <li className="text-[16px] list-disc">
            preview:{" "}
            {Object.keys(EntryPreview).find(
              key => EntryPreview[key as keyof typeof EntryPreview] === entryPreviewConfig.preview,
            )}
          </li>
          <li className="text-[16px] list-disc">
            option description enabled: {entryPreviewConfig.isAdditionalDescriptionEnabled ? "yes" : "no"}
          </li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmPreview;
