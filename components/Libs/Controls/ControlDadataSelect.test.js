import { mount } from "@vue/test-utils";
import AutoComplete from "./ControlDadataSelect.vue";

// Жесткие моки computed свойств
const computedMocks = {
  disabled: false,
  validClass: "",
  getCurrentValue: "test value",
  isFIOincludes: false,
};

describe("AutoComplete.vue - Emit Testing", () => {
  let wrapper;
  const defaultProps = {
    data: {
      label: "Марка и модель ТЕСТ",
      type: "DadataSelect",
      structType: "string",
      id: "1039",
      fieldId: 81299,
      cols: 4,
      colSm: 12,
      colMd: 12,
      isMask: false,
      colLg: 12,
      width: "100%",
      name: "SVEHICLE_MODEL",
      cssClass: "",
      webId: "",
      visible: true,
      required: true,
      page: 1,
      readonly: false,
      control: null,
      state: null,
      checked: null,
      error: null,
      placeholder: "Например, GEELY COOLRAY",
      isRelation: false,
      fieldRelation: null,
      isTab: true,
    },
    edit: true,
  };

  const createWrapper = (dataSet, props = {}, computedOverrides = {}) => mount(AutoComplete, {
      propsData: { ...dataSet, ...props },
      computed: { ...computedMocks, ...computedOverrides },
      mocks: {
        $store: {
          getters: {
            "data_card/getReadOnly": false,
          },
        },
      },
      stubs: {
        "b-form-group": true,
        "b-form-invalid-feedback": true,
        autocomplete: true,
        "vue-easy-tooltip": true,
      },
    });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("Проверяем emit у компонента", () => {
    it("emit update для поля name SVEHICLE_MODEL", () => {
      wrapper = createWrapper(defaultProps);

      wrapper.vm.handleSubmit({
        value: "CHEVROLET VIVA",
        unrestricted_value: "CHEVROLET VIVA",
        data: {
          brand_model_modification: "CHEVROLET VIVA",
          brand_id: "405188",
          brand: "CHEVROLET",
          brand_rus: null,
          model_id: "2494311",
          model: "VIVA",
          modification: null,
          brand_model_code: "720930",
          car_type: "Л",
        },
      });

      expect(wrapper.emitted().update).toBeTruthy();
      expect(wrapper.emitted().update[0]).toEqual([
        {
          fieldId: 81299,
          name: "SVEHICLE_MODEL",
          value: {
            brand: "CHEVROLET",
            brand_id: "405188",
            brand_model_code: "720930",
            brand_model_modification: "CHEVROLET VIVA",
            brand_rus: null,
            car_type: "Л",
            model: "VIVA",
            model_id: "2494311",
            modification: null,
          },
        },
      ]);
    });

    it("emit update для поля name !== SVEHICLE_MODEL", () => {
      defaultProps.data.name = "FIELD";
      wrapper = createWrapper(defaultProps);
      wrapper.vm.handleSubmit({
        value: "CHEVROLET VIVA",
        unrestricted_value: "CHEVROLET VIVA",
        data: {
          brand_model_modification: "CHEVROLET VIVA",
          brand_id: "405188",
          brand: "CHEVROLET",
          brand_rus: null,
          model_id: "2494311",
          model: "VIVA",
          modification: null,
          brand_model_code: "720930",
          car_type: "Л",
        },
      });

      expect(wrapper.emitted().update).toBeTruthy();
      expect(wrapper.emitted().update[0]).toEqual([
        {
          fieldId: 81299,
          name: "FIELD",
          value: "CHEVROLET VIVA",
        },
      ]);
    });
  });
});

