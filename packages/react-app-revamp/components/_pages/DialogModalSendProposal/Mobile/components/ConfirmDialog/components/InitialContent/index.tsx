import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";

interface SendProposalMobileLayoutConfirmInitialContentProps {
  onConfirm?: () => void;
}

const SendProposalMobileLayoutConfirmInitialContent: FC<SendProposalMobileLayoutConfirmInitialContentProps> = ({
  onConfirm,
}) => {
  return (
    <>
      <div className="flex gap-4">
        <input type="checkbox" className="w-6 h-6 rounded-[4px] border-neutral-9 bg-true-black" />
        <p className="text-[16px] text-neutral-9">notify me to get updates on top contests</p>
      </div>
      <div>
        <input
          type="text"
          className="w-full rounded-[40px] h-8 border-neutral-9 indent-4 placeholder-neutral-9 font-bold"
          placeholder="myemail@email.com"
        />
      </div>
      <ButtonV3 colorClass="bg-gradient-vote rounded-[40px] mt-16" size={ButtonSize.FULL} onClick={onConfirm}>
        submit!
      </ButtonV3>
    </>
  );
};

export default SendProposalMobileLayoutConfirmInitialContent;
