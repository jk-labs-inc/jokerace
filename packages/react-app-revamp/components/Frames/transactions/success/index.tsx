/** @jsxImportSource frog/jsx */

import { Box, Text } from "lib/frames/ui";
import { FC } from "react";

export enum ActionType {
  SUBMISSION = "submission",
  VOTING = "voting",
}

interface TransactionSuccessFrameProps {
  type: ActionType;
}

const TransactionSuccessFrame: FC<TransactionSuccessFrameProps> = ({ type }) => {
  const successMessage = type === ActionType.SUBMISSION ? "you submitted a proposal!" : "you voted on a proposal!";
  return (
    <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
      <Text font="orbitron" color="neutral" size="24" align="start">
        JokeRace
      </Text>
      <Box flexGrow="1" alignHorizontal="center" alignVertical="center" flexDirection="column" justifyContent="center">
        <Text font="orbitron" transform="uppercase" color="green" size="24">
          {successMessage}
        </Text>
      </Box>
    </Box>
  );
};

export default TransactionSuccessFrame;
