const typography = {
  fontSizeMin: 1.125,
  fontSizeMax: 1.25,
  msFactorMin: 1.125,
  msFactorMax: 1.2,
  lineHeight: 1.6,
};

// 4xl = 1660px
// 3xl = 1500px
// 2xl = 1350px
// xl = 1280px
// lg = 1024px
// md = 768px
// sm = 640px
// xs = 480px
// 2xs = 320px
// min = 320px

const screensRem = {
  min: 20,
  "2xs": 30,
  xs: 36,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 84.375,
  "3xl": 93.75,
  "4xl": 103.75,
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
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
      "3xl": remToPx(screensRem["3xl"]),
      "4xl": remToPx(screensRem["4xl"]),
    },
    fontFamily: {
      sabo: ["var(--font-sabo)"],
      sans: ["var(--font-lato)"],
      mono: ["monospace"],
    },
    fontSize: {
      "3xs": clamp(-3),
      "2xs": clamp(-2),
      xs: clamp(-1),
      sm: clamp(-0.5),
      base: clamp(0),
      prose: "16px",
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
      "custom-h1": clamp(3),
      "custom-h2": clamp(1.5),
      "custom-h3": clamp(1.2),
      "custom-h4": clamp(0.5),
    },
    colors: {
      transparent: "transparent",
      inherit: "inherit",
      current: "currentColor",
      "true-white": "#ffffff",
      "true-black": "#000000",
      blue: "#1E81E2",
      primary: {
        1: "#1a1a1a",
        2: "#242424",
        3: "#3d3d3d",
        4: "#352800",
        5: "#3e3e3e",
        6: "#493c00",
        7: "#645822",
        8: "#705e00",
        9: "#f5d90a",
        10: "#FFE25B",
        11: "#f0c000",
        12: "#fffad1",
      },
      secondary: {
        1: "#141414",
        2: "#221527",
        3: "#301a3a",
        4: "#3a1e48",
        5: "#432155",
        6: "#4e2667",
        7: "#5f2d84",
        8: "#7938b2",
        9: "#8e4ec6",
        10: "#9d5bd2",
        11: "#BB65FF",
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
        11: "#78FFC6",
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
        11: "#FF78A9",
        12: "#feecf4",
      },
      neutral: {
        0: "#212121",
        1: "#151515",
        2: "#1E1E1E",
        3: "#232326",
        4: "#28282c",
        5: "#2e2e32",
        6: "#34343a",
        7: "#323232",
        8: "#5E707699",
        9: "#9D9D9D",
        10: "#6A6A6A",
        11: "#E5E5E5",
        12: "#CDCDCD",
        13: "#8E8E8E",
        14: "#A1A1A1",
        15: "#D0D0D0",
      },
    },
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme("colors.true-white"),
            "--tw-prose-invert-hr": theme("colors.neutral.4"),
            fontSize: theme("fontSize.base"),
            p: {
              fontSize: "16px",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              lineHeight: 1.75,
            },
            span: {
              fontSize: "16px",
            },
            h1: {
              fontSize: clamp(3),
              lineHeight: 1.5,
              marginTop: "0.7em",
              marginBottom: "0.7em",
            },
            h2: {
              fontSize: clamp(1.5),
              lineHeight: 1.5,
              marginTop: "1em",
              marginBottom: "1em",
            },
            h3: {
              fontSize: clamp(1.2),
              lineHeight: 1.5,
              marginTop: "1em",
              marginBottom: "1em",
            },
            h4: {
              fontSize: clamp(0.5),
              lineHeight: 1.5,
              marginTop: "1em",
              marginBottom: "1em",
              fontWeight: theme("fontWeight.bold"),
            },
            h5: {
              fontSize: clamp(0.3),
              lineHeight: 1.5,
              marginTop: "1em",
              marginBottom: "1em",
              fontWeight: theme("fontWeight.bold"),
            },
            li: {
              p: {
                marginTop: 0,
                marginBottom: 0,
              },
            },
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
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        swingInLeft: {
          "0%": {
            transform: "rotateY(70deg)",
            transformOrigin: "left",
            opacity: "0",
          },
          "100%": {
            transform: "rotateY(0deg)",
            transformOrigin: "left",
            opacity: "1",
          },
        },
        blink: {
          "0%": { opacity: "1" },
          "60%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
        shakeTop: {
          "0%": { transform: "translateY(0)" },
          "10%, 90%": { transform: "translateY(-2px)" },
          "20%, 80%": { transform: "translateY(2px)" },
          "30%, 50%, 70%": { transform: "translateY(-4px)" },
          "40%, 60%": { transform: "translateY(4px)" },
          "100%": { transform: "translateY(0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        reveal: {
          "0%": {
            mask: "linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 150% 0 / 400% no-repeat",
            opacity: ".2",
          },
          "100%": {
            mask: "linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 0 / 400% no-repeat",
            opacity: "1",
          },
        },
        "flicker-number": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      scale: {
        120: "1.1",
      },
      transitionProperty: {
        transform: "transform",
        "border-color": "border-color",
        gradient: "background-position",
      },
      animation: {
        "card-rotation": "card-rotation 2000ms linear infinite",
        appear: "appear 300ms ease-in forwards",
        fadeIn: "fadeIn 1s cubic-bezier(0.39, 0.575, 0.565, 1) both",
        fadeInInfinite: "fadeIn cubic-bezier(0.39, 0.575, 0.565, 1) infinite both",
        fadeInLanding: "fadeIn 3s cubic-bezier(0.39, 0.575, 0.565, 1) both",
        fadeOut: "fadeOut 2s ease-out both",
        blinkShadow: "blink 1s ease-in-out infinite",
        shakeTop: "shakeTop 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both",
        swingInLeft: "swingInLeft 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both",
        flicker: "flicker 1s linear",
        "flicker-infinite": "flicker 1s linear infinite",
        reveal: "reveal 1s ease-in-out",
        "flicker-number": "flicker-number 0.5s infinite",
      },

      height: {
        "fit-content": "fit-content",
      },
      backgroundImage: {
        "gradient-next": "linear-gradient(90deg, #FFDD3E 0%, #78FFC6 96.62%)",
        "gradient-create": "linear-gradient(90deg, #BB65FF 0%, #78FFC6 100%)",
        "gradient-share-submission": "linear-gradient(90deg, #FFE25B 0%, #BB65FF 96.62%)",
        "gradient-vote": "linear-gradient(93.06deg, #78FFC6 0%, #BB65FF 100%)",
        "gradient-distribute": "linear-gradient(180deg, #B0FED4 0%, #78FFC6 50%, #4A9575 100%)",
        "gradient-withdraw": "linear-gradient(180deg, #FF78A9 0%, #f04f88 50%, #e93d82 100%)",
        "gradient-reward-recipients": "linear-gradient(90deg, #78FFC6 0%,#FFE25B 100%)",
        "gradient-purple": "linear-gradient(90deg, #BB65FF 0%, #E5E5E5 100%)",
        "gradient-green": "linear-gradient(90deg, #78FFC6 0%, #FFFFFF 100%)",
        "gradient-radial": "radial-gradient(50% 50% at 50% 50%, #391F4D 0%, #000000 100%)",
        "gradient-fade-black-purple":
          "linear-gradient(to bottom, #000000 0%, #050408 15%, #0a0610 25%, #100816 40%, #100816 60%, #0a0610 75%, #050408 85%, #000000 100%)",
        "gradient-purple-white": "linear-gradient(90deg, #C293FF 0%, #FFFFFF 100%)",
        "gradient-gray": "linear-gradient(90deg, #A1A1A1 0%, #E5E5E5 100%)",
        "gradient-light-pink": "linear-gradient(90deg, #FF78A9 0%, #E5E5E5 100%)",
        "gradient-title": "linear-gradient(180deg, #FFFFFF 0%, #A1A1A1 100%)",
      },
      boxShadow: {
        "create-header": "0 3px 4px 0 rgba(106, 106, 106, 1)",
        "timer-container": "3px 3px 4px rgba(106, 106, 106, 1)",
        dialog: "0px 1px 6px 1px rgba(157, 157, 157, 1)",
        sortProposalDropdown: "0px 1px 6px 1px #6A6A6A;",
        "proposal-card": "1px 1px 5px 0px #E5E5E5",
        "file-upload": "0 0px 15px rgba(121, 121, 121, 0.3)",
        "prompt-preview": "0px 0px 4px 2px #3E3E3E",
        "entry-card": "0 0px 15px rgba(121, 121, 121, 0.3)",
        "split-fee-destination": "0 0 1px 1px rgba(106, 106, 106, 1)",
      },

      backgroundColor: {
        ffdd3e: "#FFDD3E",
        "78ffc6": "#78FFC6",
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
        2.5: "0.025",
        3.5: "0.035",
        7.5: "0.075",
      },
      spacing: {
        "7/12": `${(7 / 12) * 100}%`,
        "1ex": "1ex",
      },
    },
  },
  variants: {
    extend: {
      scale: ["hover"],
      transform: ["hover"],
    },
  },
  plugins: [require("tailwindcss-logical"), require("@tailwindcss/typography"), require("tailwind-scrollbar-hide")],
};
