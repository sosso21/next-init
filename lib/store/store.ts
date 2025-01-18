"use client";
import { create } from "zustand";

export enum contactKindEnum {
  CONTACT_US = "contact-us",
  QUOTE = "quote",
}

interface ContactState {
  contactKind: contactKindEnum;
  setKind: (kind: contactKindEnum) => void;
}

export const contactKindStore = create<ContactState>()((set) => ({
  contactKind: contactKindEnum.CONTACT_US,
  setKind: (kind) => set((state) => ({ contactKind: kind })),
}));
