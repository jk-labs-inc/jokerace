import Countdown from "./Countdown";
import Steps from "./Steps";

export const Timeline = () => {
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
