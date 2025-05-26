import { VoterRewardsStatistics } from "@hooks/useVoterRewardsStatistics";
import { FC } from "react";
import RankingSuffix from "../RankingSuffix";
import StatisticsRow from "../StatisticsRow";
import { formatBalance } from "@helpers/formatBalance";

interface VotesInfoProps {
  ranking: number;
  info: VoterRewardsStatistics | null | undefined;
}

const VotesInfo: FC<VotesInfoProps> = ({ ranking, info }) => {
  //TODO: add diff message based on contest status (current tense and past tense)
  if (!info)
    return <StatisticsRow label={<RankingSuffix ranking={ranking} text="place" />} value={<b>is currently tied</b>} />;

  return (
    <>
      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place" prefix="my votes on" />}
        value={<b>{formatBalance(info.userVotesFormatted)}</b>}
      />

      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place" prefix="total votes on" />}
        value={<b>{formatBalance(info.totalVotesFormatted ?? "0")}</b>}
      />

      <StatisticsRow
        label={<RankingSuffix ranking={ranking} text="place rewards" prefix="my % of" />}
        value={<b>{info.rewardsPercentage}%</b>}
      />
    </>
  );
};

export default VotesInfo;
