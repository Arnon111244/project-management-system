import {
  DEMO_APK_FILE,
  DEMO_APK_PATH,
} from "shared_mono_app/constants/product";

export function downloadDemoApk() {
  const link = document.createElement("a");
  link.href = DEMO_APK_PATH;
  link.download = DEMO_APK_FILE;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
