import { parse } from "content-disposition-attachment";

export function saveFile(blob, fileName, documentType, isNewWindow = false) {
  const link = document.createElement("a");
  const objectUrl = window.URL.createObjectURL(
    new Blob([blob], {
      type: documentType,
    })
  );
  link.href = objectUrl;
  link.setAttribute("download", fileName);
  if (isNewWindow) {
    link.setAttribute("target", "_blank");
  }

  document.body.appendChild(link);
  link.click();
}

export function saveFileAxios(axiosResponse, isNewWindow) {
  if (axiosResponse === undefined) {
    return;
  }

  const responseHeaders = new Headers(axiosResponse.headers);

  const contentDisposition = responseHeaders.get("content-disposition");

  const attachmentFilename = parse(contentDisposition);

  const fileName = attachmentFilename.filename || "file.pdf";

  const contentType = responseHeaders.get("content-type");

  saveFile(axiosResponse.data, fileName, contentType, isNewWindow);
}
