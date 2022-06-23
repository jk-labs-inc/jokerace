import { useEffect } from "react";
import { isBefore, isAfter } from "date-fns";
import shallow from "zustand/shallow";
import { useStore } from "@hooks/useContest/store";
import { useCountdown } from "@hooks/useCountdown";
import styles from "./styles.module.css";
import { CONTEST_STATUS } from "@helpers/contestStatus";

// - Contest status
// -1: Submissions not opened yet
// 0: Voting open
// 1: Contest cancelled
// 2: Submissions open
// 3: Completed

export const Countdown = () => {
  const { contestStatus, submissionsOpen, votesOpen, votesClose, setContestStatus } = useStore(
    state => ({
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
      //@ts-ignore,
      setContestStatus: state.setContestStatus,
      //@ts-ignore
      contestStatus: state.contestStatus,
    }),
    shallow,
  );

  const countdownUntilSubmissionsOpen = useCountdown(new Date(), submissionsOpen);
  const countdownUntilVotingOpen = useCountdown(submissionsOpen, votesOpen);
  const countdownUntilVotingClose = useCountdown(votesOpen, votesClose);

  useEffect(() => {
    if (
      !countdownUntilSubmissionsOpen.isCountdownRunning &&
      !countdownUntilVotingOpen.isCountdownRunning &&
      isBefore(new Date(), votesOpen)
    ) {
      countdownUntilVotingOpen.restart();
      setContestStatus(CONTEST_STATUS.SUBMISSIONS_OPEN);
    }

    if (
      !countdownUntilSubmissionsOpen.isCountdownRunning &&
      !countdownUntilVotingOpen.isCountdownRunning &&
      !countdownUntilVotingClose.isCountdownRunning &&
      contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
      isBefore(new Date(), votesClose)
    ) {
      countdownUntilVotingClose.restart();
      setContestStatus(CONTEST_STATUS.VOTING_OPEN);
    }

    if (
      !countdownUntilSubmissionsOpen.isCountdownRunning &&
      !countdownUntilVotingOpen.isCountdownRunning &&
      !countdownUntilVotingClose.isCountdownRunning &&
      isAfter(new Date(), votesClose)
    ) {
      setContestStatus(CONTEST_STATUS.COMPLETED);
    }
  }, [
    countdownUntilSubmissionsOpen.isCountdownRunning,
    countdownUntilVotingOpen.isCountdownRunning,
    countdownUntilVotingClose.isCountdownRunning,
  ]);

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
