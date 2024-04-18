/** @jsxImportSource frog/jsx */

import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { formatEther } from "ethers/lib/utils";
import { Box, Text } from "lib/frames/ui";
import moment from "moment";
import { FC } from "react";

interface SubmissionsFinalFrameProps {
  contestName: string;
  contestCreator: string;
  contestCreatorEns: string | null;
  contestType: string;
  contestTitle: string;
  costToPropose: number;
  voteStartDate: Date;
  nativeCurrency: string | undefined;
}

const SubmissionsFinalFrame: FC<SubmissionsFinalFrameProps> = ({
  contestName,
  contestCreator,
  contestCreatorEns,
  contestType,
  contestTitle,
  costToPropose,
  voteStartDate,
  nativeCurrency,
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
          <Box backgroundColor="darkGrey" border="solid" borderRadius="10" padding="8">
            <Text font="lato" color="black" size="14">
              {contestType}
            </Text>
          </Box>

          <Text font="orbitron" transform="uppercase" color="neutral" size="24">
            {contestName}
          </Text>
          <Text font="lato" color="neutral" size="16">
            by {contestCreatorEns ? contestCreatorEns : shortenEthereumAddress(contestCreator)}
          </Text>
        </Box>

        <Box gap="8" justifyContent="center" alignHorizontal="center" alignVertical="center">
          <Text font="lato" color="neutral" size="16">
            {contestTitle}
          </Text>
          <Text font="lato" color="neutral" size="16">
            {formatEther(BigInt(costToPropose))} {nativeCurrency} to submit
          </Text>
          <Text font="lato" color="neutral" size="16">
            submit by {moment(voteStartDate).format("MMMM Do, YYYY, h:mm a")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SubmissionsFinalFrame;
