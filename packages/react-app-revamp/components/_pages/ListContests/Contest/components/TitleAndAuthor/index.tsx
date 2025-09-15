import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { FC } from "react";

interface ContesTitleAndAuthorProps {
  contestName: string;
  contestAuthor: string;
}

const ContesTitleAndAuthor: FC<ContesTitleAndAuthorProps> = ({ contestName, contestAuthor }) => {
  return (
    <div className="flex flex-col items-start">
      <p className="text-neutral-11 text-[16px] font-bold">{contestName}</p>
      <p className="text-neutral-11 text-[16px]">
        by{" "}
        <a
          //TODO: fix this to go to user profile page
          href={""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-positive-11 font-bold"
        >
          {shortenEthereumAddress(contestAuthor)}
        </a>
      </p>
    </div>
  );
};

export default ContesTitleAndAuthor;
