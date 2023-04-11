import { CONTEST_STATUS } from "@helpers/contestStatus";
import { useContestStore } from "@hooks/useContest/store";
import { useCountdown } from "@hooks/useCountdown";
import { useProposalStore } from "@hooks/useProposal/store";
import { isAfter, isBefore, isEqual } from "date-fns";
import { FC, useEffect, useMemo } from "react";
import styles from "./styles.module.css";

// Contest status
// -1: Submissions not opened yet
//  0: Voting open
//  1: Contest cancelled
//  2: Submissions open
//  3: Completed

export const Countdown = () => {
  const { listProposalsIds } = useProposalStore(state => state);
  const { contestStatus, setContestStatus, contestMaxProposalCount, submissionsOpen, votesOpen, votesClose } =
    useContestStore(state => state);

  const countdownUntilSubmissionsOpen = useCountdown(new Date(), submissionsOpen!);
  const countdownUntilVotingOpen = useCountdown(submissionsOpen!, votesOpen!);
  const countdownUntilVotingClose = useCountdown(votesOpen ?? new Date(), votesClose!);

  useEffect(() => {
    if (contestStatus !== null) {
      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        (isBefore(new Date(), submissionsOpen) || isEqual(new Date(), submissionsOpen))
      ) {
        countdownUntilVotingOpen.setIsCountdownRunning(true);
        setContestStatus(CONTEST_STATUS.SUBMISSIONS_NOT_OPEN);
      }

      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        !countdownUntilVotingOpen.isCountdownRunning &&
        isBefore(new Date(), votesOpen) &&
        isAfter(new Date(), submissionsOpen)
      ) {
        countdownUntilVotingOpen.setIsCountdownRunning(true);
        setContestStatus(CONTEST_STATUS.SUBMISSIONS_OPEN);
      }

      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        !countdownUntilVotingOpen.isCountdownRunning &&
        !countdownUntilVotingClose.isCountdownRunning &&
        contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
        (isAfter(new Date(), votesOpen!) || isEqual(new Date(), votesOpen!)) &&
        isBefore(new Date(), votesClose!)
      ) {
        countdownUntilVotingClose.setIsCountdownRunning(true);
        setContestStatus(CONTEST_STATUS.SNAPSHOT_ONGOING);
      }
      if (
        !countdownUntilSubmissionsOpen.isCountdownRunning &&
        !countdownUntilVotingOpen.isCountdownRunning &&
        !countdownUntilVotingClose.isCountdownRunning &&
        isAfter(new Date(), votesClose!)
      ) {
        setContestStatus(CONTEST_STATUS.COMPLETED);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (countdownUntilVotingOpen.isCountdownRunning || isBefore(new Date(), votesOpen!)) {
    return (
      <>
        <p className={`text-sm font-bold text-center text-true-white mb-1`}>
          {listProposalsIds.length >= contestMaxProposalCount ? "✋ Submissions closed ✋" : "✨ Submissions open ✨"}
        </p>
        {
          <p className="text-2xs text-neutral-10 text-center mb-4">
            {listProposalsIds.length}/{contestMaxProposalCount.toString()} proposals submitted
          </p>
        }
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

  if (countdownUntilVotingClose.isCountdownRunning || isBefore(new Date(), votesClose!)) {
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
