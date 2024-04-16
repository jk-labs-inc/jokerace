import { createSystem } from "frog/ui";

export const { Box, Columns, Column, Heading, HStack, Rows, Row, Spacer, Text, VStack, Image, vars } = createSystem({
  colors: {
    yellow: "#FFE25B",
    black: "#000000",
    neutral: "#E5E5E5",
    darkGrey: "#6A6A6A",
    white: "#FFFFFF",
    green: "#78FFC6",
    red: "#FF78A9",
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
