import { create } from "zustand";

interface StoreState {
  avatars: { [key: string]: string };
  setAvatar: (ethereumAddress: string, avatarUrl: string) => void;
}

export const useAvatarStore = create<StoreState>(set => ({
  avatars: {},
  setAvatar: (ethereumAddress, avatarUrl) =>
    set(state => ({
      avatars: { ...state.avatars, [ethereumAddress]: avatarUrl },
    })),
}));
