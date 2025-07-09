import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";

import ControlUploadFiles from "./ControlUploadFiles.vue";
import { propsData } from "./ControlUploadFiles.hepler.fixtures";

import * as uploader from "../../../../store/uploader";
import * as dataCard from "../../../../store/data_card";

const formData = new FormData();
const mockDock = [
  {
    FILENAME: "ОСАГО.pdf",
    SIZE: 195885,
    NAME: "EPROTOKOLGUILTY1",
  },
  {
    FILENAME: "ОСАГО.pdf",
    SIZE: 195885,
    NAME: "EPROTOKOLGUILTY1",
  },
  {
    FILENAME: "ОСАГО.pdf",
    SIZE: 195885,
    NAME: "EPROTOKOLGUILTY1",
  },
];
formData.append("JSON", JSON.stringify({ FILES: mockDock }));

jest.mock("axios");

describe("ControlUploadFiles", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  beforeEach(async () => {
    store = new Vuex.Store({
      modules: {
        uploader: {
          ...uploader,
          namespaced: true,
        },
        dataCard: {
          ...dataCard,
          namespaced: true,
        },
      },
    });
    process.server = true;
    store.$axios = axios;
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("Проверка прикрепления и отправки файлов с одинаковым именем", async () => {
    wrapper = mount(ControlUploadFiles, {
      localVue,
      mocks: {
        $store: store,
      },
      propsData,
    });
    const FILE1 = new File(["1"], "EPROTOKOLGUILTY1.pdf");
    const FILE2 = new File(["11"], "EPROTOKOLGUILTY1.pdf");
    const FILE3 = new File(["111"], "EPROTOKOLGUILTY1.pdf");
    const FILE4 = new File(["1111"], "EPROTOKOLGUILTY1.pdf");

    await store.dispatch("uploader/addData", {
      data: [FILE1, FILE2],
      name: "EPROTOKOLGUILTY1",
    });
    await store.dispatch("uploader/addData", {
      data: [FILE3, FILE4],
      name: "EPROTOKOLGUILTY2",
    });

    const files = wrapper.findAll(".namefile");
    expect(files).toHaveLength(4);

    const getFormData = await store.getters["uploader/getFormData"];

    const fileSizes1 = Array.from(getFormData)
      .filter((item) => item[0] === "EPROTOKOLGUILTY1")
      .map((file) => file[1].size);
    expect(fileSizes1).toHaveLength(2);
    expect(fileSizes1[0]).toBe(1);
    expect(fileSizes1[1]).toBe(2);

    const fileSizes2 = Array.from(getFormData)
      .filter((item) => item[0] === "EPROTOKOLGUILTY2")
      .map((file) => file[1].size);
    expect(fileSizes2).toHaveLength(2);
    expect(fileSizes2[0]).toBe(3);
    expect(fileSizes2[1]).toBe(4);
  });
  it("Проверка отображения загруженных файлов", async () => {
    wrapper = mount(ControlUploadFiles, {
      localVue,
      mocks: {
        $store: store,
      },
      computed: {
        getTypesDocumentation() {
          return [
            {
              TYPE_TITLE: "Обязательные документы",
              TYPE_DESCRIPTION: "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
              DOCS: [
                {
                  MAX_FILE_SIZE: 3145728,
                  DESCRIPTION: "",
                  TITLE: "Лицевая сторона бумажного бланка Извещения о ДТП",
                  MIN_FILE_COUNT: 1,
                  MAX_FILE_COUNT: 3,
                  TYPE_TITLE: "Обязательные документы",
                  TYPE_DESCRIPTION: "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
                  NAME: "EPROTOKOLGUILTY1",
                  FILES: [
                    {
                      FILENAME: "ОСАГО.pdf",
                      SIZE: 195885,
                      NAME: "EPROTOKOLGUILTY1",
                    },
                  ],
                },
                {
                  MAX_FILE_SIZE: 3145728,
                  DESCRIPTION: "",
                  TITLE: "Оборотная сторона бумажного бланка Извещения о ДТП",
                  MIN_FILE_COUNT: 1,
                  MAX_FILE_COUNT: 3,
                  TYPE_TITLE: "Обязательные документы",
                  TYPE_DESCRIPTION: "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
                  NAME: "EPROTOKOLGUILTY2",
                  FILES: [
                    {
                      FILENAME: "ОСАГО.pdf",
                      SIZE: 195885,
                      NAME: "EPROTOKOLGUILTY2",
                    },
                  ],
                },
              ],
            },
            {
              TYPE_TITLE: "Дополнительные документы",
              TYPE_DESCRIPTION: "",
              DOCS: [
                {
                  MAX_FILE_SIZE: 3145728,
                  DESCRIPTION: "",
                  TITLE: "Фото с места ДТП",
                  MIN_FILE_COUNT: 0,
                  MAX_FILE_COUNT: 10,
                  TYPE_TITLE: "Дополнительные документы",
                  TYPE_DESCRIPTION: "",
                  NAME: "PHOTO",
                  FILES: [],
                },
              ],
            },
          ];
        },
      },
      propsData,
    });

    expect(wrapper.find("[title='ОСАГО.pdf']").text()).toEqual("ОСАГО.pdf");
  });
});
