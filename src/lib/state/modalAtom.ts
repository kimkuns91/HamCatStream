import { Content, Episode } from "@prisma/client";

import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const contentState = atom<Content | null>({
  key: "contentState",
  default: null,
});

export const volumeState = atom<number>({
  key: "volumeState",
  default: 1,
});

export const mutedState = atom<boolean>({
  key: "mutedState",
  default: false,
});