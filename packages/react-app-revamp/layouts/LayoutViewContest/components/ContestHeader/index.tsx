import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestImage from "@components/_pages/Contest/components/ContestImage";
import ContestName from "@components/_pages/Contest/components/ContestName";
import ContestRewardsInfo from "@components/_pages/Contest/components/RewardsInfo";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import RefreshButton from "../RefreshButton";

interface ContestHeaderProps {
  contestImageUrl: string;
  contestName: string;
  contestAddress: string;
  chainName: string;
  contestPrompt: string;
  canEditTitle: boolean;
  contestAuthorEthereumAddress: string;
  contestVersion: string;
}

const ContestHeader: FC<ContestHeaderProps> = ({
  contestImageUrl,
  contestName,
  contestAddress,
  chainName,
  contestPrompt,
  canEditTitle,
  contestAuthorEthereumAddress,
  contestVersion,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="animate-fade-in pt-3 md:pt-0">
      <div className="flex flex-col mt-6 md:mt-10 gap-4">
        <div className="flex flex-col gap-8">
          {contestImageUrl && (
            <div className="hidden md:block">
              <ContestImage imageUrl={contestImageUrl} />
            </div>
          )}
          <ContestName
            contestName={contestName}
            contestAddress={contestAddress}
            chainName={chainName}
            contestPrompt={contestPrompt}
            canEditTitle={canEditTitle}
          />
        </div>

        <div className="flex flex-row gap-3 md:gap-4 items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <UserProfileDisplay
              ethereumAddress={contestAuthorEthereumAddress}
              shortenOnFallback
              size={isMobile ? "extraSmall" : "small"}
              textualVersion={!isMobile}
            />

            <ContestRewardsInfo version={contestVersion} />
          </div>

          <RefreshButton />
        </div>
      </div>
    </div>
  );
};

export default ContestHeader;
