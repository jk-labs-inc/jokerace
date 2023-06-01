const typography = {
  fontSizeMin: 1.125,
  fontSizeMax: 1.25,
  msFactorMin: 1.125,
  msFactorMax: 1.2,
  lineHeight: 1.6,
};

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
      "3xl": remToPx(screensRem["3xl"]),
    },
    fontFamily: {
      sabo: ['"Sabo", sans-serif'],
      sans: ['"Lato", sans-serif'],
      mono: ["monospace"],
    },
    fontSize: {
      "3xs": clamp(-3),
      "2xs": clamp(-2),
      xs: clamp(-1),
      sm: clamp(-0.5),
      base: clamp(0),
      prose: clamp(0.25),
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
        7: "#645822",
        8: "#705e00",
        9: "#f5d90a",
        10: "#FFE25B",
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
        0: "#121212",
        1: "#161618",
        2: "#1E1E1E",
        3: "#232326",
        4: "#28282c",
        5: "#2e2e32",
        6: "#34343a",
        7: "#3e3e44",
        8: "#504f57",
        9: "#6A6A6A",
        10: "#7e7d86",
        11: "#E5E5E5",
        12: "#ededef",
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
              fontSize: clamp(0),
              marginTop: "0.5em",
              marginBottom: "0.5em",
              lineHeight: 1.75,
            },
            br: {
              display: "block",
              marginBottom: "0.75em",
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
        fadeInLanding: "fadeIn 3s cubic-bezier(0.39, 0.575, 0.565, 1) both",
        fadeOut: "fadeOut 2s ease-out both",
        blinkShadow: "blink 1.5s ease-in-out infinite",
        shakeTop: "shakeTop 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both",
        swingInLeft: "swingInLeft 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both",
      },

      height: {
        "fit-content": "fit-content",
      },
      backgroundImage: {
        "gradient-next": "linear-gradient(90deg, #FFDD3E 0%, #78FFC6 96.62%)",
        "gradient-create": "linear-gradient(90deg, #BB65FF 0%, #FFE25B 96.62%)",
      },
      boxShadow: {
        "create-header": "0 3px 4px 0 rgba(255, 226, 91, 0.6)",
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
  plugins: [require("tailwindcss-logical"), require("@tailwindcss/typography")],
};
