/* eslint-disable react-hooks/exhaustive-deps */
import { CONTEST_STATUS } from "@helpers/contestStatus";
import { useContestStore } from "@hooks/useContest/store";
import useCountdown from "@hooks/useCountdown";
import { useProposalStore } from "@hooks/useProposal/store";
import { isAfter, isBefore, isEqual } from "date-fns";
import { useCallback, useEffect } from "react";
import styles from "./styles.module.css";

export const Countdown = () => {
  const { listProposalsIds } = useProposalStore(state => state);
  const { contestStatus, setContestStatus, contestMaxProposalCount, submissionsOpen, votesOpen, votesClose } =
    useContestStore(state => state);

  const countdownUntilSubmissionsOpen = useCountdown(new Date(), submissionsOpen);
  const countdownUntilVotingOpen = useCountdown(submissionsOpen, votesOpen);
  const countdownUntilVotingClose = useCountdown(votesOpen, votesClose);

  const updateContestStatus = useCallback(() => {
    if (countdownUntilSubmissionsOpen.isCountdownRunning) {
      setContestStatus(CONTEST_STATUS.SUBMISSIONS_NOT_OPEN);
      return;
    }

    if (countdownUntilVotingOpen.isCountdownRunning) {
      setContestStatus(CONTEST_STATUS.SUBMISSIONS_OPEN);
      return;
    }

    if (
      !countdownUntilSubmissionsOpen.isCountdownRunning &&
      !countdownUntilVotingOpen.isCountdownRunning &&
      contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
      (isAfter(new Date(), votesOpen) || isEqual(new Date(), votesOpen)) &&
      isBefore(new Date(), votesClose)
    ) {
      setContestStatus(CONTEST_STATUS.SNAPSHOT_ONGOING);
      return;
    }

    if (countdownUntilVotingClose.isCountdownRunning) {
      setContestStatus(CONTEST_STATUS.VOTING_OPEN);
      return;
    }

    setContestStatus(CONTEST_STATUS.COMPLETED);
  }, [
    countdownUntilVotingOpen.isCountdownRunning,
    countdownUntilSubmissionsOpen.isCountdownRunning,
    countdownUntilVotingClose.isCountdownRunning,
    contestStatus,
  ]);

  useEffect(() => {
    updateContestStatus();
  }, [updateContestStatus]);

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
