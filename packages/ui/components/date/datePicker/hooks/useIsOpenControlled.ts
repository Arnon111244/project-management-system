import { useState, useCallback, useMemo } from "react";

export function useIsOpenControlled() {
  const [open, setOpen] = useState(false);

  const openPicker = useMemo(() => {
    let locked = false;
    return () => {
      if (locked) return;
      locked = true;
      setOpen(true);
      setTimeout(() => (locked = false), 250);
    };
  }, []);

  const closePicker = useCallback(() => setOpen(false), []);

  return { open, openPicker, closePicker };
}
