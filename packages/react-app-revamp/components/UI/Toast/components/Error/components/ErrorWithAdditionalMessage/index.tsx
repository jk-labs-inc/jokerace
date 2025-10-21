import { FC } from "react";

interface ErrorToastWithAdditionalMessageProps {
  message: string;
  additionalMessage: string;
}

const ErrorToastWithAdditionalMessage: FC<ErrorToastWithAdditionalMessageProps> = ({ message, additionalMessage }) => {
  return (
    <div className="flex items-center pl-3 md:pl-6">
      <img className="hidden md:block mr-4" src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-medium">{message}</p>
        {additionalMessage && <p className="text-[11px]">{additionalMessage}</p>}
      </div>
    </div>
  );
};

export default ErrorToastWithAdditionalMessage;
