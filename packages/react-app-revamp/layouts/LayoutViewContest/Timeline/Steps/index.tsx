import { format } from "date-fns";
import { useStore } from "@hooks/useProviderContest";
import styles from "./styles.module.css";
// - Contest status
// 0: Voting open
// 1: Contest cancelled
// 2: Submissions open
// 3: Completed

export const Steps = () => {
  const stateContest = useStore();
  return (
    <ol
      className={`${styles.stepper} relative md:text-xs flex pb-3 mt-3 space-y-4 flex-col`}
      style={{
        // @ts-ignore
        "--stepperLineIndicatorHeight": `${
          stateContest.contestStatus === 2 ? "33" : stateContest.contestStatus === 1 ? "0" : "66"
        }%`,
      }}
    >
      <li className={`${styles.step} ${stateContest.contestStatus === 1 ? "text-neutral-11" : "text-secondary-11"}`}>
        <div className="flex flex-col">
          <span className="font-bold">{format(stateContest.submissionsOpen, "PPP p")}</span>{" "}
          <span>Submissions open</span>
        </div>
      </li>
      <li
        className={`${styles.step} ${
          stateContest.contestStatus === 0 || stateContest.contestStatus === 3 ? "text-secondary-11" : "text-neutral-11"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-bold">{format(stateContest.votesOpen, "PPP p")}</span> <span>voting opens</span>
        </div>
      </li>
      <li className={`${styles.step} ${stateContest.contestStatus === 3 ? "text-secondary-11" : "text-neutral-11"}`}>
        <div className="flex flex-col">
          <span className="font-bold">{format(stateContest.votesClose, "PPP p")}</span> <span>voting closes</span>
        </div>
      </li>
    </ol>
  );
};

export default Steps;
