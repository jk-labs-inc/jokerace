/** @jsxImportSource frog/jsx */

import { formatNumber } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { shortenProposalId } from "@helpers/shortenProposalId";
import { formatEther } from "ethers/lib/utils";
import { Box, Text } from "lib/frames/ui";
import moment from "moment";
import { FC } from "react";

interface VoteFinalFrameProps {
  submission: string;
  authorEthereumAddress: string;
  authorEns: string | null;
  contestName: string;
  contestDeadline: Date;
  costToVote: number;
  nativeCurrency: string | undefined;
  rank: number;
  votes: number;
  isTied: boolean;
}

const VoteFinalFrame: FC<VoteFinalFrameProps> = ({
  submission,
  authorEthereumAddress,
  authorEns,
  contestName,
  contestDeadline,
  costToVote,
  nativeCurrency,
  rank,
  votes,
  isTied,
}) => {
  return (
    <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
      <Text font="orbitron" color="neutral" size="24" align="start">
        JokeRace
      </Text>
      <Box
        flexGrow="1"
        alignHorizontal="center"
        alignVertical="center"
        flexDirection="column"
        gap="32"
        justifyContent="center"
      >
        <Box gap="8" justifyContent="center" alignHorizontal="center" alignVertical="center">
          {votes > 0 ? (
            <Box flexDirection="row" gap="4">
              <Text font="lato" color="neutral" size="16" weight="700">
                {ordinalize(rank).label} place {isTied ? "(tied)" : ""}
              </Text>
              <Text color="neutral">&#8226;</Text>
              <Text font="lato" color="neutral" size="16" weight="700">
                {formatNumber(votes)} vote{votes > 1 ? "s" : ""}
              </Text>
            </Box>
          ) : (
            <Box />
          )}

          <Text font="orbitron" transform="uppercase" color="neutral" size="24">
            submission {shortenProposalId(submission)}
          </Text>
          <Text font="lato" color="neutral" size="16">
            by {authorEns ? authorEns : shortenEthereumAddress(authorEthereumAddress)}
          </Text>
        </Box>

        <Box gap="8" justifyContent="center" alignHorizontal="center" alignVertical="center">
          <Text font="lato" color="neutral" size="16">
            {contestName} contest
          </Text>
          <Text font="lato" color="neutral" size="16">
            1 vote = {formatEther(BigInt(costToVote))} {nativeCurrency}
          </Text>
          <Text font="lato" color="neutral" size="16">
            vote by {moment(contestDeadline).format("MMMM Do, YYYY, h:mm a")}
          </Text>
        </Box>

        <Text font="lato" color="neutral" size="14">
          note: use whole numbers only, no decimals.
        </Text>
      </Box>
    </Box>
  );
};

export default VoteFinalFrame;
