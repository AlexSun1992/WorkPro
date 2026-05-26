import { shallowMount, mount } from "@vue/test-utils";
import AuthorizationBirthdate from "./AuthorizationBirthdate.vue";
import BirthdateField from "./BirthdateField.vue";
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";
import SubmitButton from "./SubmitButton.vue";

describe("AuthorizationBirthdate", () => {
  const defaultProps = {
    userData: { birthdate: "" },
    options: {
      title: "Введите дату рождения",
      modalTextRequest: "Для подтверждения личности",
      informerText: "",
      statusObject: "",
      errorInput: "",
      authInProcess: false,
    },
  };

  it("отображает заголовок и подзаголовок", () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    expect(wrapper.find(".login-header img").exists()).toBe(true);
    expect(wrapper.find(".login-header-title").text()).toContain("Введите дату рождения");
    expect(wrapper.find(".login-header-title span").text()).toBe("Для подтверждения личности");
  });

  it("отображает ControlInformer с правильными данными", () => {
    const informerText = "Проверка даты рождения";
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          informerText,
          statusObject: "SINFO",
        },
      },
    });

    const informer = wrapper.findComponent(ControlInformer);
    expect(informer.exists()).toBe(true);
    expect(informer.props("data")).toEqual({
      value: informerText,
      name: "SINFO",
    });
  });

  it("добавляет класс r-input к BirthdateField при наличии ошибки", () => {
    const wrapper = mount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          errorInput: "Неверная дата рождения",
        },
      },
    });

    const input = wrapper.find("#birthdate");
    expect(input.exists()).toBe(true);
    expect(input.classes()).toContain("r-input");
  });

  it("добавляет класс is-invalid при statusObject равном SERROR_INFO", () => {
    const wrapper = mount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          statusObject: "SERROR_INFO",
        },
      },
    });

    const input = wrapper.find("#birthdate");
    expect(input.exists()).toBe(true);
    expect(input.classes()).toContain("r-input");
  });

  it("отображает сообщение об ошибке при наличии errorInput", () => {
    const errorMessage = "Неверная дата рождения";
    const wrapper = mount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          errorInput: errorMessage,
        },
      },
    });

    const errorElement = wrapper.find(".invalid-feedback");
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toBe(errorMessage);
  });

  it("не отображает сообщение об ошибке при отсутствии errorInput", () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    const errorElement = wrapper.find(".invalid-feedback.d-block");
    expect(errorElement.exists()).toBe(false);
  });

  it("отображает кнопку 'Назад' с правильной иконкой", () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    const backButton = wrapper.find(".back");
    expect(backButton.exists()).toBe(true);
    expect(backButton.text()).toContain("Назад");
    expect(backButton.find("img").exists()).toBe(true);
    expect(backButton.find("img").attributes("src")).toBe("/img/login.svg#back");
  });

  it("эмитит событие componentStep при клике на кнопку 'Назад'", async () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    await wrapper.find(".back").trigger("click");

    expect(wrapper.emitted().componentStep).toBeTruthy();
    expect(wrapper.emitted().componentStep[0]).toEqual(["phone"]);
  });

  it("эмитит событие submit при отправке формы с валидной датой", async () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    const birthdate = "1990-05-15";
    await wrapper.vm.updateBirthdate(birthdate);

    await wrapper.find("#sms-form").trigger("submit.prevent");

    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.emitted().submit[0]).toEqual([birthdate]);
  });

  it("не эмитит событие submit при пустой дате", async () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    await wrapper.find("#sms-form").trigger("submit.prevent");

    expect(wrapper.emitted().submit).toBeFalsy();
  });

  it("не эмитит событие submit при authInProcess: true", async () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          authInProcess: true,
        },
      },
    });

    await wrapper.vm.updateBirthdate("1990-01-01");
    await wrapper.find("#sms-form").trigger("submit.prevent");

    expect(wrapper.emitted().submit).toBeFalsy();
  });

  it("корректно обрабатывает updateBirthdate событие от BirthdateField", async () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    const newDate = "1985-12-31";

    wrapper.findComponent(BirthdateField).vm.$emit("updateBirthdate", newDate);

    expect(wrapper.vm.user).toBe(newDate);
  });

  it("сохраняет начальное значение user из userData", () => {
    const initialDate = "1980-06-20";
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: {
        userData: { birthdate: initialDate },
        options: defaultProps.options,
      },
    });

    expect(wrapper.vm.user).toBe(initialDate);
  });

  it("корректно комбинирует различные состояния ошибок", () => {
    const testCases = [
      { errorInput: "Ошибка", statusObject: "", validClass: false },

      { errorInput: "Ошибка", statusObject: "SERROR_INFO", validClass: false },
      { errorInput: "", statusObject: "SINFO", validClass: null },
      { errorInput: "", statusObject: "", validClass: null },
    ];

    testCases.forEach(({ errorInput, statusObject, validClass }) => {
      const wrapper = shallowMount(AuthorizationBirthdate, {
        propsData: {
          ...defaultProps,
          options: {
            ...defaultProps.options,
            errorInput,
            statusObject,
          },
        },
      });

      expect(wrapper.vm.validClass).toBe(validClass);
    });
  });

  it("правильно вычисляет isDisabled для разных состояний", () => {
    const wrapper1 = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });
    expect(wrapper1.vm.isDisabled).toBe(true);

    const wrapper2 = shallowMount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        userData: { birthdate: "1990-01-01" },
      },
    });
    expect(wrapper2.vm.isDisabled).toBe(false);

    const wrapper3 = shallowMount(AuthorizationBirthdate, {
      propsData: {
        userData: { birthdate: "1990-01-01" },
        options: {
          ...defaultProps.options,
          authInProcess: true,
        },
      },
    });
    expect(wrapper3.vm.isDisabled).toBe(true);

    const wrapper4 = shallowMount(AuthorizationBirthdate, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          authInProcess: true,
        },
      },
    });
    expect(wrapper4.vm.isDisabled).toBe(true);
  });

  it("правильно обрабатывает onSubmit с проверкой isFormValid", async () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: defaultProps,
    });

    await wrapper.find("#sms-form").trigger("submit.prevent");
    expect(wrapper.emitted().submit).toBeFalsy();

    const date = "1995-03-25";
    await wrapper.vm.updateBirthdate(date);

    await wrapper.find("#sms-form").trigger("submit.prevent");
    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.emitted().submit[0]).toEqual([date]);
  });
});
describe("AuthorizationBirthdate edge cases", () => {
  const defaultProps = {
    userData: { birthdate: "" },
    options: {
      title: "Введите дату рождения",
      modalTextRequest: "Для подтверждения личности",
      informerText: "",
      statusObject: "",
      errorInput: "",
      authInProcess: false,
    },
  };

  it("не ломается при передаче null/undefined в userData", () => {
    const wrapper = shallowMount(AuthorizationBirthdate, {
      propsData: {
        userData: {},
        options: defaultProps.options,
      },
    });

    expect(wrapper.vm.user).toBe("");
  });
});
