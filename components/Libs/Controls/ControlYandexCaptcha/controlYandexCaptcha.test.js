import { shallowMount } from "@vue/test-utils";
import ControlYandexCaptcha from "./ControlYandexCaptcha";

import { loadScript, yandexCaptchaResetDecorator } from "./controlYandexCaptcha.helper";

jest.mock("@/components/Libs/Controls/ControlYandexCaptcha/controlYandexCaptcha.helper", () => ({
  loadScript: jest.fn(() => Promise.resolve()),
  yandexCaptchaResetDecorator: jest.fn(),
}));

const getWrapper = (propsData = {}) =>
  shallowMount(ControlYandexCaptcha, {
    propsData: {
      data: { fieldId: "42", name: "captchaField", ...propsData.data },
      sitekey: propsData.sitekey ?? "test-sitekey",
      invisible: propsData.invisible ?? true,
    },
  });

describe("ControlYandexCaptcha", () => {
  let originalSmartCaptcha;
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let warnSpy;
  let errorSpy;

  const createSmartCaptchaMock = () => ({
    render: jest.fn(() => 777),
    subscribe: jest.fn(),
    execute: jest.fn(),
    reset: jest.fn(),
    destroy: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();

    originalSmartCaptcha = window.smartCaptcha;

    addEventListenerSpy = jest.spyOn(window, "addEventListener");
    removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    window.smartCaptcha = originalSmartCaptcha;
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test.skip("computed id формируется из data.fieldId", () => {
    const wrapper = getWrapper({ data: { fieldId: "abc" } });

    expect(wrapper.vm.id).toBe("captcha-container-abc");
  });

  test.skip("mountScript: если window.smartCaptcha нет — добавляется listener на load", async () => {
    const wrapper = getWrapper();
    await Promise.resolve();
    await Promise.resolve();

    window.smartCaptcha = undefined;

    expect(loadScript).toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalledWith("load", wrapper.vm.onSmartCaptchaReady);

    wrapper.destroy();
  });

  test.skip("updateCaptcha: сохраняет customSuccessCallBack, затем reset + execute", async () => {
    const smartCaptcha = createSmartCaptchaMock();
    window.smartCaptcha = smartCaptcha;
    const wrapper = getWrapper();
    await Promise.resolve();
    await Promise.resolve();

    const cb = jest.fn();
    wrapper.vm.updateCaptcha(cb);

    expect(wrapper.vm.customSuccessCallBack).toBe(cb);
    expect(smartCaptcha.reset).toHaveBeenCalledWith(777);
    expect(smartCaptcha.execute).toHaveBeenCalledWith(777);
  });

  test.skip("onCaptchaSuccess: вызывает customSuccessCallBack один раз и эмитит update + captcha-updated", async () => {
    const smartCaptcha = createSmartCaptchaMock();
    const wrapper = getWrapper();

    window.smartCaptcha = smartCaptcha;

    await Promise.resolve();
    await Promise.resolve();

    const cb = jest.fn();
    wrapper.vm.updateCaptcha(cb);

    wrapper.vm.onCaptchaSuccess("TOKEN123");

    expect(cb).toHaveBeenCalledWith("TOKEN123");
    expect(wrapper.vm.customSuccessCallBack).toBeNull();

    expect(wrapper.emitted("captcha-updated")[0]).toEqual(["TOKEN123"]);
    expect(wrapper.emitted("update")[0]).toEqual([{ fieldId: "42", name: "captchaField", value: "TOKEN123" }]);
  });

  test.skip("onCaptchaError: логирует ошибку и эмитит пустое значение", async () => {
    const smartCaptcha = createSmartCaptchaMock();

    window.smartCaptcha = smartCaptcha;

    const wrapper = getWrapper();
    await Promise.resolve();
    await Promise.resolve();

    wrapper.vm.onCaptchaError(new Error("boom"));

    expect(errorSpy).toHaveBeenCalled();
    expect(wrapper.emitted("captcha-updated")[0]).toEqual([""]);
    expect(wrapper.emitted("update")[0]).toEqual([{ fieldId: "42", name: "captchaField", value: "" }]);
  });

  test.skip("captchaCleared: по умолчанию warn вызывается и value сбрасывается", async () => {
    const smartCaptcha = createSmartCaptchaMock();
    const wrapper = getWrapper();

    window.smartCaptcha = smartCaptcha;

    await Promise.resolve();
    await Promise.resolve();

    wrapper.vm.captchaCleared();

    expect(warnSpy).toHaveBeenCalled();
    expect(wrapper.emitted("captcha-updated")[0]).toEqual([""]);
  });

  test.skip("captchaCleared(false): без warn, но всё равно сбрасывает value", async () => {
    const smartCaptcha = createSmartCaptchaMock();
    const wrapper = getWrapper();

    window.smartCaptcha = smartCaptcha;

    await Promise.resolve();
    await Promise.resolve();

    wrapper.vm.captchaCleared(false);

    expect(warnSpy).not.toHaveBeenCalled();
    expect(wrapper.emitted("captcha-updated")[0]).toEqual([""]);
  });

  test.skip("beforeUnmount: снимает listener load и вызывает destroyCaptcha", async () => {
    const smartCaptcha = createSmartCaptchaMock();
    const wrapper = getWrapper();

    window.smartCaptcha = smartCaptcha;

    await Promise.resolve();
    await Promise.resolve();

    const destroyCaptchaSpy = jest.spyOn(wrapper.vm, "destroyCaptcha");

    wrapper.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("load", wrapper.vm.onSmartCaptchaReady);
    expect(destroyCaptchaSpy).toHaveBeenCalled();
    expect(smartCaptcha.destroy).toHaveBeenCalledWith(777);
  });

  test.skip("onSmartCaptchaReady: если this.captcha не задан — бросает ошибку", () => {
    const wrapper = getWrapper();

    wrapper.vm.captcha = null;

    expect(() => wrapper.vm.onSmartCaptchaReady()).toThrow("SmartCaptcha is not present");
  });
});
