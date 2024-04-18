/** @jsxImportSource frog/jsx */

import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { Box, Text } from "lib/frames/ui";
import { FC } from "react";

interface SubmissionsInitialFrameProps {
  contestName: string;
  contestCreator: string;
  contestCreatorEns: string | null;
}

const SubmissionsInitialFrame: FC<SubmissionsInitialFrameProps> = ({
  contestName,
  contestCreator,
  contestCreatorEns,
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
        gap="8"
        justifyContent="center"
      >
        <Text font="orbitron" transform="uppercase" color="neutral" size="24">
          {contestName}
        </Text>
        <Text font="lato" color="neutral" size="16">
          by {contestCreatorEns ? contestCreatorEns : shortenEthereumAddress(contestCreator)}
        </Text>
      </Box>
    </Box>
  );
};

export default SubmissionsInitialFrame;
