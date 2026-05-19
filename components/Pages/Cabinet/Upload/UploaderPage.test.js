import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";

import UploaderPage from "./UploadPage.vue";
import {
  returnFetchData,
  params,
  returnFetchDataWithoutFiles,
} from "../../../Libs/Controls/ControlUploadFiles/UploaderPage.helper.fixtures";
import { getHash } from "../../../Libs/Controls/ControlUploadFiles/helpers";

import * as menu from "@/store/menu";

import * as uploader from "@/store/uploader";

jest.mock("axios");
jest.mock("../../../Libs/Controls/ControlUploadFiles/helpers");

describe("UploaderPage", () => {
  describe("/cabinet", () => {
    Vue.use(Vuex, BootstrapVue);
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    let store;
    let wrapper;
    let mockRoute;
    let mockRouter;

    beforeEach(async () => {
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {},
      };
      mockRouter = {
        push: jest.fn(),
      };

      store = new Vuex.Store({
        modules: {
          uploader: {
            ...uploader,
            namespaced: true,
          },
          menu: {
            ...menu,
            namespaced: true,
          },
        },
      });
      process.server = true;
      store.$axios = axios;

      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      // wrapper.destroy();
    });

    it("Страница UploaderPage загрузилась с прикрепленными файлами и 1-ой кнопкой", async () => {
      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(3);

      expect(files.at(0).text()).toBe("PASPORT.pdf");
      expect(files.at(1).text()).toBe("PTS.pdf");
      expect(files.at(2).text()).toBe("EPROTOKOL.jpeg");

      expect(wrapper.text()).toContain("Отправить документы");
      expect(wrapper.text()).not.toContain("Назад");
    });

    it("Удаляем фото паспорта", async () => {
      const buttonDeliteFile = wrapper.findAll(".btn-delite-file").at(0);

      await buttonDeliteFile.trigger("click");

      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(2);
      expect(files.at(0).text()).not.toBe("PASPORT.pdf");
      expect(files.at(1).text()).not.toBe("PASPORT.pdf");
    });

    it("Удаляем фото документа о праве собственности на ТС", async () => {
      const buttonDeliteFile = wrapper.findAll(".btn-delite-file").at(1);

      await buttonDeliteFile.trigger("click");

      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(2);
      expect(files.at(0).text()).not.toBe("PTS.pdf");
      expect(files.at(1).text()).not.toBe("PTS.pdf");
    });

    it("Удаляем фото документа бумажного бланка европротокола", async () => {
      const buttonDeliteFile = wrapper.findAll(".btn-delite-file").at(2);

      await buttonDeliteFile.trigger("click");

      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(2);
      expect(files.at(0).text()).not.toBe("EPROTOKOL.jpeg");
      expect(files.at(1).text()).not.toBe("EPROTOKOL.jpeg");
    });

    it("Добавляем фото паспорта и нажимаем на кнопку отправить документ", async () => {
      await store.dispatch("uploader/addData", {
        data: [
          {
            lastModified: 1698406945085,
            lastModifiedDate: "Fri Oct 27 2023 14:42:25 GMT+0300 (Москва, стандартное время)",
            name: "PASPORT2.pdf",
            webkitRelativePath: "",
          },
        ],
        name: "PASPORT",
      });
      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(4);
      expect(wrapper.text()).toContain("PASPORT2");

      const uploadButtons = wrapper.findComponent({ ref: "uploadButtons" });
      const spy = jest.spyOn(uploadButtons.vm.$bvModal, "msgBoxConfirm");
      spy.mockImplementationOnce(() => Promise.resolve(true));
      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));
      jest.spyOn(axios, "put").mockResolvedValueOnce({
        data: [
          {
            ID: 502,
            MESSAGE: "Успешно сохранено",
            REL: "E1A0C98A84E26B75958E890DE2706B26",
            RESULT: { ID: 502, REL: "E1A0C98A84E26B75958E890DE2706B26" },
            STATUS: 0,
          },
        ],
      });
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });

      const btnSuccess = wrapper.find(".btn-success");
      await btnSuccess.trigger("click");

      expect(axios.put).toHaveBeenCalledWith(
        "/lk/main/v2/datacard2/55/1000/502?rel=E89B40CC5734A78ADFE22496B28B1CE9",
        expect.any(FormData),
        expect.anything()
      );
    });

    it("Добавляем фото, отправить документ и апи вызывается один раз", async () => {
      await store.dispatch("uploader/addData", {
        data: [
          {
            lastModified: 1698406945085,
            lastModifiedDate: "Fri Oct 27 2023 14:42:25 GMT+0300 (Москва, стандартное время)",
            name: "PASPORT2.pdf",
            webkitRelativePath: "",
          },
        ],
        name: "PASPORT",
      });
      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(4);
      expect(wrapper.text()).toContain("PASPORT2");

      const uploadButtons = wrapper.findComponent({ ref: "uploadButtons" });
      const spy = jest.spyOn(uploadButtons.vm.$bvModal, "msgBoxConfirm");
      spy.mockImplementationOnce(() => Promise.resolve(true));
      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));
      jest.spyOn(axios, "put").mockResolvedValueOnce({
        data: [
          {
            ID: 502,
            MESSAGE: "Успешно сохранено",
            REL: "E1A0C98A84E26B75958E890DE2706B26",
            RESULT: { ID: 502, REL: "E1A0C98A84E26B75958E890DE2706B26" },
            STATUS: 0,
          },
        ],
      });
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });

      const btnSuccess = wrapper.find(".btn-success");
      await btnSuccess.trigger("click");

      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    it("Прикрепление и отправка файлов с одинаковым именем", async () => {
      const FILE1 = new File(["1"], "EPROTOKOL.jpeg");
      const FILE2 = new File(["11"], "EPROTOKOL.jpeg");
      const FILE3 = new File(["111"], "EPROTOKOL.jpeg");
      const FILE4 = new File(["1111"], "EPROTOKOL.jpeg");

      await store.dispatch("uploader/addData", {
        data: [FILE1, FILE2],
        name: "EPROTOKOL",
      });

      await store.dispatch("uploader/addData", {
        data: [FILE3],
        name: "PASPORT",
      });

      await store.dispatch("uploader/addData", {
        data: [FILE4],
        name: "PTS",
      });

      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(7);

      const uploadButtons = wrapper.findComponent({ ref: "uploadButtons" });
      const spy = jest.spyOn(uploadButtons.vm.$bvModal, "msgBoxConfirm");
      spy.mockImplementationOnce(() => Promise.resolve(true));
      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));
      jest.spyOn(axios, "put").mockResolvedValueOnce({
        data: [
          {
            ID: 502,
            MESSAGE: "Успешно сохранено",
            REL: "E1A0C98A84E26B75958E890DE2706B26",
            RESULT: { ID: 502, REL: "E1A0C98A84E26B75958E890DE2706B26" },
            STATUS: 0,
          },
        ],
      });

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });

      const btnSuccess = wrapper.find(".btn-success");
      await btnSuccess.trigger("click");

      const formData = axios.put.mock.calls[0][1];

      const fileSizes1 = Array.from(formData)
        .filter((item) => item[0] === "EPROTOKOL")
        .map((file) => file[1].size);

      expect(fileSizes1).toHaveLength(2);
      expect(fileSizes1[0]).toBe(1);
      expect(fileSizes1[1]).toBe(2);

      const fileSizes2 = Array.from(formData)
        .filter((item) => item[0] === "PASPORT")
        .map((file) => file[1].size);

      expect(fileSizes2).toHaveLength(1);
      expect(fileSizes2[0]).toBe(3);

      const fileSizes3 = Array.from(formData)
        .filter((item) => item[0] === "PTS")
        .map((file) => file[1].size);

      expect(fileSizes3).toHaveLength(1);
      expect(fileSizes3[0]).toBe(4);

      expect(axios.put).toHaveBeenCalledWith(
        "/lk/main/v2/datacard2/55/1000/502?rel=E89B40CC5734A78ADFE22496B28B1CE9",
        expect.any(FormData),
        expect.anything()
      );

      await store.dispatch("uploader/addData", {
        data: [FILE4],
        name: "PTS",
      });
      spy.mockImplementationOnce(() => Promise.resolve(true));

      jest.spyOn(axios, "put").mockResolvedValueOnce({
        data: [
          {
            ID: 502,
            MESSAGE: "Успешно сохранено",
            REL: "E1A0C98A84E26B75958E890DE2706B26",
            RESULT: { ID: 502, REL: "E1A0C98A84E26B75958E890DE2706B26" },
            STATUS: 0,
          },
        ],
      });

      expect(axios.put).toHaveBeenCalledWith(
        "/lk/main/v2/datacard2/55/1000/502?rel=E89B40CC5734A78ADFE22496B28B1CE9",
        expect.any(FormData),
        expect.anything()
      );
    });

    it("Modal отключен", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));
      copyOfData.data[0].value.MODAL_OPEN = false;

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      jest.spyOn(axios, "put").mockResolvedValueOnce({
        data: [
          {
            ID: 502,
            MESSAGE: "Успешно сохранено",
            REL: "E1A0C98A84E26B75958E890DE2706B26",
            RESULT: { ID: 502, REL: "E1A0C98A84E26B75958E890DE2706B26" },
            STATUS: 0,
          },
        ],
      });
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });

      const btnSuccess = wrapper.find(".btn-success");
      await btnSuccess.trigger("click");

      expect(axios.put).toHaveBeenCalledWith(
        "/lk/main/v2/datacard2/55/1000/502?rel=E89B40CC5734A78ADFE22496B28B1CE9",
        expect.any(FormData),
        expect.anything()
      );
    });

    it("Modal подключен", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));
      copyOfData.data[0].value.MODAL_OPEN = true;

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      const uploadButtons = wrapper.findComponent({ ref: "uploadButtons" });
      const spy = jest.spyOn(uploadButtons.vm.$bvModal, "msgBoxConfirm");
      spy.mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(axios, "put").mockResolvedValueOnce({
        data: [
          {
            ID: 502,
            MESSAGE: "Успешно сохранено",
            REL: "E1A0C98A84E26B75958E890DE2706B26",
            RESULT: { ID: 502, REL: "E1A0C98A84E26B75958E890DE2706B26" },
            STATUS: 0,
          },
        ],
      });
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });

      const btnSuccess = wrapper.find(".btn-success");
      await btnSuccess.trigger("click");

      expect(axios.put).toHaveBeenCalledWith(
        "/lk/main/v2/datacard2/55/1000/502?rel=E89B40CC5734A78ADFE22496B28B1CE9",
        expect.any(FormData),
        expect.anything()
      );
    });
  });
  describe("/cabinet?ref=%2Fcabinet", () => {
    Vue.use(Vuex, BootstrapVue);
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    let store;
    let wrapper;
    let mockRoute;
    let mockRouter;

    beforeEach(async () => {
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };

      store = new Vuex.Store({
        modules: {
          uploader: {
            ...uploader,
            namespaced: true,
          },
          menu: {
            ...menu,
            namespaced: true,
          },
        },
      });
      process.server = true;
      store.$axios = axios;

      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("Страница UploaderPage загрузилась с прикрепленными файлами и с двумя кнопками", async () => {
      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(3);

      expect(files.at(0).text()).toBe("PASPORT.pdf");
      expect(files.at(1).text()).toBe("PTS.pdf");
      expect(files.at(2).text()).toBe("EPROTOKOL.jpeg");

      expect(wrapper.text()).toContain("Отправить документы");
      expect(wrapper.text()).toContain("Отменить");
    });

    it("Если указан 1 тип файла, то можно загрузить только его", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      copyOfData.data[1].value[0].TYPES_FILE = ["pdf"];

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf,");
      expect(wrapper.find('input[type="file"]').element.accept).not.toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
    });

    it("Если указан '[]' тип файла, то можно загрузить любой тип файла", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      copyOfData.data[1].value[0].TYPES_FILE = "[]";

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
    });

    it("Если указан null тип файла, то можно загрузить любой тип файла", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      copyOfData.data[1].value[0].TYPES_FILE = null;

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
    });

    it("Если указан undefined тип файла, то можно загрузить любой тип файла", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      copyOfData.data[1].value[0].TYPES_FILE = undefined;

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
    });

    it("Если тип файла вообще не указан, то можно загрузить любой тип файла", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      delete copyOfData.data[1].value[0].TYPES_FILE;

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
    });

    it("Если указано 2 типа файла, то можно загрузить только его", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      copyOfData.data[1].value[0].TYPES_FILE = ["pdf, jpeg"];

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf, jpeg,");
      expect(wrapper.find('input[type="file"]').element.accept).not.toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
    });

    it("Если не указан тип файла, то можно загрузить любой", async () => {
      const copyOfData = JSON.parse(JSON.stringify(returnFetchDataWithoutFiles));
      copyOfData.data[1].value[0].TYPES_FILE = [];

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      mockRoute = {
        params,
        path: "/cabinet/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {
          ref: "/cabinet",
        },
      };
      mockRouter = {
        push: jest.fn(),
      };
      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });

      expect(wrapper.find('input[type="file"]').element.accept).toBe(".pdf,.jpg,.jpeg,.bmp,.png,.tif,.gif,");
      expect(wrapper.find('input[type="file"]').element.accept).not.toBe(".pdf, jpeg,");
    });
  });

  describe("/wizard", () => {
    Vue.use(Vuex, BootstrapVue);
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    let store;
    let wrapper;
    let mockRoute;
    let mockRouter;

    beforeEach(async () => {
      mockRoute = {
        params,
        path: "/cabinet/wizard/55/0/1002/667/B60C1EC6B72506B2591A1EE6F99EEB17/uploader",
        query: {},
      };
      mockRouter = {
        push: jest.fn(),
      };

      store = new Vuex.Store({
        modules: {
          uploader: {
            ...uploader,
            namespaced: true,
          },
          menu: {
            ...menu,
            namespaced: true,
          },
        },
      });
      process.server = true;
      store.$axios = axios;

      const copyOfData = JSON.parse(JSON.stringify(returnFetchData));

      jest.spyOn(axios, "get").mockResolvedValueOnce({ data: copyOfData });
      await store.dispatch("uploader/fetchData", params);

      wrapper = mount(UploaderPage, {
        localVue,
        mocks: {
          $store: store,
          $route: mockRoute,
          $router: mockRouter,
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("Страница UploaderPage загрузилась с прикрепленными файлами и с двумя кнопками", async () => {
      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(3);

      expect(files.at(0).text()).toBe("PASPORT.pdf");
      expect(files.at(1).text()).toBe("PTS.pdf");
      expect(files.at(2).text()).toBe("EPROTOKOL.jpeg");

      expect(wrapper.text()).toContain("Отправить документы");
      expect(wrapper.text()).toContain("Назад");
    });

    it("Получили 4 файла, а на странице отображается 3 файла и они же записываются в JSON", async () => {
      const files = wrapper.findAll(".namefile");

      expect(returnFetchData.data[2].value.length).toBe(4);

      expect(files).toHaveLength(3);

      expect(files.at(0).text()).toBe("PASPORT.pdf");
      expect(files.at(1).text()).toBe("PTS.pdf");
      expect(files.at(2).text()).toBe("EPROTOKOL.jpeg");

      expect(JSON.parse(store.getters["uploader/getFormData"].get("JSON")).FILES.length).toBe(3);

      expect(JSON.parse(store.getters["uploader/getFormData"].get("JSON")).FILES.length).not.toBe(4);
    });

    it("Если файлы с одинвковым хэшом, то новый файл не отображается на странице", async () => {
      expect(wrapper.find(".error-blk").exists()).toBe(false);

      getHash.mockImplementation(() => "12345");
      const files = wrapper.findAll(".namefile");

      expect(files).toHaveLength(3);

      expect(files.at(0).text()).toBe("PASPORT.pdf");
      expect(files.at(1).text()).toBe("PTS.pdf");
      expect(files.at(2).text()).toBe("EPROTOKOL.jpeg");

      await wrapper.vm.compressFile("PASPORT", "1", "N");

      expect(wrapper.find(".error-blk").exists()).toBe(true);
      expect(files).toHaveLength(3);
    });
  });
});
