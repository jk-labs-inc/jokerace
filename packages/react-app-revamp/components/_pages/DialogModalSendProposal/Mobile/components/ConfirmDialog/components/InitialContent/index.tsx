import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { emailRegex } from "@helpers/regex";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { FC, useState } from "react";

interface SendProposalMobileLayoutConfirmInitialContentProps {
  onConfirm?: () => void;
}

const SendProposalMobileLayoutConfirmInitialContent: FC<SendProposalMobileLayoutConfirmInitialContentProps> = ({
  onConfirm,
}) => {
  const { wantsSubscription, emailForSubscription, setWantsSubscription, setEmailForSubscription } =
    useSubmitProposalStore(state => state);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWantsSubscription(event.target.checked);
    setEmailError(null);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForSubscription(event.target.value);
    setEmailError(null);
  };

  const handleConfirm = () => {
    if (wantsSubscription && !emailForSubscription) {
      setEmailError("Please enter an email address.");
      return;
    }

    if (!wantsSubscription && emailForSubscription) {
      setEmailError("Please check the box if you want to be notified.");
      return;
    }

    if (emailForSubscription && !emailRegex.test(emailForSubscription)) {
      setEmailError("Invalid email address.");
      return;
    }

    setEmailError(null);
    onConfirm?.();
  };

  return (
    <>
      <div className="flex gap-4">
        <label className="checkbox-container">
          <input type="checkbox" checked={wantsSubscription} onChange={handleCheckboxChange} />
          <span className="checkmark"></span>
        </label>
        <p className="text-[16px] text-neutral-9">notify me to get updates on contests</p>
      </div>
      <div>
        <input
          type="text"
          className="w-full rounded-[40px] h-8 bg-true-black border border-neutral-9 indent-4 placeholder-neutral-9 focus:outline-none submission-subscription-input"
          placeholder="myemail@email.com"
          onChange={handleEmailChange}
        />
        {emailError && <p className="text-[14px] text-negative-11 font-bold pl-2 mt-2">{emailError}</p>}
      </div>
      <ButtonV3 colorClass="bg-gradient-vote rounded-[40px] mt-16" size={ButtonSize.FULL} onClick={handleConfirm}>
        submit!
      </ButtonV3>
    </>
  );
};

export default SendProposalMobileLayoutConfirmInitialContent;
