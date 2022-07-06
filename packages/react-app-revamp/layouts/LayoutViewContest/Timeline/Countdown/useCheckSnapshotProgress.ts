import { useRouter } from "next/router";
import { useState } from "react";
import shallow from "zustand/shallow";
import { readContract } from "@wagmi/core";
import { useStore } from "@hooks/useContest/store";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import { sleep } from "@helpers/sleep";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { isAfter, isEqual } from "date-fns";

export function useCheckSnapshotProgress() {
  const { asPath } = useRouter();
  const { setContestStatus, votesOpen, setSnapshotTaken } = useStore(
    state => ({
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore,
      setContestStatus: state.setContestStatus,
      //@ts-ignore
      setSnapshotTaken: state.setSnapshotTaken,
    }),
    shallow,
  );
  // we need both local react state & global zustand state here
  // in case zustand doesn't track the change of value
  const [isSnaspshotTaken, setIsSnapshotTaken] = useState();

  async function updateSnapshotProgress() {
    const address = asPath.split("/")[3];
    while (isSnaspshotTaken !== true) {
      const statusRawData = await readContract({
        addressOrName: address,
        contractInterface: DeployedContestContract.abi,
        functionName: "state",
      });
      if (
        // @ts-ignore
        ![CONTEST_STATUS.COMPLETED, CONTEST_STATUS.VOTING_OPEN].includes(statusRawData) &&
        (isAfter(new Date(), votesOpen) || isEqual(new Date(), votesOpen))
      ) {
        setContestStatus(CONTEST_STATUS.SNAPSHOT_ONGOING);
        //@ts-ignore
        setIsSnapshotTaken(false);
      } else {
        //@ts-ignore
        setIsSnapshotTaken(true);
        //@ts-ignore
        setContestStatus(statusRawData);
        setSnapshotTaken(true);
        return;
      }
      await sleep(3000);
    }
  }
  return {
    isSnaspshotTaken,
    updateSnapshotProgress,
  };
}

export default useCheckSnapshotProgress;
