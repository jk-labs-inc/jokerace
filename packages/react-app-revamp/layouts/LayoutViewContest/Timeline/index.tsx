import shallow from "zustand/shallow";
import { useStore } from "@hooks/useContest";
import isWithinInterval from "date-fns/isWithinInterval";
import Countdown from "./Countdown";
import Steps from "./Steps";

export const Timeline = () => {
  const { submissionsOpen, votesOpen } = useStore(
    state => ({
      submissionsOpen: state.submissionsOpen,
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
