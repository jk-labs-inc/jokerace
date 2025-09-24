import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { FC } from "react";

interface SubmissionPageDesktopBodyContentInfoCreatorProps {
  authorAddress: string;
}

const SubmissionPageDesktopBodyContentInfoCreator: FC<SubmissionPageDesktopBodyContentInfoCreatorProps> = ({
  authorAddress,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-neutral-9 text-[12px] font-bold uppercase">entry creator</p>
      <UserProfileDisplay ethereumAddress={authorAddress} shortenOnFallback={true} size="compact" textColor="text-positive-11" />
    </div>
  );
};

export default SubmissionPageDesktopBodyContentInfoCreator;
