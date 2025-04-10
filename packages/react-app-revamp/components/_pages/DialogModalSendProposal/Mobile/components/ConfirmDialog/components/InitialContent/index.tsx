import ChargeLayoutSubmission from "@components/ChargeLayout/components/Submission";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import EmailSubscription from "@components/UI/EmailSubscription";
import { FOOTER_LINKS, LINK_BRIDGE_DOCS } from "@config/links";
import { chains } from "@config/wagmi";
import { Switch } from "@headlessui/react";
import { emailRegex } from "@helpers/regex";
import { Charge } from "@hooks/useDeployContest/types";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { type GetBalanceReturnType } from "@wagmi/core";
import { FC, useState } from "react";
import Onramp from "@components/Onramp";

interface SendProposalMobileLayoutConfirmInitialContentProps {
  charge: Charge | null;
  accountData: GetBalanceReturnType | undefined;
  chainName: string;
  onConfirm?: () => void;
  onShowOnramp?: (value: boolean) => void;
}

const SendProposalMobileLayoutConfirmInitialContent: FC<SendProposalMobileLayoutConfirmInitialContentProps> = ({
  charge,
  accountData,
  chainName,
  onConfirm,
  onShowOnramp,
}) => {
  const { wantsSubscription, emailForSubscription, setWantsSubscription, setEmailForSubscription, emailAlreadyExists } =
    useSubmitProposalStore(state => state);
  const [emailError, setEmailError] = useState<string | null>(null);
  const insufficientBalance = (accountData?.value ?? 0) < (charge?.type.costToPropose ?? 0);
  const tosHref = FOOTER_LINKS.find(link => link.label === "Terms")?.href;
  const chainCurrencySymbol = chains.find(chain => chain.name.toLowerCase() === chainName)?.nativeCurrency?.symbol;
  const [showOnramp, setShowOnramp] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setWantsSubscription(checked);
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

  const handleOnRampClose = () => {
    setShowOnramp(false);
    onShowOnramp?.(false);
  };

  const handleOnRampOpen = () => {
    setShowOnramp(true);
    onShowOnramp?.(true);
  };

  return (
    <>
      {showOnramp ? (
        <Onramp chain={chainName} asset={chainCurrencySymbol || ""} onGoBack={handleOnRampClose} />
      ) : (
        <>
          <div className="flex flex-col gap-4 ">
            <div className="flex gap-4 items-center">
              <Switch
                checked={wantsSubscription}
                onChange={handleCheckboxChange}
                className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-secondary-11"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
              <p className="text-[16px] text-neutral-11 font-bold">get updates on contests</p>
            </div>
            {wantsSubscription ? (
              <EmailSubscription
                emailAlreadyExists={emailAlreadyExists ?? false}
                emailError={emailError}
                emailForSubscription={emailForSubscription ?? ""}
                tosHref={tosHref ?? ""}
                handleEmailChange={handleEmailChange}
              />
            ) : null}
          </div>
          {charge && charge.type.costToPropose && accountData ? (
            <ChargeLayoutSubmission charge={charge} accountData={accountData} onAddFunds={handleOnRampOpen} />
          ) : null}

          <div className="flex flex-col gap-2 mt-12">
            {insufficientBalance ? (
              <a
                href={LINK_BRIDGE_DOCS}
                target="_blank"
                className="text-[12px] text-center text-positive-11 opacity-80 hover:opacity-100 transition-colors font-bold leading-loose"
              >
                add {chainCurrencySymbol} to {chainName} to enter contest {">"}
              </a>
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
      )}
    </>
  );
};

export default SendProposalMobileLayoutConfirmInitialContent;
