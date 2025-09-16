import { ROUTE_VIEW_USER } from "@config/routes";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { FC } from "react";
import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

interface ContesTitleAndAuthorProps {
  contestName: string;
  contestAuthor: string;
}

const ContesTitleAndAuthor: FC<ContesTitleAndAuthorProps> = ({ contestName, contestAuthor }) => {
  const ensName = useEnsName({
    address: contestAuthor as `0x${string}`,
    chainId: mainnet.id,
  });

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    window.open(`${ROUTE_VIEW_USER.replace("[address]", contestAuthor)}`, "_blank");
  };

  return (
    <div className="flex flex-col items-start">
      <p className="text-neutral-11 text-[16px] font-bold">{contestName}</p>
      <p className="text-neutral-11 text-[16px]">
        by{" "}
        <span onClick={handleAuthorClick} className="text-positive-11 cursor-pointer hover:underline">
          {ensName.data || shortenEthereumAddress(contestAuthor)}
        </span>
      </p>
    </div>
  );
};

export default ContesTitleAndAuthor;
