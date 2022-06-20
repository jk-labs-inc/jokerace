import shallow from "zustand/shallow";
import { useStore } from "@hooks/useContest/store";
import Countdown from "./Countdown";
import Steps from "./Steps";

export const Timeline = () => {
  const { submissionsOpen, votesOpen } = useStore(
    state => ({
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
    }),
    shallow,
  );

  return (
    <>
      <div className="animate-appear mb-4 md:mb-6">
        <Countdown />
      </div>
      <div className="animate-appear">
        <Steps />
      </div>
    </>
  );
};

export default Timeline;
