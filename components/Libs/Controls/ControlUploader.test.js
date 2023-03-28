import { mount } from "@vue/test-utils";
import ControlUploader from "./ControlUploader.vue";

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

  //  mocks: {
  //     $refs: {file: {files: dt.files},},
  //   },

  const createComponent = () => {
    wrapper = mount(ControlUploader, {
      propsData: {
        data: dataProps,
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Проверяем отображение компонента", () => {
    createComponent();
    const getBtnSelector = "[type=button]";
    const getBtn = wrapper.find(getBtnSelector);
    getBtn.trigger("click");
    expect(wrapper).not.toBe(null);
  });
});
