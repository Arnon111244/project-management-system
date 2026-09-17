import {
  FREE_SOURCE_ZIP_FILE,
  getFreeSourceZipUrl,
} from "shared_mono_app/constants/product";

export function downloadFreeSource() {
  const link = document.createElement("a");
  link.href = getFreeSourceZipUrl();
  link.download = FREE_SOURCE_ZIP_FILE;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
