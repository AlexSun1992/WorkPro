import { mount } from "@vue/test-utils";
import ControlCustomComboboxJSON from "./ControlCustomComboboxJSON";
import { comboboxPropsDataJSON } from "./controlCustomCombobox.fixtures";

const mocks = {
  $store: {
    commit: () => {},
    dispatch: () => {},
    getters: {
      "data_card/getDataFieldByFieldId": () => ({
        options: [
          {
            SSPECIALIST: "Аллерголог",
            IDLPU: 0,
            IDLPUFILTR: 0,
            SNAME: "Аллерголог",
            IDSPECIALIST: 126,
            IDDOCTOR: 0,
            ID: 126,
          },
        ],
      }),
      "data_card/getDataFieldsByNames": () => {},
    },
  },
};

function getWrapper(data = {}) {
  const defaultData = {
    mocks: {
      $store: {
        commit: () => {},
        getters: {
          "data_card/getDataFieldByFieldId": () => {},
        },
      },
    },
  };

  return mount(ControlCustomComboboxJSON, Object.assign(defaultData, data));
}

describe.skip("ControlCustomComboboxJSON", () => {
  test("Проверка вспомогательного метода", () => {
    expect(
      getWrapper({
        propsData: { data: comboboxPropsDataJSON, edit: true },
      }).vm
    ).toBeTruthy();
  });

  test("При инициализации компонента value должно быть пустым объектом", () => {
    const wrapper = getWrapper({
      propsData: { data: comboboxPropsDataJSON, edit: true },
    });

    expect(wrapper.vm.$refs.autocomplete.value === null);
  });

  test("При выборе значения срабатывает событие Update", () => {
    const wrapper = getWrapper({
      propsData: { data: comboboxPropsDataJSON, edit: true, isMap: false },
    });

    expect(wrapper.emitted("update")).toBeFalsy();

    wrapper.vm.$refs.autocomplete.$emit("submit");

    expect(wrapper.emitted("update").length).toBe(1);
  });

  test("Отображание сообщения если данные не наедены", async () => {
    const localMocks = { ...mocks };
    localMocks.$store.getters["data_card/getDataFieldByFieldId"] = () => ({ value: {} });
    const wrapper = getWrapper({
      propsData: { data: comboboxPropsDataJSON, edit: true },
      setMethods: {},
      mocks: localMocks,
    });
    const text = "ПТС";
    jest.spyOn(wrapper.vm, "getOptions").mockImplementation(() => {});

    await wrapper.vm.search(text);

    expect(wrapper.html().includes(`По фразе "${text}" ничего не найдено`)).toBeTruthy();
  });

  test("Отображается наеденный текст", async () => {
    const value = {
      text: "Аллерголог",
      value: {
        SSPECIALIST: "Аллерголог",
        IDLPU: 0,
        IDLPUFILTR: 0,
        SNAME: "Аллерголог",
        IDSPECIALIST: 176,
        IDDOCTOR: 0,
        ID: 176,
      },
    };
    const localMocks = { ...mocks };
    localMocks.$store.getters["data_card/getDataFieldByFieldId"] = () => ({ value });
    const wrapper = getWrapper({
      propsData: {
        data: {
          ...comboboxPropsDataJSON,
          value: {
            text: "Аллерголог",
            value: {
              SSPECIALIST: "Аллерголог",
              IDLPU: 0,
              IDLPUFILTR: 0,
              SNAME: "Аллерголог",
              IDSPECIALIST: 176,
              IDDOCTOR: 0,
              ID: 176,
            },
          },
        },
        edit: true,
      },
      setMethods: {},
      mocks: localMocks,
    });
    jest.spyOn(wrapper.vm, "getOptions").mockImplementation(() => {});

    await wrapper.vm.search("Алл");

    expect(wrapper.vm.$refs.autocomplete.value === wrapper.vm.currentValue.text).toBeTruthy();
  });

  test("handleSubmit Должен завершить своё выполнение при лучении значения равного текущему value без выполнения UPDATE", () => {
    const value = {
      text: "Аллерголог",
      value: {
        SSPECIALIST: "Аллерголог",
        IDLPU: 0,
        IDLPUFILTR: 0,
        SNAME: "Аллерголог",
        IDSPECIALIST: 176,
        IDDOCTOR: 0,
        ID: 176,
      },
    };
    const localMocks = { ...mocks };
    localMocks.$store.getters["data_card/getDataFieldByFieldId"] = () => ({ value });
    const wrapper = getWrapper({
      propsData: {
        data: {
          ...comboboxPropsDataJSON,
          value,
        },
        edit: true,
      },
      setMethods: {},
      mocks: localMocks,
    });

    wrapper.vm.handleSubmit(value.value);
    expect(wrapper.emitted().update).toBeFalsy();
  });

  test("handleSubmit Должен выполнить UPDATE с данными", () => {
    const value = {
      text: "Аллерголог",
      value: {
        SSPECIALIST: "Аллерголог",
        IDLPU: 0,
        IDLPUFILTR: 0,
        SNAME: "Аллерголог",
        IDSPECIALIST: 176,
        IDDOCTOR: 0,
        ID: 176,
      },
    };
    const wrapper = getWrapper({
      propsData: {
        data: {
          ...comboboxPropsDataJSON,
          value: value.value,
        },
        edit: true,
      },
      setMethods: {},
      mocks,
    });

    wrapper.vm.handleSubmit({ value: 1 });

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0][0].value).toStrictEqual({ value: { value: 1 }, text: null });
  });
});
