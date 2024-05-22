import Vue from "vue";
import { createLocalVue, mount } from "@vue/test-utils";
import PluginModal from "./PluginModal";

describe("PluginModal", () => {
  const message = {
    POUTMESSAGE: "Уверены?",
  };

  const actionTemplate = {
    template: `
      <h5 class="modal-title">Выполнить действие?!</h5>
      `,
  };
  const vueComp = new Vue({
    props: {
      title: {
        type: String,
        required: false,
        default: () =>
          message?.POUTMESSAGE ? message?.POUTMESSAGE : "Выполнить действие?",
      },
    },
    computed: {
      message() {
        return message?.POUTMESSAGE
          ? message?.POUTMESSAGE
          : "Выполнить действие?";
      },
    },
    slots: {
      template: actionTemplate.template,
    },
  });
  const vueComponentWrapper = {
    template: `
      <div class='cabinet'>
        <button id='btn' @click="showModal()">click</button>
      </div>
            `,
    data() {
      return {};
    },
    methods: {
      showModal() {
        this.$confirm();
      },
    },
    computed: {
      isSlotTemplate() {
        return false;
      },
    },
  };
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper;
  let response;

  const createComponent = () => {
    const localValue = createLocalVue();
    localValue.use(PluginModal);
    const elem = document.createElement("div");
    if (document.body) {
      document.body.appendChild(elem);
    }
    wrapper = mount(vueComponentWrapper, {
      localValue,
      attachTo: elem,
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Дефолтная строка в метод alert(), проверяем отображение строки в шаблоне", async () => {
    createComponent();
    wrapper.vm.$modal.alert();

    expect(wrapper.text()).toContain("Выполнить действие?");
  });

  it("Передаем строку в метод alert(), проверяем отображение строки в шаблоне", async () => {
    createComponent();
    wrapper.vm.$modal.alert("Уверены?");

    expect(wrapper.text()).toContain("Уверены?");
  });

  it("$modal.alert возвращает Promise", async () => {
    createComponent();
    response = wrapper.vm.$modal.alert();

    expect(response).toBeInstanceOf(Promise);
  });

  it("Возвращаем true в promise при нажатии кнопки 'Выполнить'", async () => {
    createComponent();
    response = wrapper.vm.$modal.alert();
    wrapper.find(".btn-primary").trigger("click");

    await expect(response).resolves.toBe(true);
  });

  it("Возвращаем false в promise при нажатии кнопки 'Закрыть'", async () => {
    createComponent();
    response = wrapper.vm.$modal.alert();

    wrapper.find(".btn-modal-close").trigger("click");

    await expect(response).resolves.toBe(false);
  });

  it("Передаем Vue компонент в метод alert(), проверяем отображение компонента в шаблоне,ожидаем true", async () => {
    createComponent();
    response = wrapper.vm.$modal.alert(vueComp);

    expect(wrapper.find("#isSlotTemplate").exists()).toBe(true);
    expect(wrapper.find("#isSlotTemplate").text()).toEqual(
      "Выполнить действие?!"
    );

    wrapper.find(".btn-primary").trigger("click");
    await expect(response).resolves.toBe(true);
  });

  it("Передаем Vue компонент в метод alert(), проверяем отображение строки в шаблоне,ожидаем false", async () => {
    createComponent();
    response = wrapper.vm.$modal.alert(vueComp);

    expect(wrapper.find("#isSlotTemplate").exists()).toBe(true);
    expect(wrapper.find("#isSlotTemplate").text()).toEqual(
      "Выполнить действие?!"
    );

    wrapper.find(".btn-modal-close").trigger("click");

    await expect(response).resolves.toBe(false);
  });

  it("Не отображается иконка", async () => {
    createComponent();
    wrapper.vm.$modal.alert();

    const img = wrapper.find("img");

    expect(img.exists()).toBe(false);
  });

  it("Отображается иконка Ок", async () => {
    createComponent();
    wrapper.vm.$modal.alert({
      icon: "ok",
    });

    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/img/icon-ok.svg");
  });

  it("Отображается иконка Ок-2", async () => {
    createComponent();
    wrapper.vm.$modal.alert("Hello!", {
      icon: "ok",
    });

    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/img/icon-ok.svg");
  });

  it("Отображается иконка Error", async () => {
    createComponent();
    wrapper.vm.$modal.alert("Hello!", {
      icon: "error",
    });

    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/img/icon-error.svg");
  });

  it("Проверяем отображение кнопки при параметре btnOk===false", () => {
    createComponent();
    wrapper.vm.$modal.alert({
      btnOk: false,
    });

    const btn = wrapper.find(".btn-primary");

    expect(btn.exists()).toBe(false);
  });

  it("Проверяем наличие иконки при ее передаче в качестве аргумента", () => {
    createComponent();
    wrapper.vm.$modal.alert({
      icon: "alert",
    });

    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/img/icon-alert.svg");
  });

  it("Проверяем отсутствие иконки при непередаче ее в качестве аргумента", () => {
    createComponent();
    wrapper.vm.$modal.alert({});

    const img = wrapper.find("img");

    expect(img.exists()).toBe(false);
  });

  it("Проверяем правильность передачу сообщения", () => {
    createComponent();
    wrapper.vm.$modal.alert({
      title: "Извините произошла ошибка",
    });

    const title = wrapper.find(".modal-title");

    expect(title.text()).toEqual("Извините произошла ошибка");
  });

  it("Проверяем отображение кнопки при параметре btnOk===true", () => {
    createComponent();
    wrapper.vm.$modal.alert({
      btnOk: true,
    });

    const btn = wrapper.find(".btn-primary");

    expect(btn.exists()).toBe(true);
  });

  it("Проверяем отсутствие иконки (в аргументе не передаем)", () => {
    createComponent();
    wrapper.vm.$modal.alert({});

    const img = wrapper.find("img");

    expect(img.exists()).toBe(false);
  });

  it("Проверяем отображение кнопки без параметра btnOk===true", () => {
    createComponent();
    wrapper.vm.$modal.alert({});

    const btn = wrapper.find(".btn-primary");

    expect(btn.exists()).toBe(true);
  });

  it("Проверяем отображение заголовка при передачи его в качестве аргумента", () => {
    createComponent();
    wrapper.vm.$modal.alert({
      icon: "alert",
      msg: "Повторите попытку позже",
    });

    const titleModal = wrapper.find("#modalTitle");

    expect(titleModal.exists()).toBe(false);
  });
});
