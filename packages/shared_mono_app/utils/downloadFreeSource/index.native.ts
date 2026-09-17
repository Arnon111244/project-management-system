import { Linking } from "react-native";

import { getFreeSourceZipUrl } from "shared_mono_app/constants/product";

export function downloadFreeSource() {
  void Linking.openURL(getFreeSourceZipUrl());
}
