export const SIZES = {
  extraSmall: {
    avatarSizeClass: "w-6 h-6",
    textSizeClass: "text-[12px]",
  },
  compact: {
    avatarSizeClass: "w-6 h-6",
    textSizeClass: "text-[16px]",
  },
  small: {
    avatarSizeClass: "w-8 h-8",
    textSizeClass: "text-[16px]",
  },
  medium: {
    avatarSizeClass: "w-14 h-14",
    textSizeClass: "text-[18px] font-sabo-filled",
  },
  large: {
    avatarSizeClass: "w-[100px] h-[100px]",
    textSizeClass: "text-[24px] font-sabo-filled",
  },
};

export type SizeType = keyof typeof SIZES;
