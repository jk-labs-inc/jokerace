import { FC } from "react";
import Timer from "./components/Timer";
import Image from "next/image";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

interface SubmissionPageDesktopVotingAreaWidgetVotingNotOpenProps {
  timeRemaining: TimeRemaining | null;
}

const SubmissionPageDesktopVotingAreaWidgetVotingNotOpen: FC<
  SubmissionPageDesktopVotingAreaWidgetVotingNotOpenProps
> = ({ timeRemaining }) => {
  return (
    <div className="bg-gradient-voting-area-not-open px-6 pt-12 pb-16 rounded-4xl h-full flex flex-col gap-20">
      <div className="flex flex-col gap-14">
        <p className="text-center font-sabo-filled text-neutral-11 text-[32px] font-bold">voting opens in</p>
        {timeRemaining && <Timer timeRemaining={timeRemaining} />}
      </div>
      <Image
        className="self-center"
        src="/entry/voting-not-open-bubbles.png"
        alt="not-open-image"
        width={300}
        height={200}
      />
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetVotingNotOpen;
