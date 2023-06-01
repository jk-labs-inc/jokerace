import { FC } from "react";

interface TipMessageProps {
  tip: React.ReactNode;
  error: string;
}
const TipMessage: FC<TipMessageProps> = ({ tip, error }) => {
  if (error) return null;

  return <div className="mt-2 h-1 text-[16px] text-neutral-11">{tip}</div>;
};

export default TipMessage;
