import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { FC } from "react";

interface SendProposalMobileLayoutConfirmInitialContentProps {
  onConfirm?: () => void;
}

const SendProposalMobileLayoutConfirmInitialContent: FC<SendProposalMobileLayoutConfirmInitialContentProps> = ({
  onConfirm,
}) => {
  const { wantsSubscription, setWantsSubscription, setEmailForSubscription } = useSubmitProposalStore(state => state);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWantsSubscription(event.target.checked);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForSubscription(event.target.value);
  };

  return (
    <>
      <div className="flex gap-4">
        <input
          checked={wantsSubscription}
          onChange={handleCheckboxChange}
          type="checkbox"
          className="w-6 h-6 rounded-[4px] border-neutral-9 border bg-true-black"
        />
        <p className="text-[16px] text-neutral-9">notify me to get updates on contests</p>
      </div>
      <div>
        <input
          type="text"
          className="w-full rounded-[40px] h-8 bg-true-black border border-neutral-9 indent-4 placeholder-neutral-9 focus:outline-none submission-subscription-input"
          placeholder="myemail@email.com"
          onChange={handleEmailChange}
        />
      </div>
      <ButtonV3 colorClass="bg-gradient-vote rounded-[40px] mt-16" size={ButtonSize.FULL} onClick={onConfirm}>
        submit!
      </ButtonV3>
    </>
  );
};

export default SendProposalMobileLayoutConfirmInitialContent;
