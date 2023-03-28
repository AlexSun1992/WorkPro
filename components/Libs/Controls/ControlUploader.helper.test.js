import { getSynchronizedFileList } from "./ControlUploader.helper";

const test = [
  {
    name: "drill.txt",
    lastModified: 1679907265444,
    lastModifiedDate:
      "Mon Mar 27 2023 11:54:25 GMT+0300 (Москва, стандартное время)",
    webkitRelativePath: "",
    size: 21,
    type: "text/plain",
  },
  {
    name: "drop.txt",
    lastModified: 1679907265444,
    lastModifiedDate:
      "Mon Mar 27 2023 11:54:25 GMT+0300 (Москва, стандартное время)",
    webkitRelativePath: "",
    size: 25,
    type: "text/plain",
  },
  {
    name: "dropi.txt",
    lastModified: 1679907265444,
    lastModifiedDate:
      "Mon Mar 27 2023 11:54:25 GMT+0300 (Москва, стандартное время)",
    webkitRelativePath: "",
    size: 35,
    type: "text/plain",
  },
];

// jest.mock("DataTransfer");

describe("компонент ControlUploader(объект FileList)", () => {
  it("Объект FileList", () => {
    const dataTransfer = new DataTransfer();
    const getArr = getSynchronizedFileList(test);
    expect(getArr).not.toBe(null);
  });
});
