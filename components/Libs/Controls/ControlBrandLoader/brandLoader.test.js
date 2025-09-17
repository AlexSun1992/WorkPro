import { mount, shallowMount } from "@vue/test-utils";
import BrandLoader from "./BrandLoader.vue";

describe("BrandLoader", () => {
  test("Loader visible if isShowLoader is true", () => {
    const wrapper = mount(BrandLoader, {
      data() {
        return {
          isShowLoader: true,
          isCurrRequestContinue: true,
        };
      },
      mocks: {
        $store: {
          getters: {
            "ui/loader/isRequestsInProgress": true,
            "ui/loader/getShowLoader": true,
          },
        },
      },
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();
  });

  test("Loader visible if Request start and loader required", () => {
    const wrapper = mount(BrandLoader, {
      data() {
        return {
          isShowLoader: false,
        };
      },
      mocks: {
        $store: {
          getters: {
            "ui/loader/isRequestsInProgress": false,
            "ui/loader/getShowLoader": false,
          },
        },
      },
    });

    expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
  });

  test("Loader must be invisible if Request is finish and loader required", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": true,
        "ui/loader/getShowLoader": true,
      },
    };
    const wrapper = shallowMount(BrandLoader, {
      data() {
        return {
          isShowLoader: true,
        };
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();
    store.getters["ui/loader/isRequestsInProgress"] = false;
    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
    }, 200);
  });

  test("Loader must be visible if Request in progress and loader required", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": false,
        "ui/loader/getShowLoader": true,
      },
    };
    const wrapper = shallowMount(BrandLoader, {
      data() {
        return {
          isShowLoader: true,
        };
      },
      mocks: {
        $store: store,
      },
    });

    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
    }, 200);

    store.getters["ui/loader/isRequestsInProgress"] = true;
    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();
  });

  test("Loader must be invisible if Request in progress and loader disabled", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": true,
        "ui/loader/getShowLoader": true,
      },
    };
    const wrapper = shallowMount(BrandLoader, {
      data() {
        return {
          isShowLoader: true,
        };
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();

    store.getters["ui/loader/getShowLoader"] = false;

    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
    });
  });
  test("При наличии текущего запроса отображаем лоадер", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": true,
        "ui/loader/getShowLoader": true,
      },
    };
    const wrapper = shallowMount(BrandLoader, {
      data() {
        return {
          isShowLoader: false,
          isCurrRequestContinue: true,
        };
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();

    store.getters["ui/loader/getShowLoader"] = false;

    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
    });
  });

  test("При наличии текущего запроса отображаем лоадер", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": true,
        "ui/loader/getShowLoader": true,
      },
    };
    const wrapper = shallowMount(BrandLoader, {
      data() {
        return {
          isShowLoader: false,
          isCurrRequestContinue: false,
        };
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.element.querySelector(".overlay")).not.toBeTruthy();

    store.getters["ui/loader/getShowLoader"] = false;

    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).not.toBeTruthy();
    });
  });
  test("Отображаем лоадер если в него передан объект data со свойством filters : []", () => {
    const wrapper = mount(BrandLoader, {
      propsData: {
        url: "https://example.com/loader.json",
        data: { filters: [] },
      },
      data() {
        return {
          isShowLoader: true,
          isCurrRequestContinue: true,
        };
      },
      mocks: {
        $store: {
          getters: {
            "ui/loader/isRequestsInProgress": true,
            "ui/loader/getShowLoader": true,
          },
        },
      },
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();
  });
  test("Не отображаем лоадер если в него передан объект data и data.filters.length>0", () => {
    const wrapper = mount(BrandLoader, {
      propsData: {
        url: "https://example.com/loader.json",
        data: { filters: ["filter"] },
      },
      data() {
        return {
          isShowLoader: false,
          isCurrRequestContinue: false,
        };
      },
      mocks: {
        $store: {
          getters: {
            "ui/loader/isRequestsInProgress": true,
            "ui/loader/getShowLoader": true,
          },
        },
      },
    });

    expect(wrapper.element.querySelector(".overlay")).not.toBeTruthy();
  });
});
