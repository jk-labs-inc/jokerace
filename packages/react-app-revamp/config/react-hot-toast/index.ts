// @ts-ignore
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "./../../tailwind.config";

const tailwindTheme = resolveConfig(tailwindConfig).theme;

export const toastOptions = {
  style: {
    fontWeight: tailwindTheme.fontWeight.bold,
    fontSize: tailwindTheme.fontSize["xs"],
    borderRadius: tailwindTheme.borderRadius["md"],
    padding: tailwindTheme.padding[1],
    paddingInlineStart: tailwindTheme.padding[1.5],
  },
  blank: {
    style: {
      backgroundColor: tailwindTheme.colors.neutral[1],
      color: tailwindTheme.colors["true-white"],
      borderColor: tailwindTheme.colors.neutral[4],
      borderWidth: "1px",
      borderStyle: "solid",
    },
  },
  success: {
    iconTheme: {
      primary: tailwindTheme.colors.positive[11],
    },
    style: {
      backgroundColor: tailwindTheme.colors.positive[10],
      color: tailwindTheme.colors.positive[1],
    },
  },
  error: {
    iconTheme: {
      primary: tailwindTheme.colors.negative[9],
    },
    style: {
      backgroundColor: tailwindTheme.colors.negative[11],
      color: tailwindTheme.colors.negative[1],
    },
  },
};
