import shallow from "zustand/shallow";
import { format } from "date-fns";
import { useStore } from "@hooks/useContest";
import styles from "./styles.module.css";
// - Contest status
// 0: Voting open
// 1: Contest cancelled
// 2: Submissions open
// 3: Completed

export const Steps = () => {
  const { submissionsOpen, votesOpen, votesClose, contestStatus } = useStore(
    state => ({
      //@ts-ignore
      contestStatus: state.contestStatus,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
    }),
    shallow,
  );

  return (
    <ol
      className={`${styles.stepper} relative md:text-xs flex pb-3 mt-3 space-y-4 flex-col`}
      style={{
        // @ts-ignore
        "--stepperLineIndicatorHeight": `${contestStatus === 2 ? "33" : contestStatus === 1 ? "0" : "66"}%`,
      }}
    >
      <li
        className={`${styles.step} ${
          contestStatus === 1
            ? "text-neutral-11"
            : contestStatus === 3
            ? "text-positive-10 text-opacity-75"
            : "text-positive-10"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-bold">{format(submissionsOpen, "PPP p")}</span> <span>Submissions open</span>
        </div>
      </li>
      <li
        className={`${styles.step} ${
          contestStatus === 0
            ? "text-positive-10"
            : contestStatus === 3
            ? "text-positive-10 text-opacity-75"
            : "text-neutral-11"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-bold">{format(votesOpen, "PPP p")}</span> <span>voting opens</span>
        </div>
      </li>
      <li className={`${styles.step} ${contestStatus === 3 ? "text-positive-10" : "text-neutral-11"}`}>
        <div className="flex flex-col">
          <span className="font-bold">{format(votesClose, "PPP p")}</span> <span>voting closes</span>
        </div>
      </li>
    </ol>
  );
};

export default Steps;
