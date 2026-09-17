"use client";

import { useGlobalStore } from "state/index";
import ToastMessage from "ui/components/toastMessage";

export default function ToastProviders({}: {}) {
  const toast = useGlobalStore((s) => s.toast);
  const hideToast = useGlobalStore((s) => s.hideToast);

  return (
    <>
      {toast && (
        <ToastMessage
          message={toast.message}
          color={toast.color}
          textColor={toast.textColor}
          icon={toast.icon}
          onClose={hideToast}
        />
      )}
    </>
  );
}
