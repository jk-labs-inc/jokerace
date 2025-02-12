import EmailSubscription from "@components/UI/EmailSubscription";
import { FC } from "react";

interface CreateContestConfirmEmailSubscriptionProps {
  emailError: string | null;
  emailSubscriptionAddress: string;
  tosHref?: string;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateContestConfirmEmailSubscription: FC<CreateContestConfirmEmailSubscriptionProps> = ({
  emailError,
  emailSubscriptionAddress,
  tosHref,
  handleEmailChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] text-neutral-11 font-bold">
        get updates by email <span className="text-[12px] font-normal">(optional)</span>
      </p>
      <EmailSubscription
        emailError={emailError}
        emailForSubscription={emailSubscriptionAddress}
        tosHref={tosHref}
        handleEmailChange={handleEmailChange}
      />
    </div>
  );
};

export default CreateContestConfirmEmailSubscription;
