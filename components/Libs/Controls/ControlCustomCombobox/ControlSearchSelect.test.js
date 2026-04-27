import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlSearchSelect from "./ControlSearchSelect";
import { dataProps } from "./ControlCustomCombobox.helper.fixtures";

describe("ControlSearchSelect", () => {
  let wrapper;
  const store = { commit: () => {} };

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
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.inputDisplayValue).toBe("ААА");
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

    expect(wrapper.vm.inputDisplayValue).toContain("BBB");
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
    expect(wrapper.find(".form-group").find(".ui").classes()).not.toContain("disabled");
    expect(wrapper.vm.inputDisplayValue).toContain("ААА");
    expect(wrapper.html()).toContain("is-valid");
  });
  it("При клике на элемент из списка корректно срабатывает emit", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    const dataPropsValueString = JSON.parse(JSON.stringify(dataProps));
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

    await wrapper.find(".dropdown-wrapper").trigger("click");
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find("input.search-input");
    if (searchInput.exists()) {
      await searchInput.setValue("");
      await searchInput.trigger("input");
    }

    const firstItem = wrapper.findAll(".item").at(0);
    expect(firstItem.exists()).toBe(true);
    await firstItem.trigger("mousedown");

    expect(wrapper.emitted("update")).toEqual([
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
      {
        ID: 4,
        SNAME: "DDD",
        text: "DDD",
        value: 4,
      },
      {
        ID: 5,
        SNAME: "EEE",
        text: "EEE",
        value: 5,
      },
      {
        ID: 6,
        SNAME: "FFF",
        text: "FFF",
        value: 6,
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

    await wrapper.find(".dropdown-wrapper").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".item").length).toEqual(6);

    const searchInput = wrapper.find("input.search-input");

    expect(searchInput.exists()).toBe(true);
    await searchInput.setValue("C");

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
  it("вызываем update(null) если data.value не найден в options", async () => {
    const updateMock = jest.fn();
    const data = JSON.parse(JSON.stringify(dataProps));
    data.options[0].ID = 123;
    data.options[0].value = 123;

    wrapper = mount(ControlSearchSelect, {
      propsData: {
        data,
        edit: true,
      },
      mocks: {
        $store: {
          commit: jest.fn(),
        },
      },
      methods: {
        update: updateMock,
      },
    });

    expect(updateMock).toHaveBeenCalledWith(null);
    expect(updateMock).toHaveBeenCalledTimes(1);
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

    await wrapper.find(".dropdown-wrapper").trigger("click");
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find("input.search-input");
    expect(searchInput.exists()).toBe(true);

    await searchInput.setValue("ggg");
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain("Нет подходящих значений");
  });
  it("Ввели невалидное значение в инпут с серией, сработал blur", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.value = null;
    dataPropsValueString.options = [
      { ID: 1, SNAME: "ААА", text: "ААА", value: 1 },
      { ID: 2, SNAME: "BBB", text: "BBB", value: 2 },
      { ID: 3, SNAME: "CCC", text: "CCC", value: 3 },
      { ID: 4, SNAME: "DDD", text: "DDD", value: 4 },
      { ID: 5, SNAME: "EEE", text: "EEE", value: 5 },
      { ID: 6, SNAME: "FFF", text: "FFF", value: 6 },
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
    await wrapper.find(".dropdown-wrapper").trigger("click");
    await wrapper.vm.$nextTick();
    const searchInput = wrapper.find("input.search-input");
    expect(searchInput.exists()).toBe(true);
    await searchInput.setValue("ggg");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Нет подходящих значений");
    expect(wrapper.html()).toContain("Выберите значение из выпадающего списка");

    await searchInput.trigger("blur");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("update")).toBeUndefined();
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
    await wrapper.find(".dropdown-wrapper").trigger("click");
    await wrapper.vm.$nextTick();
    const searchInput = wrapper.find("input.search-input");
    expect(searchInput.exists()).toBe(true);
    await searchInput.setValue("fffff");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".dropdown-wrapper").classes()).toContain("is-invalid");
  });
  it.skip("Сначала ввели невалидное значение в инпут с серией, появился текст ошибки, затем выбрали валидное значение и текст с ошибкой исчез", async () => {
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

    await wrapper.find(".dropdown-wrapper").trigger("click");
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find("input.search-input");
    expect(searchInput.exists()).toBe(true);
    // невалидный ввод
    await searchInput.setValue("ффф");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".invalid-feedback").text()).toContain("Выберите значение из выпадающего списка");

    // валидный ввод
    await searchInput.setValue("ААА");
    await wrapper.vm.$nextTick();

    const target = wrapper.findAll(".item").wrappers.find((li) => li.text().trim() === "ААА");

    expect(target).toBeTruthy();
    await target.trigger("mousedown");
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".invalid-feedback").text().trim()).toBe("");
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
    expect(wrapper.find(".placeholder").exists()).toBe(true);
    expect(wrapper.find(".placeholder").text()).toBe("Список не найден");
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
    expect(wrapper.find(".ui").classes()).toContain("disabled");
    expect(wrapper.find(".placeholder").exists()).toBe(true);
    expect(wrapper.find(".placeholder").text()).toBe("Выберите из списка");
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
    expect(wrapper.find(".placeholder").exists()).toBe(true);
    expect(wrapper.find(".placeholder").text()).toBe("Test");
  });
});
