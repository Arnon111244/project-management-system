export const DownloadFile = async (
  base64: string,
  fileName: string,
  mimeType: string = "application/pdf",
) => {
  const finalName =
    mimeType === "application/pdf" && !fileName.toLowerCase().endsWith(".pdf")
      ? `${fileName}.pdf`
      : fileName;

  const byteCharacters = atob(base64);
  const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) =>
    byteCharacters.charCodeAt(i),
  );
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = finalName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};
