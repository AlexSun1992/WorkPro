import { mount } from "@vue/test-utils";
import ControlUploader from "./ControlUploader.vue";

// function DataTransfer() {
//     this.items = new Set();
//     this.files = this.items;
//   }
// jest.mock(DataTransfer);
//

describe("ControlUploader", () => {
  let wrapper;
  const dataProps = {
    label: "Добавить файл",
    type: "Uploader",
    id: "77",
    fieldId: 48934,
    cols: 3,
    colSm: 12,
    colMd: 12,
    colLg: 12,
    width: "100%",
    name: "STEXT",
    labelCols: "",
    webId: "",
    visible: true,
    required: true,
    page: 0,
    readonly: false,
    control: null,
    state: null,
    checked: null,
    error: null,
    isRelation: false,
    fieldRelation: null,
    isTab: false,
  };

  const data = "Здесь текст для файла или положите в переменную Blob";
  const elem = new File([data], "primer.txt", { type: "text/plain" });
  //
  // const blob = new Blob(["Hello, world!"], { type: "text/plain" });
  //
  // const dt = new DataTransfer();
  // dt.items.add(file);

  const createComponent = () => {
    wrapper = mount(ControlUploader, {
      propsData: {
        data: dataProps,
      },
      mocks: {
        $refs: {
          file: {
            files: elem,
          },
        },
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Проверяем отображение компонента", () => {
    createComponent();
    // Находим кнопку по селектору
    // const getBtnSelector = "[type=button]";
    // const getBtn = wrapper.find(getBtnSelector);
    // getBtn.trigger("click");
    //
    console.log("wrapper:", wrapper.html());
    // const data = "Здесь текст для файла или положите в переменную Blob";
    // const elem = new File([data], "primer.txt", { type: "text/plain" });
    console.log("elem:", elem);
    expect(wrapper).not.toBe(null);
  });
});
