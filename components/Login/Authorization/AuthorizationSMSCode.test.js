import { mount } from "@vue/test-utils";
import AuthorizationSMSCode from "./AuthorizationSMSCode.vue";

jest.mock("@/components/Libs/VerifyUser/VerifyTimer", () => ({
  name: "VerifyTimer",
  props: ["duration"],
  template: '<div data-testid="mocked-timer">{{ duration }}s</div>',
  emits: ["onFinish"],
}));

jest.mock("vue-the-mask", () => ({
  TheMask: {
    name: "TheMask",
    props: ["value", "mask", "masked", "placeholder", "disabled", "required"],
    data() {
      return {
        internalValue: this.value || "",
      };
    },
    watch: {
      value(newVal) {
        this.internalValue = newVal;
      },
    },
    template: `
      <input 
        :value="internalValue" 
        @input="$emit('input', $event.target.value)" 
        :placeholder="placeholder" 
        :disabled="disabled"
        :required="required"
        data-testid="authSMSCode"
      />
    `,
    emits: ["input"],
  },
}));

describe("AuthorizationSMSCode", () => {
  const defaultProps = {
    userData: { code: "" },
    options: {
      title: "Введите код",
      modalTextRequest: "Мы отправили SMS на ваш номер",
      mask: "####",
      placeholder: "0000",
      label: "Код из смс",
      errorInput: "",
      isRetrySendCodeSMS: false,
      duration: 60,
      authInProcess: false,
    },
  };

  it("отображает сообщение об ошибке под полем ввода при наличии ошибки", () => {
    const errorMessage = "Неверный код подтверждения";
    const wrapper = mount(AuthorizationSMSCode, {
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

    const inputContainer = wrapper.find('[data-testid="authSMSCode"]');

    expect(inputContainer.html()).toContain("input-box");
    expect(inputContainer.html()).toContain("r-error");

    const label = wrapper.find("label");
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe("0000");
  });

  it("не отображает сообщение об ошибке при отсутствии ошибки", () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: defaultProps,
    });

    const errorElement = wrapper.find(".invalid-feedback.d-block");
    expect(errorElement.exists()).toBe(false);

    const input = wrapper.find('[data-testid="authSMSCode"]');
    expect(input.classes()).not.toContain("is-invalid");
  });

  it("Заголовок и подзаголовок отображаются корректно.", () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: defaultProps,
    });

    expect(wrapper.find(".login-header-title").text()).toContain("Введите код");
    expect(wrapper.find(".login-header-title span").text()).toBe("Мы отправили SMS на ваш номер");
  });

  it('emits "submit" когда форма отправлена ​​с валидным кодом', async () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: defaultProps,
    });

    const input = wrapper.find("input");
    await input.setValue("1234");

    await wrapper.find("#sms-form").trigger("submit.prevent");

    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.emitted().submit[0]).toEqual(["1234"]);
  });

  it('emits "submit" , когда длина кода соответствует маске', async () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: {
        ...defaultProps,
        options: { ...defaultProps.options, mask: "###" },
      },
    });

    const input = wrapper.find("input");
    await input.setValue("123");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.emitted().submit[0]).toEqual(["123"]);
  });

  it('emits "componentStep" с "phone"когда кнопка назад была кликнута', async () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: defaultProps,
    });

    await wrapper.find(".back").trigger("click");

    expect(wrapper.emitted().componentStep).toBeTruthy();
    expect(wrapper.emitted().componentStep[0]).toEqual(["phone"]);
  });

  it('Очищает поле ввода и при повторной попытке отправляет сообщение "submit" с пустой строкой.', async () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: {
        userData: { code: "" },
        options: {
          title: "Введите код",
          modalTextRequest: "Мы отправили SMS на ваш номер",
          mask: "####",
          placeholder: "0000",
          errorInput: "",
          isRetrySendCodeSMS: true,
          duration: 60,
          authInProcess: false,
        },
      },
    });

    const input = wrapper.find("input");

    await input.setValue("9999");
    await wrapper.find(".sms_code").trigger("click");

    expect(wrapper.vm.user).toBe("");
    expect(wrapper.emitted().submit).toBeTruthy();

    const lastEmitIndex = wrapper.emitted().submit.length - 1;
    expect(wrapper.emitted().submit[lastEmitIndex]).toEqual([""]);
  });

  it("Отключает ввод, если authInProcess имеет значение true.", () => {
    const wrapper = mount(AuthorizationSMSCode, {
      propsData: {
        ...defaultProps,
        options: { ...defaultProps.options, authInProcess: true },
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("disabled")).toBe("disabled");
  });
});
