import { useEffect, useRef, useState } from "react";
import { useRouter } from "shared_mono_app/utils/router";
import { takeTransfer } from "./routerTransfer";

export function useNavData<T = any>(): T | null {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const navKey = router.getParam("navKey");
    if (navKey) {
      const result = takeTransfer<T>(navKey);
      if (result !== undefined) {
        setData(result);
        hasProcessed.current = true;
      } else {
        setData(null);
      }
    } else {
      setData(null);
    }
  }, [router]);

  return data;
}
