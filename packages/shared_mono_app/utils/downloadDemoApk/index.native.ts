import { Linking } from "react-native";

import { getDemoApkUrl } from "shared_mono_app/constants/product";

export function downloadDemoApk() {
  void Linking.openURL(getDemoApkUrl());
}
