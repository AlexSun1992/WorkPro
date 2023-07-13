import { mount } from "@vue/test-utils";
import PasswordConfirm from "./ControlPasswordConfirm.vue";

describe("ControlPasswordConfirm", () => {
  let wrapper;

  const dataProps = {
    label: "Новый пароль",
    type: "PasswordConfirm",
    id: "962",
    fieldId: 47674,
    cols: 4,
    colSm: 12,
    colMd: 12,
    colLg: 12,
    width: "100%",
    name: "SNEWPASSWORDCONFIRM",
    cssClass: "",
    webId: "",
    visible: true,
    required: true,
    page: 0,
    readonly: false,
    control: null,
    state: null,
    checked: null,
    error: null,
    helpText:
      "Пароль должен содержать от 6 до 20 символов. Пароль должен содержать, как минимум, одну цифру и одну букву. Пароль не должен содержать русских букв и специальных символов.",
    isRelation: false,
    fieldRelation: null,
    isTab: false,
  };

  const createComponent = () => {
    wrapper = mount(PasswordConfirm, {
      propsData: {
        data: dataProps,
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("проверяем наличие класса is-valid у поля с паролем", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    getCodeInput.setValue("11111111Ff");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-valid");
  });

  it("проверяем наличие класса is-invalid", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    getCodeInput.setValue("111");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-invalid");
  });
  ///
  it("проверяем наличие класса is-invalid у поля с повторным паролем", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password2]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    await getCodeInput.setValue("11111111");
    wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-invalid");
  });

  it("проверяем наличие класса is-valid у полей при совпадении паролей", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getRepeatPasswordSelector = "[data-testid=password2]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    getCodeInput.setValue("111111FFFFa");
    await wrapper.vm.$nextTick();
    const getRepeatCode = await wrapper.find(getRepeatPasswordSelector);
    await getRepeatCode.setValue("111111FFFFa");
    expect(getCodeInput.classes()).toContain("is-valid");
    expect(getCodeInput.classes()).not.toContain("is-invalid");
    expect(getRepeatCode.classes()).toContain("is-valid");
    expect(getRepeatCode.classes()).not.toContain("is-invalid");
  });

  it("проверяем наличие класса is-invalid при отсутствии цифры в пароле", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    getCodeInput.setValue("FFFFFFFFF");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-invalid");
  });
});
