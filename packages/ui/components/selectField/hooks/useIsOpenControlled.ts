import { useState, useMemo, useCallback } from "react";

export function useIsOpenControlled() {
  const [open, setOpen] = useState(false);

  const openDropdown = useMemo(() => {
    let locked = false;
    return () => {
      if (locked) return;
      locked = true;
      setOpen(true);
      setTimeout(() => (locked = false), 250);
    };
  }, []);

  const closeDropdown = useCallback(() => setOpen(false), []);

  return { open, openDropdown, closeDropdown };
}
