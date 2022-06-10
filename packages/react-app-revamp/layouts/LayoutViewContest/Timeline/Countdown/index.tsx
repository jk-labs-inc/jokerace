import { useStore } from "@hooks/useProviderContest";
import { useCountdown } from "./useCountdown";
import styles from "./styles.module.css";

export const Countdown = () => {
  const stateContest = useStore();
  const countdownUntilSubmissionsOpen = useCountdown(new Date(), stateContest.submissionsOpen);
  const countdownUntilVotingOpen = useCountdown(stateContest.submissionsOpen, stateContest.votesOpen);
  const countdownUntilVotingClose = useCountdown(stateContest.votesOpen, stateContest.votesClose);

  if (countdownUntilSubmissionsOpen.isCountdownRunning) {
    return (
      <>
        <p className={styles.label}>Submissions open in</p>
        <div className={styles.countdown}>
          {Object.keys(countdownUntilSubmissionsOpen.countdown).map((unit: string) => (
            <div className={styles.wrapperUnit} key={`countdown-submissions-open-${unit}`}>
              <span className={styles.unitValue}>{countdownUntilSubmissionsOpen.countdown[unit]}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          ))}
        </div>
      </>
    );
  }
  if (countdownUntilVotingOpen.isCountdownRunning) {
    return (
      <>
        <p className={styles.label}>Voting opens in</p>
        <div className={styles.countdown}>
          {Object.keys(countdownUntilVotingOpen.countdown).map((unit: string) => (
            <div className={styles.wrapperUnit} key={`countdown-voting-open-${unit}`}>
              <span className={styles.unitValue}>{countdownUntilVotingOpen.countdown[unit]}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          ))}
        </div>
      </>
    );
  }
  if (countdownUntilVotingClose.isCountdownRunning) {
    return (
      <>
        <p className={styles.label}>Voting closes in</p>
        <div className={styles.countdown}>
          {Object.keys(countdownUntilVotingClose.countdown).map((unit: string) => (
            <div className={styles.wrapperUnit} key={`countdown-voting-closes-${unit}`}>
              <span className={styles.unitValue}>{countdownUntilVotingClose.countdown[unit]}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return null;
};

export default Countdown;
