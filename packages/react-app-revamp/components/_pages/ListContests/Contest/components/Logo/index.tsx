import { getChainLogo } from "@helpers/getChainLogo";
import { FC } from "react";

interface ContestLogoProps {
  chainName: string;
}

const ContestLogo: FC<ContestLogoProps> = ({ chainName }) => {
  const logoUrl = getChainLogo(chainName);

  return (
    <div className="w-6 h-6 rounded-full">
      <img src={logoUrl} alt="contest-logo" className="w-full h-full object-cover" />
    </div>
  );
};

export default ContestLogo;
