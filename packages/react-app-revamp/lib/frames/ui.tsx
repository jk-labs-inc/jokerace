import { createSystem } from "frog/ui";
import { readFile } from "fs/promises";

async function loadSaboFont() {
  const SaboFontBuffer = await readFile("./Sabo-Filled.otf");

  return SaboFontBuffer;
}

export const { Box, Columns, Column, Heading, HStack, Rows, Row, Spacer, Text, VStack, vars } = createSystem({
  colors: {
    yellow: "#FFE25B",
    black: "#000000",
    neutral: "#E5E5E5",
    white: "#FFFFFF",
    green: "#78FFC6",
  },
  fontSizes: {
    small: 0.01875,
    medium: 0.03125,
    large: 1.04375,
  },
  icons: "heroicons",
  fonts: {
    lato: [
      {
        name: "Lato",
        source: "google",
        weight: 400,
      },
      {
        name: "Lato",
        source: "google",
        weight: 700,
      },
      {
        name: "Lato",
        source: "google",
        weight: 900,
      },
    ],
  },
});

export const FramesLayout = () => {
  return (
    <Box grow backgroundColor="black" padding="16">
      <Heading color="white">JokeRace</Heading>
    </Box>
  );
};
