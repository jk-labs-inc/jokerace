/* eslint-disable react/no-unescaped-entities */
import useSubmitters from "@hooks/useSubmitters";
import { FC } from "react";
import { CSVLink } from "react-csv";
import Skeleton from "react-loading-skeleton";

interface ContestParamatersCSVSubmittersProps {
  submissionMerkleRoot: string;
}

const ContestParamatersCSVSubmitters: FC<ContestParamatersCSVSubmittersProps> = ({ submissionMerkleRoot }) => {
  const { submitters, isLoading, isError, retry } = useSubmitters(submissionMerkleRoot);

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
          ruh roh! we couldn't load the submitters,{" "}
          <span className="underline cursor-pointer" onClick={retry}>
            try again!
          </span>
        </p>
      </li>
    );
  }

  return (
    <li className="list-disc">
      see full allowlist{" "}
      <CSVLink data={submitters} filename={"voters.csv"} className="text-positive-11">
        here
      </CSVLink>
    </li>
  );
};

export default ContestParamatersCSVSubmitters;
