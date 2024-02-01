import ChargeLayout from "@components/ChargeLayout";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FOOTER_LINKS } from "@config/links";
import { emailRegex } from "@helpers/regex";
import { Charge } from "@hooks/useDeployContest/types";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { FetchBalanceResult } from "@wagmi/core";
import { FC, useState } from "react";

interface SendProposalMobileLayoutConfirmInitialContentProps {
  charge: Charge | null;
  accountData: FetchBalanceResult | undefined;
  onConfirm?: () => void;
}

const SendProposalMobileLayoutConfirmInitialContent: FC<SendProposalMobileLayoutConfirmInitialContentProps> = ({
  charge,
  accountData,
  onConfirm,
}) => {
  const { wantsSubscription, emailForSubscription, setWantsSubscription, setEmailForSubscription } =
    useSubmitProposalStore(state => state);
  const [emailError, setEmailError] = useState<string | null>(null);
  const insufficientBalance = (accountData?.value ?? 0) < (charge?.type.costToPropose ?? 0);
  const tosHref = FOOTER_LINKS.find(link => link.label === "Terms")?.href;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWantsSubscription(event.target.checked);
    setEmailError(null);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setWantsSubscription(true);
    } else {
      setWantsSubscription(false);
    }
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
      {charge && charge.type.costToPropose && accountData ? (
        <ChargeLayout charge={charge} accountData={accountData} type="propose" />
      ) : null}
      <div className="flex flex-col gap-4 mt-4">
        {!insufficientBalance ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <label className="checkbox-container">
                <input type="checkbox" checked={wantsSubscription} onChange={handleCheckboxChange} />
                <span className="checkmark"></span>
              </label>
              <p className="text-[16px] text-neutral-9">i’d like to get updates on contests</p>
            </div>
            <div className="flex flex-col gap-1 -mx-4">
              <input
                type="text"
                className="w-full rounded-[40px] h-8 bg-true-black border border-neutral-9 indent-4 placeholder-neutral-7 focus:outline-none submission-subscription-input"
                placeholder="myemail@email.com"
                onChange={handleEmailChange}
              />
              {emailError ? (
                <p className="text-[14px] text-negative-11 font-bold pl-2 mt-2">{emailError}</p>
              ) : (
                <p className="ml-4 opacity-50 text-neutral-11 text-[12px]">
                  by giving your email, you agree to share it with the contest <br />
                  creator and jk labs, inc., according to{" "}
                  <a
                    className="text-positive-11 hover:text-positive-10"
                    href={tosHref}
                    rel="nofollow noreferrer"
                    target="_blank"
                  >
                    our privacy policy
                  </a>
                </p>
              )}
            </div>
          </div>
        ) : null}
        <div className="mt-12">
          <ButtonV3
            colorClass="bg-gradient-vote rounded-[40px]"
            size={ButtonSize.FULL}
            onClick={handleConfirm}
            isDisabled={insufficientBalance}
          >
            submit!
          </ButtonV3>
        </div>
      </div>
    </>
  );
};

export default SendProposalMobileLayoutConfirmInitialContent;
