import { createSystem } from "frog/ui";
import { readFile } from "fs/promises";

const isDev = process.env.NODE_ENV === "development";

const fontUrl = isDev ? "./public/Sabo-Filled.otf" : "/Sabo-Filled.otf";

const saboLocal = await readFile(fontUrl);

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
    sabo: [
      {
        name: "Sabo",
        source: "buffer",
        data: saboLocal,
      },
    ],
  },
});
