// src/store/useRoleStore.ts
"use client";

import { create } from "zustand";

interface RoleState {
  role: string;
  setRole: (role: string) => void;
  canManage: boolean;
  setCanManage: (canManage: boolean) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: "STUDENT",
  setRole: (role) => set({ role }),
  canManage: false,
  setCanManage: (canManage) => set({ canManage }),
}));
