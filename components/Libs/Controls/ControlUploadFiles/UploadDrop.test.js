import { mount } from "@vue/test-utils";
import UploadDrop from "./UploadDrop.vue";
import { uploadDropTestData } from "./UploadDropTestData";
import { DataTransferMock } from "./DataTransferMock";

const mockFiles = uploadDropTestData.files;
const mockFileExtensions = uploadDropTestData.fileExtensions;
const DataTransfer = DataTransferMock;

global.DataTransfer = DataTransfer;

describe("UploadDrop", () => {
  test("DataTransferMock", () => {
    // TODO не раеализовано
    const dataTransfer = new DataTransferMock();
    const item = "some";

    dataTransfer.items.add(item);
    expect(dataTransfer.files[0] === item);
  });

  test("Check File extensions", () => {
    const wrapper = mount(UploadDrop, {
      propsData: {
        fileExtensions: mockFileExtensions,
        fileTypes: [],
        name: "Hello!",
      },
      /* $mocks: {
        $refs: {
          file: { files: mockFiles }
        }
      } */
    });

    if (wrapper) {
      jest.mock(wrapper.$refs, () => ({ file: { files: mockFiles } }));
    }

    /* wrapper.vm.handleAddFile();
    console.log(wrapper.$refs.file.files);
    console.log(wrapper.emitted('update')[0]);
    expect(wrapper.emitted()).toHaveProperty('update');
    expect(wrapper.emitted('update')).toHaveLength(1); */
  });
});
