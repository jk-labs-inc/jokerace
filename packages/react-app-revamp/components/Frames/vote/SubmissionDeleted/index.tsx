/** @jsxImportSource frog/jsx */

import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { shortenProposalId } from "@helpers/shortenProposalId";
import { Box, Text } from "lib/frames/ui";
import { FC } from "react";

interface VoteFrameSubmissionDeletedProps {
  submission: string;
  proposalAuthor: string;
  proposalAuthorEns: string | null;
}

const VoteFrameSubmissionDeleted: FC<VoteFrameSubmissionDeletedProps> = ({
  submission,
  proposalAuthor,
  proposalAuthorEns,
}) => {
  return (
    <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
      <Text font="orbitron" color="neutral" size="24" align="start">
        JokeRace
      </Text>
      <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
        <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
          <Text font="orbitron" transform="uppercase" color="neutral" size="24">
            submission {shortenProposalId(submission)}
          </Text>
          <Text font="lato" color="neutral" size="16">
            by {proposalAuthorEns ? proposalAuthorEns : shortenEthereumAddress(proposalAuthor)}
          </Text>
        </Box>
        <Text font="lato" color="red" weight="700" size="16" transform="uppercase">
          submission deleted!
        </Text>
      </Box>
    </Box>
  );
};

export default VoteFrameSubmissionDeleted;
