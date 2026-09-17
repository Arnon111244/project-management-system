import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

export const DownloadFile = async (
  base64: string,
  fileName: string,
  mimeType: string = "application/pdf",
) => {
  const finalName =
    mimeType === "application/pdf" && !fileName.toLowerCase().endsWith(".pdf")
      ? `${fileName}.pdf`
      : fileName;

  const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
  if (!dir) throw new Error("No writable directory available");

  const fileUri = `${dir}${finalName}`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle: finalName,
      UTI: mimeType === "application/pdf" ? "com.adobe.pdf" : undefined,
    });
  }

  return fileUri;
};
