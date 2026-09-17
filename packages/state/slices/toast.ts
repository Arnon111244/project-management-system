// slices/toast.ts
import React from "react";

export type Toast = {
  message: string;
  color?: string;
  textColor?: string;
  icon?: React.ReactNode;
  duration?: number;
  status?: Boolean;
};

export type ToastSlice = {
  toast: Toast | null;
  showToast: (v: Toast) => void;
  hideToast: () => void;
};

export const createToastSlice = (
  set: any,
  get: any,
  store: any,
): ToastSlice => ({
  toast: null,

  showToast: (v: Toast) =>
    set(() => ({
      toast: v,
    })),

  hideToast: () =>
    set(() => ({
      toast: null,
    })),
});
