import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import Vue from "vue";
import Vuex from "vuex";

import ParentToggle from "./ParentToggle.vue";
import * as blocks from "@/store/blocks";

describe("ParentToggle", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  beforeEach(async () => {
    store = new Vuex.Store({
      modules: {
        blocks: {
          ...blocks,
          state: {
            isCollapseVisible: true,
          },
          namespaced: true,
        },
      },
    });
    process.server = false;
    delete window.location;
    window.location = {};
    const getHrefSpy = jest.fn(() => "https://reso.ru/?LK2-889");
    Object.defineProperty(window.location, "href", {
      get: getHrefSpy,
    });
  });

  it("Фильтры отображаются на странице", async () => {
    wrapper = mount(ParentToggle, {
      localVue,
      mocks: {
        $store: store,
      },
    });
    expect(wrapper.find(".collapse_show").exists()).toBe(true);
  });
  it("Фильтры не отображаются на странице", async () => {
    wrapper = mount(ParentToggle, {
      localVue,
      mocks: {
        $store: store,
      },
    });
    await wrapper.find(".toggleControl").trigger("click");
    expect(wrapper.find(".collapse_hide").exists()).toBe(true);
  });
});
