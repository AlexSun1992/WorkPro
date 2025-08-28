export const uploadDropTestData = {
  files: [
    new File([], "test.unknown", { type: "application/unknown" }),
    new File([], "test.pdf", { type: "application/pdf" }),
    new File([], "test.png", { type: "image/png" }),
    new File([], "test.text", { type: "text/plain" }),
  ],
  fileExtensions: ["pdf", "jpg", "jpeg", "bmp", "png", "tif", "gif"],
};
