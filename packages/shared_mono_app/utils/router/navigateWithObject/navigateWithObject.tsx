import { navigate } from "shared_mono_app/utils/router";
import { setTransfer } from "./routerTransfer";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function navigateWithObject(path: string, data?: any) {
  const key = Date.now().toString() + Math.random().toString(16).slice(2);
  setTransfer(key, data);
  Platform.OS === "web"
    ? navigate(path, { navKey: key })
    : navigate(`${path}?navKey=${encodeURIComponent(key)}`);
}
