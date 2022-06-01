// @ts-ignore
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "./../../tailwind.config";

const tailwindTheme = resolveConfig(tailwindConfig).theme;

export const jokeDAOTheme = {
  fonts: {
    body: tailwindTheme.fontFamily.sans.toString(),
  },
  colors: {
    actionButtonBorder: "transparent",
    accentColor: tailwindTheme.colors.primary[9],
    accentColorForeground: tailwindTheme.colors.primary[1],
    error: tailwindTheme.colors.negative[10],
    connectButtonInnerBackground: "rgba(255, 255, 255, 0.1)",
    connectButtonBackground: tailwindTheme.colors.neutral[2],
    connectButtonTextError: tailwindTheme.colors.negative[11],
    modalText: tailwindTheme.colors["true-white"],
    modalTextDim: tailwindTheme.colors.neutral[10],
    modalTextSecondary: tailwindTheme.colors.neutral[11],
    closeButtonBackground: tailwindTheme.colors.neutral[0],
    closeButton: tailwindTheme.colors.neutral[11],
    actionButtonSecondaryBackground: tailwindTheme.colors.primary[1],
    modalBorder: tailwindTheme.colors.neutral[4],
    generalBorder: tailwindTheme.colors.neutral[4],
    generalBorderDim: tailwindTheme.colors.neutral[2],
    menuItemBackground: tailwindTheme.colors.primary[2],
    modalBackground: tailwindTheme.colors.neutral[0],
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    connectionIndicator: tailwindTheme.colors.positive[11],
    standby: tailwindTheme.colors.primary[11],
  },
  radii: {
    actionButton: tailwindTheme.borderRadius.full,
    connectButton: tailwindTheme.borderRadius.full,
    menuButton: tailwindTheme.borderRadius.md,
    modal: tailwindTheme.borderRadius.lg,
    modalMobile: tailwindTheme.borderRadius.lg,
  },
};
