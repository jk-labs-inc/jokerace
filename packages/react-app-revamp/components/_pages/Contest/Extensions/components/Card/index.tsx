import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";
import { ExtensionMetadata } from "../../types";

interface ExtensionCardProps {
  metadata: ExtensionMetadata;
  disabled?: boolean;
  onClick?: () => void;
}

const ExtensionCard: FC<ExtensionCardProps> = ({ metadata, disabled, onClick }) => {
  const { title, creator, description, buttonLabel } = metadata;
  return (
    <div className="flex flex-col gap-4 w-full md:w-[360px] p-4 border border-neutral-9 rounded-[10px] hover:border-neutral-11 transition-colors duration-300">
      <div className="flex flex-col">
        <p className="text-[20px] font-bold text-neutral-11 normal-case">{title}</p>
        <p className="text-[16px] font-bold text-neutral-14 normal-case">{creator}</p>
      </div>
      <p className="text-[16px] text-neutral-14 normal-case">{description}</p>
      <ButtonV3
        colorClass={`bg-gradient-vote text-[20px] rounded-[30px] font-bold text-true-black pb-2 pt-1 normal-case`}
        size={ButtonSize.EXTRA_LARGE}
        onClick={onClick}
        isDisabled={disabled}
      >
        {buttonLabel}
      </ButtonV3>
    </div>
  );
};

export default ExtensionCard;
