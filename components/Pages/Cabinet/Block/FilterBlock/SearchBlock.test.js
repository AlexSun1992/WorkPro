import { mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import SearchBlock from "./SearchBlock.vue";

describe("Пишем компонентные тесты на SearchBlock", () => {
  Vue.use(Vuex);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  const wrapper = mount(SearchBlock, {
    localVue,
    mocks: {
      $route: {
        query: {},
      },
    },
  });

  it("Проверяем, что инпут пустой", async () => {
    expect(wrapper.find("input").element.value).toEqual("");
  });

  it("Проверяем, что в инпуте отображается введенный текст", async () => {
    const input = wrapper.find("input");

    await input.setValue("Городская клиническая больница");

    expect(wrapper.find("input").element.value).toEqual(
      "Городская клиническая больница"
    );
  });

  it("Проверяем, что при клике на кнопку текст удаляется", async () => {
    const input = wrapper.find("input");
    wrapper.find("button");

    await input.setValue("Городская клиническая больница");
    await wrapper.find("button").trigger("click");

    expect(wrapper.find("input").element.value).toEqual("");
  });
});
