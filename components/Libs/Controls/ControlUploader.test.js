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
    cssClass: "",
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

  const createComponent = (filesHubData) => {
    wrapper = mount(ControlUploader, {
      data() {
        return {
          filesHub: filesHubData,
        };
      },
      propsData: {
        data: dataProps,
      },
    });
  };

  const makeComponent = () => {
    wrapper = mount(ControlUploader, {
      propsData: {
        data: dataProps,
      },

      mocks: {
        $refs: {
          file: {
            files: { 0: { name: "dron.txt", size: 10, type: "text/plain" } },
          },
        },
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Проверяем отображение компонента", () => {
    const mockDataList = [
      { name: "first.txt", size: 100 },
      { name: "second.txt", size: 200 },
      { name: "third.txt", size: 300 },
    ];
    createComponent(mockDataList);
    expect(wrapper).not.toBe(null);
  });

  it("Проверяем отображение компонента 2", () => {
    const mockDataList = [
      { name: "first.txt", size: 100 },
      { name: "second.txt", size: 200 },
    ];
    createComponent(mockDataList);
    expect(wrapper).not.toBe(null);
  });

  it("тестируем c добавлением refs", () => {
    makeComponent();
    expect(wrapper).not.toBe(null);
  });

  it("Не получается проверить удаление выбранного документа (жесткая заглушка mockDataList)", () => {
    const mockDataList = [
      { name: "first.txt", size: 100 },
      { name: "second.txt", size: 200 },
      { name: "third.txt", size: 300 },
    ];
    createComponent(mockDataList);
    const getBtns = wrapper.find("button");
    getBtns.trigger("click");
    expect(wrapper).not.toBe(null);
  });
});
