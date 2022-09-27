import { useEffect } from "react";
import { isBefore, isAfter, isEqual } from "date-fns";
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
  const { listProposalsIds, contestMaxProposalCount, contestStatus, submissionsOpen, votesOpen, votesClose, setContestStatus } = useStore(
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
      //@ts-ignore
      listProposalsIds: state.listProposalsIds,
      //@ts-ignore
      contestMaxProposalCount: state.contestMaxProposalCount,
    }),
    shallow,
  );

  const countdownUntilSubmissionsOpen = useCountdown(new Date(), submissionsOpen);
  const countdownUntilVotingOpen = useCountdown(submissionsOpen, votesOpen);
  const countdownUntilVotingClose = useCountdown(votesOpen, votesClose);

  useEffect(() => {
    if (contestStatus !== null) {
      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        !countdownUntilVotingOpen.isCountdownRunning &&
        isBefore(new Date(), votesOpen)
      ) {
        countdownUntilVotingOpen.setIsCountdownRunning(true);
        setContestStatus(CONTEST_STATUS.SUBMISSIONS_OPEN);
      }

      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        !countdownUntilVotingOpen.isCountdownRunning &&
        !countdownUntilVotingClose.isCountdownRunning &&
        contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
        (isAfter(new Date(), votesOpen) || isEqual(new Date(), votesOpen)) &&
        isBefore(new Date(), votesClose)
      ) {
        countdownUntilVotingClose.setIsCountdownRunning(true);
        setContestStatus(CONTEST_STATUS.SNAPSHOT_ONGOING);
      }
      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        !countdownUntilVotingOpen.isCountdownRunning &&
        !countdownUntilVotingClose.isCountdownRunning &&
        isAfter(new Date(), votesClose)
      ) {
        setContestStatus(CONTEST_STATUS.COMPLETED);
      }
    }
  }, [
    countdownUntilVotingOpen.isCountdownRunning,
    countdownUntilSubmissionsOpen.isCountdownRunning,
    countdownUntilVotingClose.isCountdownRunning,
    contestStatus,
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
        <p className={`text-sm font-bold text-center text-true-white mb-1`}>{listProposalsIds.length >= contestMaxProposalCount ? "✋ Submissions closed ✋" : "✨ Submissions open ✨"}</p>
        {<p className="text-2xs text-neutral-10 text-center mb-4">{listProposalsIds.length}/{contestMaxProposalCount.toString()} proposals submitted</p>}
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
        <p className={`text-xs font-bold text-center text-neutral-10`}>Submissions closed</p>
        <p className={`text-sm font-bold text-center text-true-white mb-4`}>✨ Voting open ✨</p>
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

  return <p className={`text-sm font-bold text-center text-[#D79EFF] mb-4`}> Contest finished</p>;
};

export default Countdown;
