import { mount, shallowMount } from "@vue/test-utils";
import BrandLoader from "./BrandLoader.vue";

describe("BrandLoader", () => {
  test("Loader visible if isShowLoader is true", () => {
    const wrapper = mount(BrandLoader, {
      data(){
        return {
          isShowLoader: true
        }
      },
      mocks: {
        $store: {
          getters: {
            "ui/loader/isRequestsInProgress": true,
            "ui/loader/getShowLoader": true
          }
        }
      }
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();
  });

  test("Loader visible if Request start and loader required", () => {
    const wrapper = mount(BrandLoader, {
      data(){
        return {
          isShowLoader: false
        }
      },
      mocks: {
        $store: {
          getters: {
            "ui/loader/isRequestsInProgress": false,
            "ui/loader/getShowLoader": false
          }
        }
      }
    });

    expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
  });

  test("Loader must be invisible if Request is finish and loader required", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": true,
        "ui/loader/getShowLoader": true
      }
    }
    const wrapper = shallowMount(BrandLoader, {
      data(){
        return {
          isShowLoader: true
        }
      },
      mocks: {
        $store: store,
      }
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();
    store.getters["ui/loader/isRequestsInProgress"] = false;
    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).toBeFalsy()
    }, 200);
  });

  test("Loader must be visible if Request in progress and loader required", () => {
    const store = {
      getters: {
        "ui/loader/isRequestsInProgress": false,
        "ui/loader/getShowLoader": true
      }
    }
    const wrapper = shallowMount(BrandLoader, {
      data(){
        return {
          isShowLoader: true
        }
      },
      mocks: {
        $store: store,
      }
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
        "ui/loader/getShowLoader": true
      }
    }
    const wrapper = shallowMount(BrandLoader, {
      data(){
        return {
          isShowLoader: true
        }
      },
      mocks: {
        $store: store,
      }
    });

    expect(wrapper.element.querySelector(".overlay")).toBeTruthy();

    store.getters["ui/loader/getShowLoader"] = false;

    setTimeout(() => {
      expect(wrapper.element.querySelector(".overlay")).toBeFalsy();
    }, );
  });
});
