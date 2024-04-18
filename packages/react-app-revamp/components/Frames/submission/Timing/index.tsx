/** @jsxImportSource frog/jsx */

import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { Box, Text } from "lib/frames/ui";
import { FC } from "react";

export enum SubmissionFrameTiming {
  NOT_OPEN = "notOpen",
  CLOSED = "closed",
}

interface SubmissionsFrameTimingProps {
  contestName: string;
  contestCreator: string;
  contestCreatorEns: string | null;
  timingStatus: SubmissionFrameTiming;
}

const SubmissionsFrameTiming: FC<SubmissionsFrameTimingProps> = ({
  contestName,
  contestCreator,
  contestCreatorEns,
  timingStatus,
}) => {
  const timingText =
    timingStatus === SubmissionFrameTiming.NOT_OPEN ? "submissions not open yet!" : "submissions closed!";

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
        <Text
          font="lato"
          color={timingStatus === SubmissionFrameTiming.NOT_OPEN ? "neutral" : "red"}
          weight="700"
          size="16"
          transform="uppercase"
        >
          {timingText}
        </Text>
      </Box>
    </Box>
  );
};

export default SubmissionsFrameTiming;
