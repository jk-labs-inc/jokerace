/* eslint-disable react/no-unescaped-entities */
import { useContestStore } from "@hooks/useContest/store";
import useVoters from "@hooks/useVoters";
import { FC } from "react";
import { CSVLink } from "react-csv";
import Skeleton from "react-loading-skeleton";

interface ContestParamatersCSVVotersProps {
  votingMerkleRoot: string;
}

const ContestParamatersCSVVoters: FC<ContestParamatersCSVVotersProps> = ({ votingMerkleRoot }) => {
  const { isV3 } = useContestStore(state => state);
  const { voters, isLoading, isError, retry } = useVoters(votingMerkleRoot, isV3);

  if (!isV3) {
    return null;
  }

  if (isLoading) {
    return (
      <li className="list-disc">
        <Skeleton width={200} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />
      </li>
    );
  }

  if (isError) {
    return (
      <li className="list-disc text-negative-11">
        <p className="text-negative-11 font-bold">
          ruh roh! we couldn't load the voters,{" "}
          <span className="underline cursor-pointer" onClick={() => retry()}>
            try again!
          </span>
        </p>
      </li>
    );
  }

  return (
    <li className="list-disc">
      see full allowlist{" "}
      <CSVLink data={voters} filename={"voters.csv"} className="text-positive-11">
        here
      </CSVLink>
    </li>
  );
};

export default ContestParamatersCSVVoters;
