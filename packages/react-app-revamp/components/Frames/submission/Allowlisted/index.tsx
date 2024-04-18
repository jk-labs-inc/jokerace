/** @jsxImportSource frog/jsx */

import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { Box, Text } from "lib/frames/ui";
import { FC } from "react";

interface SubmissionsFrameAllowlistedProps {
  contestName: string;
  contestCreator: string;
  contestCreatorEns: string | null;
}

const SubmissionsFrameAllowlisted: FC<SubmissionsFrameAllowlistedProps> = ({
  contestName,
  contestCreator,
  contestCreatorEns,
}) => {
  return (
    <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
      <Text font="orbitron" color="neutral" size="24" align="start">
        JokeRace
      </Text>
      <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
        <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
          <Text font="orbitron" transform="uppercase" color="neutral" size="24">
            {contestName}
          </Text>
          <Text font="lato" color="neutral" size="16">
            by {contestCreatorEns ? contestCreatorEns : shortenEthereumAddress(contestCreator)}
          </Text>
        </Box>
        <Box flexDirection="column" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="4">
          <Text font="lato" color="red" weight="700" size="16">
            ruh-roh! it looks like this contest is allowlisted.
          </Text>
          <Text font="lato" color="red" weight="700" size="16">
            visit JokeRace to play!
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
export default SubmissionsFrameAllowlisted;
