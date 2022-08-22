const colors = require("tailwindcss/colors");

const typography = {
  fontSizeMin: 1.125,
  fontSizeMax: 1.25,
  msFactorMin: 1.125,
  msFactorMax: 1.2,
  lineHeight: 1.6,
};

const screensRem = {
  min: 20,
  "2xs": 30,
  xs: 36,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 85.364,
};

const fsMin = typography.fontSizeMin;
const fsMax = typography.fontSizeMax;
const msFactorMin = typography.msFactorMin;
const msFactorMax = typography.msFactorMax;
const screenMin = screensRem.min;
const screenMax = screensRem["2xl"];

// Calc min and max font-size
const calcMulti = (multiMin = 0, multiMax = null) => {
  return {
    fsMin: fsMin * Math.pow(msFactorMin, multiMin),
    fsMax: fsMax * Math.pow(msFactorMax, multiMax || multiMin),
  };
};

// build the clamp property
const clamp = (multiMin = 0, multiMax = null) => {
  const _calcMulti = calcMulti(multiMin, multiMax || multiMin);
  const _fsMin = _calcMulti.fsMin;
  const _fsMax = _calcMulti.fsMax;
  return `clamp(${_fsMin}rem, calc(${_fsMin}rem + (${_fsMax} - ${_fsMin}) * ((100vw - ${screenMin}rem) / (${screenMax} - ${screenMin}))), ${_fsMax}rem)`;
};

const remToPx = rem => {
  return `${rem * 16}px`;
};

module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./layouts/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      min: remToPx(screensRem.min),
      "2xs": remToPx(screensRem["2xs"]),
      xs: remToPx(screensRem.xs),
      sm: remToPx(screensRem.sm),
      md: remToPx(screensRem.md),
      lg: remToPx(screensRem.lg),
      xl: remToPx(screensRem.xl),
      "2xl": remToPx(screensRem["2xl"]),
    },
    fontFamily: {
      sans: ['"Lato", sans-serif'],
      mono: ["monospace"],
    },
    fontSize: {
      "3xs": clamp(-3),
      "2xs": clamp(-2),
      xs: clamp(-1),
      sm: clamp(-0.5),
      base: clamp(0),
      md: clamp(0.5),
      lg: clamp(1),
      xl: clamp(2),
      "2xl": clamp(3),
      "3xl": clamp(4),
      "4xl": clamp(5),
      "5xl": clamp(6),
      "6xl": clamp(7),
      "7xl": clamp(8),
      "8xl": clamp(9),
      "9xl": clamp(10),
    },
    colors: {
      transparent: "transparent",
      inherit: "inherit",
      current: "currentColor",
      "true-white": "#ffffff",
      "true-black": "#000000",
      primary: {
        1: "#1c1500",
        2: "#221a00",
        3: "#2c2100",
        4: "#352800",
        5: "#3e3000",
        6: "#493c00",
        7: "#594a05",
        8: "#705e00",
        9: "#f5d90a",
        10: "#ffef5c",
        11: "#f0c000",
        12: "#fffad1",
      },
      secondary: {
        1: "#1b141d",
        2: "#221527",
        3: "#301a3a",
        4: "#3a1e48",
        5: "#432155",
        6: "#4e2667",
        7: "#5f2d84",
        8: "#7938b2",
        9: "#8e4ec6",
        10: "#9d5bd2",
        11: "#bf7af0",
        12: "#f7ecfc",
      },
      positive: {
        1: "#081917",
        2: "#05201e",
        3: "#052926",
        4: "#04312c",
        5: "#033a34",
        6: "#01453d",
        7: "#00564a",
        8: "#006d5b",
        9: "#70e1c8",
        10: "#95f3d9",
        11: "#25d0ab",
        12: "#e7fcf7",
      },
      negative: {
        1: "#1d1418",
        2: "#27141c",
        3: "#3c1827",
        4: "#481a2d",
        5: "#541b33",
        6: "#641d3b",
        7: "#801d45",
        8: "#ae1955",
        9: "#e93d82",
        10: "#f04f88",
        11: "#f76190",
        12: "#feecf4",
      },
      neutral: {
        0: "#121212",
        1: "#161618",
        2: "#1c1c1f",
        3: "#232326",
        4: "#28282c",
        5: "#2e2e32",
        6: "#34343a",
        7: "#3e3e44",
        8: "#504f57",
        9: "#706f78",
        10: "#7e7d86",
        11: "#a09fa6",
        12: "#ededef",
      },
    },
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme("colors.true-white"),
            "--tw-prose-invert-hr": theme("colors.neutral.4"),
          },
        },
      }),
      keyframes: {
        "card-rotation": {
          from: {
            transform: "rotateY(360deg)",
          },
          to: {
            transform: "rotateY(0)",
          },
        },
        appear: {
          from: {
            opacity: 0,
            transform: "translateY(10px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "card-rotation": "card-rotation 2000ms linear infinite",
        appear: "appear 300ms ease-in forwards",
      },
      height: {
        "fit-content": "fit-content",
      },
      width: {
        "max-content": "max-content",
        "fit-content": "fit-content",
        "min-content": "min-content",
      },
      minHeight: ({ theme }) => ({
        ...theme("height"),
      }),
      maxWidth: ({ theme }) => ({
        ...theme("width"),
        ...theme("screens"),
        unset: "unset",
      }),
      maxHeight: ({ theme }) => ({
        ...theme("height"),
        unset: "unset",
      }),
      opacity: {
        "2.5": "0.025",
        "3.5": "0.035",
        "7.5": "0.075",
      },
      spacing: {
        "7/12": `${(7 / 12) * 100}%`,
        "1ex": "1ex",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-logical"), require("@tailwindcss/typography")],
};
