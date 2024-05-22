import Vue from "vue";
import { getOptions } from "./PluginModal.helper";

describe("Тайпгард для pluginModal", () => {
  it("Передаем строку и объект", () => {
    const data = getOptions("Hello", {
      icon: "ok",
    });
    expect(data).toMatchObject({ msg: "Hello", img: "ok" });
  });

  it("При пустых парамерах возвращаем дефолтные сообщения", () => {
    const data = getOptions();
    expect(data).toMatchObject({ msg: "Выполнить действие?", img: undefined });
  });

  it("Передаем строку (один параметр)", () => {
    const data = getOptions("Hello");
    expect(data).toMatchObject({ msg: "Hello", img: undefined });
  });

  it("Передаем объект (один параметр)", () => {
    const data = getOptions({
      icon: "ok",
    });
    expect(data).toMatchObject({ msg: "Выполнить действие?", img: "ok" });
  });

  it("Передаем объект (один параметр) возвращаем img error ", () => {
    const data = getOptions({
      icon: "error",
    });
    expect(data).toMatchObject({ msg: "Выполнить действие?", img: "error" });
  });

  it("Передаем объект (один параметр) параметры btnOk,title,msg,title", () => {
    const data = getOptions({
      icon: "alert",
      title: "Извините произошла ошибка",
      msg: "Повторите попытку позже",
      btnOk: false,
    });
    expect(data).toMatchObject({
      msg: "Повторите попытку позже",
      img: "alert",
      title: "Извините произошла ошибка",
      btnOk: false,
    });
  });

  it("Передаем Vue компонент", () => {
    const actionTemplate = {
      template: `<h5 class="modal-title">Выполнить действие?!</h5>`,
    };
    const vueComp = new Vue({
      props: {
        title: {
          type: String,
          required: false,
          default: () => "Выполнить действие?",
        },
      },
      computed: {
        message() {
          return "Выполнить действие?";
        },
      },
      slots: {
        template: actionTemplate.template,
      },
    });

    const data = getOptions(vueComp);

    expect(data.temp).toMatch(
      `<h5 class="modal-title">Выполнить действие?!</h5>`
    );
  });
});
