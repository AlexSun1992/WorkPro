import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlSearchSelect from "./ControlSearchSelect";
import { dataProps } from "./ControlCustomCombobox.helper.fixtures";

describe("ControlSearchSelect", () => {
  let wrapper;
  let store;

  beforeEach(async () => {
    Vue.use(BootstrapVue);
  });

  it("Когда загрузилась страница, input с серией стал is-valid, если в value пришли цифры и список состоит из 1 значения", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const props = JSON.parse(JSON.stringify(dataProps));
    props.value = 1;

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text").text()).toContain("ААА");
    expect(wrapper.html()).toContain("is-valid");
  });

  it("Когда загрузилась страница,  если в value пришли цифра, то значение отображается на странице и список состоит из нескольких значений", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.options = [
      {
        ID: 1,
        SNAME: "ААА",
        text: "ААА",
        value: 1,
      },
      {
        ID: 2,
        SNAME: "BBB",
        text: "BBB",
        value: 2,
      },
    ];
    dataPropsValueString.value = 2;

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text").text()).toContain("BBB");
    expect(wrapper.html()).toContain("is-valid");
    expect(wrapper.html()).not.toContain("is-invalid");
  });
  it("Когда загрузилась страница,  если в value пришли буквы", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.options = [
      {
        ID: "ААА",
        SNAME: "ААА",
        text: "ААА",
        value: "ААА",
      },
      {
        ID: "BBB",
        SNAME: "BBB",
        text: "BBB",
        value: "BBB",
      },
    ];
    dataPropsValueString.value = "ААА";

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(".form-group").find(".ui").classes()).not.toContain(
      "disabled"
    );
    expect(wrapper.find(".text").text()).toContain("ААА");
    expect(wrapper.html()).toContain("is-valid");
  });
  it("При клике на элемент из списка корректно срабатывает emit", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.find("input").trigger("click");
    await wrapper.find("input").setValue("");
    await wrapper.vm.$nextTick();
    await wrapper.find(".item").trigger("click");
    expect(wrapper.emitted().update).toEqual([
      [
        {
          fieldId: 37106,
          name: "SSERIES",
          type: "customCombobox",
          value: 1,
        },
      ],
    ]);
  });
  it("При введении текста появляется нужный элемент  из списка и при  клике на этот элемент из списка срабатывает emit", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.options = [
      {
        ID: 1,
        SNAME: "ААА",
        text: "ААА",
        value: 1,
      },
      {
        ID: 2,
        SNAME: "BBB",
        text: "BBB",
        value: 2,
      },
      {
        ID: 3,
        SNAME: "CCC",
        text: "CCC",
        value: 3,
      },
    ];

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.findAll(".item").length).toEqual(3);

    await wrapper.find("input").setValue("C");
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".item").length).toEqual(1);

    await wrapper.find(".item").trigger("click");
    expect(wrapper.emitted().update).toEqual([
      [
        {
          fieldId: 37106,
          name: "SSERIES",
          type: "customCombobox",
          value: 3,
        },
      ],
    ]);
  });
  it("Ввели невалидное значение в инпут с серией, появился текст с ошибкой", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent("input");
    await getCodeInput.setValue("ggg");

    expect(wrapper.html()).toContain(`Выберите значение из выпадающего списка`);

    await getCodeInput.trigger("blur");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".text").text()).toEqual("ААА");
  });
  it("Ввели невалидное значение в инпут с серией, сработал blur", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.options = [
      {
        ID: 1,
        SNAME: "ААА",
        text: "ААА",
        value: 1,
      },
      {
        ID: 2,
        SNAME: "BBB",
        text: "BBB",
        value: 2,
      },
      {
        ID: 3,
        SNAME: "CCC",
        text: "CCC",
        value: 3,
      },
    ];

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent("input");
    await getCodeInput.setValue("ggg");

    expect(wrapper.html()).toContain(`Выберите значение из выпадающего списка`);

    await getCodeInput.trigger("blur");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().update).toEqual([
      [
        {
          fieldId: 37106,
          name: "SSERIES",
          type: "customCombobox",
          value: null,
        },
      ],
    ]);
    expect(wrapper.find(".text").text()).toEqual("Выберите из списка");
  });
  it("Автозаполнение", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.options = [
      {
        ID: 1,
        SNAME: "ААА",
        text: "ААА",
        value: 2,
      },
    ];

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    wrapper.vm.$options.watch.options.call(wrapper.vm, [
      {
        ID: 1,
        SNAME: "ААА",
        text: "ААА",
        value: 2,
      },
    ]);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().update).toEqual([
      [
        {
          fieldId: 37106,
          name: "SSERIES",
          type: "customCombobox",
          value: 2,
        },
      ],
    ]);
  });
  it("Ввели невалидное значение,класс у инпута с серией стал is-invalid", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent("input");
    await getCodeInput.setValue("fffff");
    expect(wrapper.find(".is-invalid").exists()).toBe(true);
  });
  it("Сначала ввели невалидное значение в инпут с серией, появился текст ошибки, затем выбрали валидное значение и текст с ошибкой исчез", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.find("input").setValue("ффф");
    await wrapper.find("input").trigger("blur");

    expect(wrapper.find(".invalid-feedback").text()).toContain(
      "Выберите значение из выпадающего списка"
    );

    await wrapper.find("input").setValue("ААА");

    expect(wrapper.find(".invalid-feedback").text()).toContain("");
  });
  it("Справочник вернул пустое значение", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.options = [];

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    expect(wrapper.find(".form-group").find(".ui").classes()).toContain(
      "disabled"
    );
    expect(wrapper.find(".text").text()).toEqual("Список не найден");
  });
  it("Правильно отображается placeholder во время загрузки нового справочника", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.isLoading = true;
    dataPropsValueString.options = [];

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.find(".form-group").find(".ui").classes()).toContain(
      "disabled"
    );
    expect(wrapper.find(".text").text()).toEqual("Выберите из списка");
  });
  it("Правильно отображается placeholder при загруженном справочнике", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.placeholder = "Test";
    dataPropsValueString.options = [];

    wrapper = mount(ControlSearchSelect, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.find(".text").text()).toEqual("Test");
  });
});
