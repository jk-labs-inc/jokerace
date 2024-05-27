import { FC } from "react";

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="h-1 animate-reveal">
      <p className="text-[16px] text-negative-11 font-bold">{error}</p>
    </div>
  );
};

export default ErrorMessage;
