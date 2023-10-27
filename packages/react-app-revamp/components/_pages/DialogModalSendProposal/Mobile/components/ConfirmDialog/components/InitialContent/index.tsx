import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalSendProposalEntryChargeLayout from "@components/_pages/DialogModalSendProposal/components/EntryCharge";
import { emailRegex } from "@helpers/regex";
import { EntryCharge } from "@hooks/useDeployContest/types";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { FetchBalanceResult } from "@wagmi/core";
import { FC, useState } from "react";

interface SendProposalMobileLayoutConfirmInitialContentProps {
  entryCharge: EntryCharge | null;
  accountData: FetchBalanceResult | undefined;
  onConfirm?: () => void;
}

const SendProposalMobileLayoutConfirmInitialContent: FC<SendProposalMobileLayoutConfirmInitialContentProps> = ({
  entryCharge,
  accountData,
  onConfirm,
}) => {
  const { wantsSubscription, emailForSubscription, setWantsSubscription, setEmailForSubscription } =
    useSubmitProposalStore(state => state);
  const [emailError, setEmailError] = useState<string | null>(null);
  const insufficientBalance = (accountData?.value ?? 0) < (entryCharge?.costToPropose ?? 0);

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
      {entryCharge && entryCharge.costToPropose && accountData ? (
        <DialogModalSendProposalEntryChargeLayout entryCharge={entryCharge} accountData={accountData} />
      ) : null}
      <div className="flex flex-col gap-4 mt-6">
        {!insufficientBalance ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <label className="checkbox-container">
                <input type="checkbox" checked={wantsSubscription} onChange={handleCheckboxChange} />
                <span className="checkmark"></span>
              </label>
              <p className="text-[16px] text-neutral-9 mt-[3px]">notify me to get updates on contests</p>
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
          </div>
        ) : null}

        <ButtonV3
          colorClass="bg-gradient-vote rounded-[40px]"
          size={ButtonSize.FULL}
          onClick={handleConfirm}
          isDisabled={insufficientBalance}
        >
          submit!
        </ButtonV3>
      </div>
    </>
  );
};

export default SendProposalMobileLayoutConfirmInitialContent;
