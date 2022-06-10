import { useStore } from "@hooks/useProviderContest";
import isWithinInterval from "date-fns/isWithinInterval";
import Countdown from "./Countdown";
import Steps from "./Steps";

export const Timeline = () => {
  const stateContest = useStore();

  return (
    <>
      {isWithinInterval(new Date(), {
        start: stateContest.submissionsOpen,
        end: stateContest.votesOpen,
      }) && (
        <div className="animate-appear mb-4 md:mb-6">
          <Countdown />
        </div>
      )}
      <div className="animate-appear">
        <Steps />
      </div>
    </>
  );
};

export default Timeline;
