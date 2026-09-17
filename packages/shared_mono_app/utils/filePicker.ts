import { Platform } from "react-native";
import { useCallback, useRef } from "react";

export type MimeType =
  // PDF
  | "application/pdf"

  // Microsoft Word
  | "application/msword" // .doc
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx

  // Microsoft Excel
  | "application/vnd.ms-excel" // .xls
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx

  // Microsoft PowerPoint
  | "application/vnd.ms-powerpoint" // .ppt
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx

  // Images
  | "image/png"
  | "image/jpeg"
  | "image/gif"

  // Audio
  | "audio/mpeg" // .mp3

  // Video
  | "video/mp4"
  | "video/x-msvideo" // .avi
  | "video/x-matroska" // .mkv
  | "video/webm"

  // Generic fallback
  | string;

const DEFAULT_ACCEPT: MimeType[] = [
  // PDF
  "application/pdf",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text / Data
  "text/csv",
  "application/json",

  // Images
  "image/png",
  "image/jpeg",
  "image/gif",
];

export interface PickedFileDescriptor {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string | null;
  /** Only available on web */
  file?: File;
}

export interface FilePickerOptions {
  /** MIME types or extensions (e.g. ".pdf"). Defaults to PDFs, Docs and PNG/JPEG. */
  types?: MimeType[];
  multiple?: boolean;
}

export interface FilePickerResult {
  cancelled: boolean;
  files: PickedFileDescriptor[];
  error?: string;
}

const isWeb = Platform.OS === "web";

export async function openUniversalFilePicker(
  options: FilePickerOptions = {},
): Promise<FilePickerResult> {
  const accept = options.types?.length ? options.types : DEFAULT_ACCEPT;

  try {
    if (isWeb) {
      return await pickFilesWeb({ accept, multiple: options.multiple });
    }
    return await pickFilesNative({ accept, multiple: options.multiple });
  } catch (error) {
    return {
      cancelled: true,
      files: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function pickFilesNative({
  accept,
  multiple,
}: {
  accept: MimeType[];
  multiple?: boolean;
}): Promise<FilePickerResult> {
  let DocumentPicker: typeof import("expo-document-picker");
  try {
    DocumentPicker = await import("expo-document-picker");
  } catch (error) {
    throw new Error(
      "expo-document-picker is required on native platforms. Install it with `npx expo install expo-document-picker`.",
    );
  }

  const result = await DocumentPicker.getDocumentAsync({
    type: accept,
    multiple,
    copyToCacheDirectory: true,
  });

  if ("canceled" in result && result.canceled) {
    return { cancelled: true, files: [] };
  }

  const assets = "assets" in result ? (result.assets ?? []) : [result];

  const files: PickedFileDescriptor[] = assets
    .filter((asset) => asset && asset.uri)
    .map((asset) => ({
      name: asset.name || asset.uri?.split("/").pop() || "file",
      uri: asset.uri,
      size: asset.size,
      mimeType: asset.mimeType ?? undefined,
    }));

  return {
    cancelled: files.length === 0,
    files,
  };
}

function pickFilesWeb({
  accept,
  multiple,
}: {
  accept: MimeType[];
  multiple?: boolean;
}): Promise<FilePickerResult> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = Boolean(multiple);
    input.accept = accept.join(",");
    input.style.display = "none";

    // متغير لتتبع ما إذا تم حل الـ Promise بالفعل
    let resolved = false;

    const cleanup = () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
      // إزالة مستمعي الأحداث
      window.removeEventListener("focus", handleWindowFocus);
    };

    // معالجة حالة الإلغاء عند عودة التركيز إلى النافذة
    const handleWindowFocus = () => {
      // إعطاء وقت لـ onchange للتنفيذ
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve({ cancelled: true, files: [] });
        }
      }, 300);
    };

    // استمع لعودة التركيز للنافذة (يحدث بعد إغلاق نافذة اختيار الملف)
    window.addEventListener("focus", handleWindowFocus);

    input.onchange = () => {
      if (resolved) return;

      resolved = true;
      const fileList = Array.from(input.files ?? []);

      // إزالة مستمع الحدث قبل التنظيف
      window.removeEventListener("focus", handleWindowFocus);
      cleanup();

      if (!fileList.length) {
        resolve({ cancelled: true, files: [] });
        return;
      }

      const files: PickedFileDescriptor[] = fileList.map((file) => ({
        name: file.name,
        uri: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type,
        file,
      }));

      resolve({ cancelled: false, files });
    };

    // معالجة حالة الإلغاء عبر oncancel (مدعوم في بعض المتصفحات)
    if ("oncancel" in input) {
      (input as any).oncancel = () => {
        if (resolved) return;

        resolved = true;
        window.removeEventListener("focus", handleWindowFocus);
        cleanup();
        resolve({ cancelled: true, files: [] });
      };
    }

    document.body.appendChild(input);

    // حفظ مرجع للـ input لاستخدامه في حالة الخطأ
    const clickTimeout = setTimeout(() => {
      if (!resolved) {
        // إذا مر وقت طويل ولم يتم حل الـ Promise، نفترض حدوث خطأ
        resolved = true;
        window.removeEventListener("focus", handleWindowFocus);
        cleanup();
        resolve({ cancelled: true, files: [], error: "Timeout" });
      }
    }, 60000); // 60 ثانية كحد أقصى

    input.click();

    // إزالة timeout بعد النقر (سيتم الإبقاء عليه فقط في حالة عدم الحل)
    input.onfocus = () => {
      clearTimeout(clickTimeout);
    };
  });
}

export function useUniversalFilePicker(defaultOptions?: FilePickerOptions) {
  const pickFiles = useCallback(
    (overrides?: FilePickerOptions) =>
      openUniversalFilePicker({ ...defaultOptions, ...overrides }),
    [defaultOptions],
  );

  return { pickFiles };
}
