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
    labelCols: "",
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

  it.only("проверяем наличие класса is-valid у поля с паролем", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    await getCodeInput.setValue("11111111F");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-valid");
    // expect(getCodeInput.classes()).not.toContain("is-invalid");
  });
  it.only("проверяем наличие класса is-invalid", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    await getCodeInput.setValue("111");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-invalid");
  });
  ///
  it.only("проверяем наличие класса is-invalid у поля с повторным паролем", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password2]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    await getCodeInput.setValue("11111111");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-invalid");
  });
  ///
  it.only("проверяем наличие класса is-valid у полей при совпадении паролей", async () => {
    createComponent();
    const getPasswordSelector = "[data-testid=password1]";
    const getRepeatPasswordSelector = "[data-testid=password2]";
    const getCodeInput = await wrapper.find(getPasswordSelector);
    await getCodeInput.setValue("111111FFFF");
    await wrapper.vm.$nextTick();
    //
    const getRepeatCode = await wrapper.find(getRepeatPasswordSelector);
    await getRepeatCode.setValue("111111FFFF");
    expect(getCodeInput.classes()).toContain("is-valid");
    expect(getCodeInput.classes()).not.toContain("is-invalid");
    //
    expect(getRepeatCode.classes()).toContain("is-valid");
    expect(getRepeatCode.classes()).not.toContain("is-invalid");
  });

  // it("проверяем отсутствия атрибута у кнопки замены пароля", async () => {
  //   createComponent();
  //   const getPasswordSelector = "[data-testid=password1]";
  //   const getRepeatPasswordSelector = "[data-testid=password2]";
  //   const getCodeInput = await wrapper.find(getPasswordSelector);
  //   await getCodeInput.setValue(111111);
  //   await wrapper.vm.$nextTick();
  //   //
  //   const getRepeatCode = await wrapper.find(getRepeatPasswordSelector);
  //   await getRepeatCode.setValue(111111);
  //   //
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = await wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe(undefined);
  // });

  // it("проверяем наличие атрибута disabled у кнопки замены пароля при несовпадении пароля", async () => {
  //   createComponent();
  //   const getPasswordSelector = "[data-testid=password1]";
  //   const getRepeatPasswordSelector = "[data-testid=password2]";
  //   const getCodeInput = await wrapper.find(getPasswordSelector);
  //   await getCodeInput.setValue(111111);
  //   await wrapper.vm.$nextTick();
  //   //
  //   const getRepeatCode = await wrapper.find(getRepeatPasswordSelector);
  //   await getRepeatCode.setValue(11111111);
  //   //
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = await wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe("disabled");
  // });

  // it("проверяем наличие класса 'is-invalid' при потери фокуса поля с паролем и наличие аттрибута disabled у кнопки замены пароля", async () => {
  //   createComponent();
  //   const getPasswordSelector = "[data-testid=password1]";
  //   const getCodeInput = await wrapper.find(getPasswordSelector);
  //   getCodeInput.trigger("focus");
  //   getCodeInput.trigger("blur");
  //   await wrapper.vm.$nextTick();
  //   //
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = await wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe("disabled");
  //   expect(getCodeInput.classes()).toContain("is-invalid");
  // });

  // it("проверяем наличие класса 'is-invalid' при потери фокуса поля с повторением пароля и наличие аттрибута disabled у кнопки замены пароля", async () => {
  //   createComponent();
  //   const getPasswordSelector = "[data-testid=password2]";
  //   const getCodeInput = await wrapper.find(getPasswordSelector);
  //   getCodeInput.trigger("focus");
  //   getCodeInput.trigger("blur");
  //   await wrapper.vm.$nextTick();
  //   //
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = await wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe("disabled");
  //   expect(getCodeInput.classes()).toContain("is-invalid");
  // });

  // it("проверяем наличие атрибута disabled у кнопки замены пароля при заполнении поля с паролем", async () => {
  //   createComponent();
  //   const getPasswordSelector = "[data-testid=password1]";
  //   const getCodeInput = await wrapper.find(getPasswordSelector);
  //   await getCodeInput.setValue(111111);
  //   await wrapper.vm.$nextTick();
  //   //
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = await wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe("disabled");
  // });

  // it("проверяем наличие атрибута disabled у кнопки замены пароля при заполнении поля с повторением пароля", async () => {
  //   createComponent();
  //   const getRepeatPasswordSelector = "[data-testid=password2]";
  //   //
  //   const getRepeatCode = await wrapper.find(getRepeatPasswordSelector);
  //   await getRepeatCode.setValue(11111111);
  //   //
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = await wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe("disabled");
  // });

  // it("проверяем наличие атрибута disabled у кнопки замены пароля", () => {
  //   const getReplaceBtnSelector = "[data-testid=passwordBtn]";
  //   const getReplaceBtn = wrapper.find(getReplaceBtnSelector);
  //   expect(getReplaceBtn.attributes("disabled")).toBe("disabled");
  // });

  ///
  // it("проверяем наличие атрибута disabled у кнопки замены пароля при введении пароля > 20 символов", async () => {
  //   createComponent();
  //   const value = 111111111111111111111n;
  //   const getPasswordSelector = "[data-testid=password1]";
  //   const getCodeInput = await wrapper.find(getPasswordSelector);
  //   await getCodeInput.setValue(value);
  //   await wrapper.vm.$nextTick();
  //   expect(getCodeInput.classes()).toContain("is-invalid");
  // });

  // it("проверяем наличие атрибута disabled у кнопки замены пароля при повторном введении пароля > 20 символов", async () => {
  //   createComponent();
  //   const value = 111111111111111111111n;
  //   const getRepeatPasswordSelector = "[data-testid=password2]";
  //   const passwordInput = await wrapper.find(getRepeatPasswordSelector);

  //   await passwordInput.setValue(value);
  //   await wrapper.vm.$nextTick();
  //   //
  //   const getRepeatCode = await wrapper.find(getRepeatPasswordSelector);
  //   await getRepeatCode.setValue(value);
  //   //
  //   expect(passwordInput.classes()).toContain("is-invalid");
  // });
});
