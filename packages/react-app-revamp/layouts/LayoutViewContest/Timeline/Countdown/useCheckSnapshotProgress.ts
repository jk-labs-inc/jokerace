import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { sleep } from "@helpers/sleep";
import { useContestStore } from "@hooks/useContest/store";
import { readContract } from "@wagmi/core";
import { isAfter, isEqual } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";

export function useCheckSnapshotProgress() {
  const { asPath } = useRouter();
  const { votesOpen, setContestStatus, setSnapshotTaken } = useContestStore(state => state);

  // we need both local react state & global zustand state here
  // in case zustand doesn't track the change of value
  const [isSnaspshotTaken, setIsSnapshotTaken] = useState(false);

  async function updateSnapshotProgress() {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const abi = await getContestContractVersion(address, chainName);
    while (isSnaspshotTaken !== true) {
      const statusRawData = await readContract({
        addressOrName: address,
        contractInterface: abi ? abi : DeployedContestContract.abi,
        functionName: "state",
      });
      if (
        // @ts-ignore
        ![CONTEST_STATUS.COMPLETED, CONTEST_STATUS.VOTING_OPEN].includes(statusRawData) &&
        (isAfter(new Date(), votesOpen ?? 0) || isEqual(new Date(), votesOpen ?? 0))
      ) {
        setContestStatus(CONTEST_STATUS.SNAPSHOT_ONGOING);
        setIsSnapshotTaken(false);
      } else {
        setIsSnapshotTaken(true);
        //@ts-ignore
        setContestStatus(statusRawData);
        console.log(statusRawData);

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
