import { FC } from "react";

interface VotingQualifierErrorProps {
  onClick?: () => void;
}

const VotingQualifierError: FC<VotingQualifierErrorProps> = ({ onClick }) => {
  return (
    <p className="text-[16px] text-negative-11 font-bold underline cursor-pointer" onClick={onClick}>
      ruh-roh, there was an error while fetching vote price, try again!
    </p>
  );
};

export default VotingQualifierError;
