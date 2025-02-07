import { FC } from "react";

interface EmailSubscriptionProps {
  emailForSubscription: string;
  emailError?: string | null;
  emailAlreadyExists?: boolean;
  tosHref?: string;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailSubscription: FC<EmailSubscriptionProps> = ({
  emailForSubscription,
  emailError,
  emailAlreadyExists,
  tosHref,
  handleEmailChange,
}) => {
  return (
    <div className="flex flex-col gap-4 animate-appear">
      <div className="flex flex-col gap-1">
        <div className="w-[328px] h-16 bg-true-black rounded-[16px] border-true-black shadow-file-upload p-2">
          <input
            value={emailForSubscription}
            type="text"
            className="text-[16px] w-[312px] h-12 bg-secondary-1 rounded-[16px] indent-4 placeholder-neutral-10 focus:outline-none"
            placeholder="myemail@email.com"
            onChange={handleEmailChange}
          />
        </div>

        {emailError ? (
          <p className="text-[14px] text-negative-11 font-bold pl-2 mt-2">{emailError}</p>
        ) : emailAlreadyExists ? (
          <p className="text-positive-11 text-[12px] font-bold pl-2">your email has already been subscribed! :)</p>
        ) : (
          <p className="opacity-50 text-neutral-11 text-[12px]">
            by sharing your email with jk labs, you agree to{" "}
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
  );
};

export default EmailSubscription;
