import shallow from "zustand/shallow";
import { useStore } from "@hooks/useContest/store";
import { useCountdown } from "@hooks/useCountdown";
import styles from "./styles.module.css";
import { isBefore } from "date-fns";

export const Countdown = () => {
  const { submissionsOpen, votesOpen, votesClose } = useStore(
    state => ({
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
    }),
    shallow,
  );

  const countdownUntilSubmissionsOpen = useCountdown(new Date(), submissionsOpen);
  const countdownUntilVotingOpen = useCountdown(submissionsOpen, votesOpen);
  const countdownUntilVotingClose = useCountdown(votesOpen, votesClose);

  if (countdownUntilSubmissionsOpen.isCountdownRunning) {
    return (
      <>
        <p className={styles.label}>Submissions open in</p>
        <div className={styles.countdown}>
          {Object.keys(countdownUntilSubmissionsOpen.countdown).map((unit: string) => (
            <div className={styles.wrapperUnit} key={`countdown-submissions-open-${unit}`}>
              {/*@ts-ignore */}
              <span className={styles.unitValue}>{countdownUntilSubmissionsOpen.countdown[unit]}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (countdownUntilVotingOpen.isCountdownRunning || isBefore(new Date(), votesOpen)) {
    return (
      <>
        <p className={styles.label}>Voting opens in</p>
        <div className={styles.countdown}>
          {Object.keys(countdownUntilVotingOpen.countdown).map((unit: string) => (
            <div className={styles.wrapperUnit} key={`countdown-voting-open-${unit}`}>
              {/*@ts-ignore */}
              <span className={styles.unitValue}>{countdownUntilVotingOpen.countdown[unit]}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (countdownUntilVotingClose.isCountdownRunning || isBefore(new Date(), votesClose)) {
    return (
      <>
        <p className={`text-sm font-bold text-center text-negative-11`}>Submissions closed</p>
        <p className={styles.label}>Voting closes in</p>
        <div className={styles.countdown}>
          {Object.keys(countdownUntilVotingClose.countdown).map((unit: string) => (
            <div className={styles.wrapperUnit} key={`countdown-voting-closes-${unit}`}>
              {/*@ts-ignore */}
              <span className={styles.unitValue}>{countdownUntilVotingClose.countdown[unit]}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return <p className={`text-sm font-bold text-center text-neutral-11`}>Voting closed</p>;
};

export default Countdown;
